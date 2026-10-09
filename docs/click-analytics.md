# クリック計測（プライバシー配慮型）

購入CTA（`data-cta-event` 付きリンク）のクリックを、**第三者サービスを使わず**、
同じサイトの Cloudflare Pages Function で受け取る自己完結型の計測。

## プライバシー設計

- 保存するのは **イベント種別（page_view / purchase）/ 商品ID / 配置（placement）/ ページパス / 流入元（src・ref）/ 時刻** のみ
- 流入元は、リンクの `?src=`（x / instagram など、英数字・_・-の24文字まで）と、参照元の **ホスト名だけ**（パス・クエリは保存しない）。最初の流入を、同じタブの間だけ `sessionStorage` に保持する（Cookie や端末を識別する値は作らない）
- 自動操作（`navigator.webdriver`）のブラウザは数えない
- Cookie・フィンガープリント・**IP アドレスは収集・保存しない**
  （IP はレート制限の判定に一時使用するだけ）
- 通信はすべて同一オリジン（`/api/events`）。第三者ドメインへは送信しない
- CSP は既存の `script-src 'self'` / `connect-src 'self'` でそのまま通る（変更不要）

## 構成

- **クライアント**: `public/click-beacon.js`（classic スクリプト）
  - `BaseLayout.astro` が `<script src="/click-beacon.js" defer>` で読み込む
    （同一オリジンのファイルとして配信されるため厳格 CSP でも許可される。
    Astro のバンドル script は小さいと `<script type="module">` にインライン化され
    CSP でブロックされるため、あえて public 配信にしている）
  - `navigator.sendBeacon('/api/events', Blob)`、不可なら `fetch(..., {keepalive: true})`
  - `[data-cta-event]` を含む要素のクリックを捕捉し、`event / productId / placement / path` を送信
  - 計測失敗は黙って無視（ユーザー体験に影響させない）
- **受信口**: `functions/api/events.ts`（POST `/api/events`）
  - サイズ上限 4KB、JSON 検証
  - イベント名・placement は `config/article-layout.mjs` の許可リストで検証
    （レイアウト契約と同一の情報源から導出）
  - 同一IP 1分あたり60件のレート制限（`ANALYTICS_RATE_LIMITER`、fail-open）
  - 保存先は任意の `ANALYTICS_KV`（Workers KV）。未設定・障害時はイベントを破棄して 204 を返す

## 保存形式（KV 有効時）

- キー: `v1:events:YYYY-MM-DD:<uuid>`（日別・追記型で読み書き競合なし）
- 値: `{"event", "productId", "placement", "linkType", "path", "src", "ref", "at"}`（IP・ユーザー識別子は含まない。項目は、あるものだけ保存）
- TTL: 90日。集計は外部のダッシュボードやスクリプトで行う

## KV の有効化手順

本番は `wrangler pages deploy`（Cloudflare Pages への直接アップロード）でデプロイする。Pages Functions の KV は、**Pages プロジェクトの設定で紐づける**（`wrangler.jsonc` の `kv_namespaces` は、この配備方式では使われない可能性が高いため、変更しない）。

1. namespace を作成する（作成済み: `kuraberu-events`、id `96b93901d4d3455aa3f0823a57f8b6c0`、2026-09-30）
   `pnpm exec wrangler kv namespace create kuraberu-events`
2. Cloudflare ダッシュボード → Workers & Pages → `kuraberu-products` → 設定 → バインディング → 追加 → **KV namespace**
   変数名 `ANALYTICS_KV`、namespace `kuraberu-events`（本番環境）
3. 次の本番デプロイ（`Deploy production`）から、`/api/events` が KV に書き込む（バインディングは、設定後のデプロイから有効）

未設定のままでもサイトと計測の送信側は動作し続ける（保存だけが行われない）。

### 制限

- Workers KV の無料プランは、書き込みが 1 日 1,000 件まで。ページ表示（page_view）も 1 件ずつ保存するため、1 日の表示が約 1,000 を超えると、超過分のイベントは保存されずに破棄される（サイトの動作には影響しない）。増えたら、Workers Paid への切り替え、または集計方式の見直しを検討する。
- 保存期間は最大 90 日。

## 集計

```bash
pnpm report:analytics                       # 直近7日
pnpm report:analytics -- --days 30
pnpm report:analytics -- --namespace-id <id>
```

ローカルの `wrangler`（ログイン済み）で KV を **読み取り専用** で読み、日別のページ表示・購入クリック・クリック率、流入元別、配置別、リンク種別別、商品別、ページ別を出力する。注文（購入）は保存していない。楽天アフィリエイトと Amazon アソシエイトの管理画面のレポートで確認する。

## 流入元の付け方

SNS などに貼るリンクの末尾に `?src=<ラベル>` を付ける（例: `https://kuraberu-products.pages.dev/articles/instax-mini-13-vs-mini-41/?src=x`）。参照元のホスト名は自動で記録される。

## 週次レビュー運用（記事の改善・削除判断）

`report:analytics` は Cloudflare の KV を読むため API トークンが必要で、トークンの登録は明示的な許可なしに行わない（AGENTS.md）。このため CI での自動実行はせず、権限を持つ担当者が手元で実行する。

1. 週に1回、`pnpm report:analytics -- --days 30` を実行する。
2. 次の基準で記事ごとに判断し、必要なら Issue を起票する。結果の数値は Issue に転記し、秘密情報や個人情報は含めない。

| 観察                                     | 判断                                                               |
| ---------------------------------------- | ------------------------------------------------------------------ |
| 表示は多いが購入CTAクリックがほぼない    | CTAの位置・文言・比較結論の見せ方を改善する                        |
| 表示が継続して極端に少ない（30日で数件） | 検索意図の重複や題材の選定を見直す。90日続けば統合・削除を検討する |
| 特定の流入元（`src`）だけ多い            | その流入元向けの導線を維持し、他の流入元への展開を検討する         |
| 計測が0件                                | KV 未設定・障害の可能性。先に上記「KV の有効化手順」を確認する     |

サンプルが小さい期間（無料プランの書き込み上限で破棄が出た日を含む）の数値は、判断の補助にとどめる。
