# 記事データの共通スキーマ化と商品マスタ分離（#1064）

- 目的: 商品・比較軸・CTAを型付きスキーマで検証し、商品ごとの販売先アフィリエイト可否状態を商品マスタで一元管理する。
- 方針: 大規模refactorを避け、**既存記事を変更しない**段階移行（検証の追加から着手）とする。
- 本docの位置づけ: #1064 の受入条件「現状のデータ重複の調査結果」「スキーマ案と段階移行計画」の成果物。実装は別PRで段階的に行う。
- 調査日: 2026-10-16（base `b556db2`）。

## 1. 現状のデータ重複の調査結果

### 1.1 現在のデータ配置（3層）

| 層                 | 場所                                                                          | 件数                              | 役割                                                  |
| ------------------ | ----------------------------------------------------------------------------- | --------------------------------- | ----------------------------------------------------- |
| 記事seed           | `src/content/articles/commercial/*.ts`                                        | 122ファイル                       | 記事本文・商品名・比較表・販売URLを直接記述           |
| 記事メタデータ     | `src/content/articles/commercial/create.ts` → `src/content/articles/types.ts` | -                                 | seed を `defineArticleMetadata`（手書き検証）で正規化 |
| 購入リンクregistry | `src/data/article-purchase-links.json`                                        | 55エントリ（全て `id:side` 形式） | CTAの購入URL・表示商品名の「単一情報源」とされる      |
| 画像               | `src/assets/products` / `public/products`                                     | 333 / 111                         | 記事画像                                              |
| 設定               | `config/article-*.mjs`                                                        | -                                 | テンプレート・公開ポリシー                            |

### 1.2 重複・不整合の実測

商業記事seed 122ファイル、registry 55エントリを対象に集計した結果。

| 情報           | 重複している箇所                                                                                                                                        | 実測                                                                                                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Amazon 商品URL | seed の `left/rightAmazonUrl` と `sourceLinks[].url`                                                                                                    | `amazon.co.jp/dp/` 出現は全137箇所。**14記事で同一dp URLが1記事内に2回**記述                                                                                                     |
| 楽天 商品URL   | seed の `left/rightRakutenUrl`（アフィリエイトURL）、`sourceLinks`（素の商品URL）、registry の `purchaseUrl`                                            | registry 55件のうち **アフィリエイトURL 14件 / 素の `item.rakuten.co.jp` URL 41件**。例: `anker-a121a-vs-a2688` は seed にアフィリエイトURLを直接持ち、registry にエントリが無い |
| 商品名         | seed の `leftProduct/rightProduct`、`aboutProductNames`（`create.ts` が複製）、registry の `name`、`officialSources[].label`、`officialProse[].heading` | `officialProse` を持つ記事は53件。同一商品名が最大4箇所に存在                                                                                                                    |
| 価格           | `verifiedRows` の「公式価格」行、本文（`leftPoint/rightPoint/officialProse` の「N円」）                                                                 | 8記事で同一の価格情報が3箇所以上に出現                                                                                                                                           |
| 画像           | `leftImage/rightImage`、`commercialArticleImages`（`create.ts` のフォールバック）、`assets/products` と `public/products`                               | 同名basenameが**111件、両ディレクトリに二重**（public側の111件はすべてassets側に存在する部分集合）                                                                               |
| 比較軸         | `verifiedRows`（107記事）と `keyDiffRows`（0記事）の同型配列が2系統                                                                                     | **`keyDiffRows` / `leftModel` / `rightModel` は使用0件＝デッドスキーマ**。`defineArticleMetadata` の「1行記事」分岐は到達不能                                                    |
| 販売先状態     | `purchaseLinkStatus`（記事全体）、`amazonLinkStatus`/`rakutenLinkStatus`（販売先別）、`left/rightAmazonLinkStatus`（商品別, 14記事）                    | 可否状態の粒度が3段階で混在                                                                                                                                                      |

補足:

- registry の「単一情報源」という前提は全記事では成立していない。seed に直接アフィリエイトURLを持つ記事（56記事中）と registry 参照の記事が併存する。
- `verifiedRows` と `officialSources` はどちらも107記事が宣言しており、比較表と情報源リンクで URL・数値が二重管理されている。

### 1.3 既存の検証（重複の一部はすでにガード済み）

- `scripts/check-purchase-link-consistency.mjs`（`verify:lint`）: registry 参照の強制と final hop 検証。
- `scripts/validators/{article-cards,article-ctas,article-meta,article-sections,article-text,ctas}.mjs`: 記事断片の検証。
- `tests/verify-script-coverage.test.ts` / `tests/dist-suites.mjs`: 検証スクリプトの網羅。

→ 検証は存在するが、**単一の型付きスキーマではなくスクリプト実装ごとに散在**しており、同一情報の真実の在処が一意でない。これが重複更新漏れ（価格・URL・名称の不整合）の温床になっている。

## 2. スキーマ案

### 2.1 商品マスタ（ProductMaster）

商品IDを安定キーとし、販売先ごとのアフィリエイト可否状態を一箇所で持つ。

```ts
/** 販売先ごとの可否状態。search は「商品詳細は未確認だが検索CTAは可」（AGENTS.md規約）。 */
type AffiliateAvailability =
  | { state: "verified"; url: string; checkedAt: string }
  | { state: "direct"; url: string; checkedAt: string }
  | { state: "search"; query: string; checkedAt?: string }
  | { state: "unavailable"; note?: string };

type Product = {
  id: string; // 安定した商品ID（記事slugとは独立）
  brand: string;
  line: string;
  model?: string;
  name: string; // 表示名（単一情報源）
  image?: string; // マスタ管理の画像パス
  officialUrl?: string;
  sellers: {
    amazon?: AffiliateAvailability;
    rakuten?: AffiliateAvailability;
  };
  checkedAt: string;
};
```

- 現 `article-purchase-links.json`（`id:side` キー）を `Product` + `sellers` に機械変換し、手動で補完する。
- 「search CTA は確認済み購入先に数えない」「公開判定は確認済み購入先が1つ以上」という既存規約を、`state` で型表現する。

### 2.2 記事スキーマ（マスタを参照する）

```ts
type ArticleProductRef = {
  role: "left" | "right";
  productId: string; // マスタ参照。商品名・画像・URLはここから解決
  sellerOverride?: { amazon?: boolean; rakuten?: boolean }; // 記事側の表示制御のみ
};

type ComparisonAxis = {
  key: string;
  label: string;
  unit?: string;
  values: { left: string; right: string };
  direction?: "higher-is-better" | "lower-is-better";
  highlight?: "left" | "right" | null;
  note?: string;
};

type ArticleData = {
  // 既存フィールドは維持しつつ、以下で置き換える
  products: ArticleProductRef[];
  axes: ComparisonAxis[]; // verifiedRows を一本化（keyDiffRows は廃止）
};
```

- 商品名・画像・Amazon/楽天URLは**マスタから解決**し、記事本文には書かない。
- 比較軸は1系統に統一。`keyDiffRows` / `leftModel` / `rightModel` はデッドのため削除候補。
- 価格は「軸」またはマスタの確認日つき値に集約し、本文への手書き価格はテンプレート化またはリントで抑止する。

### 2.3 検証方針（依存追加はしない）

- 現行規約どおり、検証は純関数を `export` して `tests/*.test.ts` で fail-closed に単体検証する（`scripts/*.mjs` はカバレッジ対象外、`config/**/*.mjs` は対象）。
- 追加する検証項目:
  1. 記事が参照する `productId` がマスタに実在する。
  2. 同一記事で同じ `role`/`productId` が重複しない。
  3. 販売先 `state` とCTA表示（`amazon`/`rakuten` ボタン描画）が整合する。
  4. `state: "search"` は確認済み購入先に数えない。
  5. 公開記事に確認済み購入先が1つ以上ある。
  6. `axes` の左右値が空でない、`direction` と `highlight` が矛盾しない。

## 3. 段階移行計画（既存記事を壊さない）

各Phaseは独立PRとし、既存記事は変更せず、すべてのCI greenを維持する。後方互換のため削除は最後に行う。

| Phase      | 内容                                                                                                                                                                                                           | 既存記事への影響         | 検証                      |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------------------------- |
| 0（本doc） | 調査・スキーマ確定                                                                                                                                                                                             | なし                     | -                         |
| 1          | 商品マスタを新規追加（`src/data/products/*.json` 等）。`article-purchase-links.json` から機械変換＋手動補完。マスタ単体のスキーマ検証CLI（`check:product-master`）とテストを追加                               | なし                     | 新規テスト, 既存CI        |
| 2          | 記事→マスタ参照の併走移行。seed に任意の `leftProductId/rightProductId` を追加可とし、マスタ解決を優先、無ければ従来フィールドへフォールバック。`check-purchase-link-consistency` を registry からマスタへ委譲 | 任意・後方互換           | 併走テスト, 既存CI        |
| 3          | 比較軸の一本化。`keyDiffRows` / `leftModel` / `rightModel` のデッドコードを削除し `verifiedRows` に統一                                                                                                        | 型のみ（データ変更なし） | typecheck, 既存記事テスト |
| 4          | 価格の一元化。手書き価格を軸/マスタへ移し、本文はテンプレート生成。本文直書き価格を検出する lint を追加                                                                                                        | 記事本文の一部整形       | check:price-claims 連携   |
| 5          | 画像の一元化。`assets/products` と `public/products` の二重を解消し、マスタ `image` に寄せる                                                                                                                   | 参照パスのみ             | check:product-images      |

移行の安全条件:

- Phase 2 までは registry とマスタを併存させ、どちらか一方が欠けても fail-closed にする。
- 交友関係のない大規模差分を作らない（1 Phase = 1 目的 = 1 PR）。
- 各Phaseで `pnpm verify` と既存の全チェックを green に保つ。

## 4. 参考: 調査の再現

上記の実測値は、`src/content/articles/commercial/*.ts`（補助ファイル除く122件）と `src/data/article-purchase-links.json` をテキスト/JSONとして集計したもの。主な集計項目:

- `left/rightAmazonUrl` を持つ記事数、`amazon.co.jp/dp/` の出現総数と記事内重複数
- `left/rightRakutenUrl` を持つ記事数、registry のエントリ数とURL種別（`hb.afl` か `item.rakuten.co.jp` か）
- `verifiedRows` / `keyDiffRows` / `leftModel` / `rightModel` / `officialProse` / `sourceLinks` の宣言記事数
- `assets/products` と `public/products` のbasename重複数

## 付録A: 計画の前提検証（2026-10-17 再計測）

本docのマージ（#1164）後、Phase 1/2 が対象とする範囲を独立に再計測した。主要な数値は一致したが、**Phase 1/2 の前提に関わる2点の訂正**がある。

> 更新: PR #1166（2026-10-17）で Phase 1 の4項目を実装し、あわせて再計測で判明した誤り（A.2 の孤児3件 → 0件、シード 121 → 130件）を本付録に反映した。各項目の実装状況は A.2〜A.6 の各所に記載。

### A.1 再現した数値（一致）

- `article-purchase-links.json`: 55 エントリ = アフィリエイトURL 14 + 素の `item.rakuten.co.jp` 41
- 画像: `src/assets/products` 333 / `public/products` 111 / basename 重複 111（public は assets の部分集合）
- 商業記事シード: `*.ts` 126本。インフラ5本（`types`/`index`/`create`/`seeds`/`images`）を除くと 121本だが、**1ファイルに複数シードを束ねた `kakaku-september-2026.ts` があるため、`commercialArticleSeeds` の実数は 130件**（PR #1166 で訂正。§1.1 の「122ファイル」はファイル数）

### A.2 訂正1: 商品マスタは registry から機械変換できない

registry は **55キー / 29記事ID** のみで、**公開53スラッグのうち登録があるのは2件**（`sony-wf-c710n-vs-linkbuds-fit`, `logicool-pro-x-superlight-2-dex-vs-superlight-2`）。公開中の商業記事の購入URLは seed の `left/rightRakutenUrl` ＋楽天APIで解決され、registry はフォールバックに留まる（`src/components/CommercialArticlePage.astro:83-126`）。

→ Phase 1 の変換元は registry ではなく **seed 130件 + handoff台帳 57本**を主とする必要がある（registry だけでは実データの一部しか覆わない）。

registry の孤児は **0件**（29記事IDすべてが seed か専用ページに対応。PR #1166 で検出テストを追加）:

- ~~`hitachi-pv-bl1c4-vs-dyson-sv46-ff`（2件）… 対応する seed ファイルが無い~~ → 誤り。シードは複数シード束 `src/content/articles/commercial/kakaku-september-2026.ts` にあり、ページも存在する（未公開）。ファイル名だけを見た判定ミス
- `panasonic-baby-monitor-kx-hc705` / `panasonic-eh-na9m-guide` … seed は無いが `CUSTOM_ARTICLE_PAGE_SLUGS` の専用ページが registry を参照している（孤児ではない）

### A.3 訂正2: registry 整合ゲートは商業記事を対象外にしている（付録として§1.3の対象範囲を補足）

`scripts/check-purchase-link-consistency.mjs` は `CommercialArticlePage` を使うソースを明示的にスキップする（`:220` は `return;`、`:400` は `continue;`。理由コメント: 楽天APIで解決するため）。未公開記事もスキップする（`:459`）。

したがって §1.3 の「registry 参照の強制と final hop 検証」が実効するのは主に手書き比較ページであり、**公開中の商業記事における seed URL と registry URL の不一致は検出されない**。

→ Phase 2 の「`check-purchase-link-consistency` を registry からマスタへ委譲」には、**現状の除外を解除する作業（＝新たに強制力を得る変更）**が含まれる。

実データにも不一致がある（公開2記事。遷移先の商品ページは同一で `ut=` パラメータのみ差分）。**PR #1166 で解消済み** — 描画は seed 優先で、handoff台帳（`docs/article-handoffs/*.json`）の affiliateUrl も seed と一致するため、registry を seed に合わせた（レンダリング出力は不変）:

| 記事:side                                              | seed `ut`                   | registry `ut`          |
| ------------------------------------------------------ | --------------------------- | ---------------------- |
| `sony-wf-c710n-vs-linkbuds-fit:right`                  | `com:"down"`（`comp` なし） | `com:1`, `comp:"down"` |
| `logicool-pro-x-superlight-2-dex-vs-superlight-2:left` | `com:1`, `bbtn:1`           | `btn:1`（`com` なし）  |

### A.4 宣言と実装が乖離している検証（fail-closed の穴）

`scripts/validators/article-meta.mjs:38-45` の `validateArticlePurchaseLinkStatus` は、コメントで「CTAがある場合は fail-closed にする」と宣言しているが、`ctaCount` を数えた後に **常に `[]` を返す no-op**（`:44`）。購入CTAに対する fail-closed 検証は現状機能していない（next-step ブロックのボタン数は `validateArticleNextStep`（`:137-227`）が別途検証する）。→ **PR #1166 で fail-closed に実装済み**（live は `scripts/validators/meta.mjs`、`article-meta.mjs` 側は参照の無い死にコード）。

### A.5 記事横断の商品重複（§1.2 の「記事内重複」とは別軸）

同一 ASIN が**複数の記事**に現れるケースが4件ある。商品マスタ導入の直接の根拠になる。

| ASIN         | 記事                                                                    |
| ------------ | ----------------------------------------------------------------------- |
| `B0F3XFNHCW` | `sony-wf-c710n-vs-linkbuds-fit`, `sony-wf-c710n-vs-soundcore-liberty-5` |
| `B0GV5VHTL6` | `kindle-paperwhite-vs-colorsoft`, `kindle-vs-kindle-paperwhite`         |
| `B0DZ7WF87P` | `ipad-a16-vs-ipad-air-m4`, `ipad-mini-a17-pro-vs-ipad-a16`              |
| `B0HGF5B9D8` | `zojirushi-ee-dg35-vs-ee-dg50`, `zojirushi-ee-dg50-vs-ee-rv50`          |

seed の Amazon URL 出現は 137回 / ASIN ユニーク 95件（`/dp/`・`/gp/product/`・percent-encoded を含む全パターン）。4組とも、記事間で商品の状態を突合する仕組みは無い。

### A.6 Phase 1 に載せられる小さな検証項目

1. 同一 ASIN が複数記事にあるとき、`*LinkStatus` が全記事で一致すること（マスタ未導入でも実装可能）→ **PR #1166 で実装**（`tests/article-product-identity.test.ts`）
2. registry の孤児検出（対応する seed の無いエントリ）→ **PR #1166 で実装**（実際の孤児は0件）
3. `validateArticlePurchaseLinkStatus` の実装（宣言どおり fail-closed に）→ **PR #1166 で実装**
4. `CommercialArticlePage` の除外をやめ、seed ↔ registry の URL 一致を検証（A.3 の2件を修正して通す）→ **PR #1166 で実装**（A.3 の2件は registry を seed に合わせて解消）
