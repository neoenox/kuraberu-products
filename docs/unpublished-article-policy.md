# 未公開記事の配信ポリシー

非公開（`PUBLISHED_ARTICLE_PAGE_SLUGS` に無い）商業記事を、本番でどう配信するかの方針を定める。
外部監査（2026-10-10, P1-1 / #1088）で「noindex を付けるだけで HTML は配信される」と指摘された件の決定を記録する。

## 決定

**方針B: 保留（held）は noindex 配信を継続し、配信停止（withdrawn）は 302 → `/404.html` で返す。**

理由:

- 保留の初稿は「商品情報確認日まで意図的に保持する」設計であり、削除すると再作成コストが発生する。
- 保留ページは `noindex,nofollow` を宣言し sitemap に載らないため、検索結果には出ない（URL 直打ちでのみ到達可能）。
- 配信停止済みの記事は既に 302 / 404 で返しており、両者を混ぜると「保留中の初稿」まで到達不能になる。

## 2つの状態

| 状態                      | 定義                                         | 生成   | 本番応答                                                 | インデックス | 管理                                                                        |
| ------------------------- | -------------------------------------------- | ------ | -------------------------------------------------------- | ------------ | --------------------------------------------------------------------------- |
| published                 | 公開許可リスト掲載                           | する   | 200                                                      | 可           | sitemap・一覧に掲載                                                         |
| **held**（保留）          | 公開許可外だがシードが存在し、初稿として保持 | する   | **200 + `noindex,nofollow`**                             | 不可         | `config/unpublished-article-holds.mjs` の台帳（理由・解除条件・`reviewBy`） |
| **withdrawn**（配信停止） | シード削除済みで配信しない                   | しない | **302 → `/404.html`**（一部は `functions/` のハード404） | 不可         | `public/_redirects` / `functions/articles/*.ts`                             |

## 実装（機構）

- ビルド後の安全網: `scripts/prune-unpublished-articles.mjs`
  - sitemap 非掲載かつ **indexable** な記事ページのみ削除する（契約違反の異常ページ検知）。
  - sitemap 非掲載でも HTML が `noindex` を宣言しているページは**保持**する（＝ held）。
- 配信停止: `public/_redirects` の `/articles/<slug>/* /404.html 302` と `functions/articles/<slug>.ts` のハード404。
- 保留台帳: `config/unpublished-article-holds.mjs`（`reviewBy` 超過は `tests/unpublished-article-holds.test.ts` が失敗）。

## 不変条件（テストで担保）

- withdrawn のスラグは公開されておらず、ページファイルも持たない（`tests/unpublished-article-sync.test.ts`）。
- held の保持挙動は `tests/prune-unpublished.test.ts` が担保する。
- 台帳に明示された held スラグは withdrawn 側（`_redirects` / `functions`）に現れない（同テスト）。

## 本番実測（2026-10-16, build `9860b62`）

- 生成 132 / 公開 53 / 非公開 79。
- 非公開 79 の内訳: **withdrawn 75（302 → `/404.html`）** + **held 4（200 + noindex）**。
  - held: `anker-nano-power-bank-vs-zolo-a1688` / `elecom-de-c85-vs-de-c86` / `shokz-openfit-2-plus-vs-openfit-2` / `soundcore-liberty-5-pro-vs-liberty-4-pro`
- `public/_redirects` の配信停止ルール（`/articles/<slug>/*`）は 133 件。
- 本ポリシー策定時に、台帳で held の `soundcore-liberty-5-pro-vs-liberty-4-pro` が `_redirects` にも載っている矛盾を検出した（2026-09-20 の一括復元 `e5ce2b8` 由来で、2026-10-09 の台帳追加 `bf5e509` より前）。同じ台帳グループの他2件は 200 + noindex、handoff manifest（`docs/article-handoffs/soundcore-liberty-5-pro-vs-liberty-4-pro-2026-09-16.json`）も楽天の購入先が未確認の進行中で held が意図と判断し、配信停止ルールを除去して held に戻した（#1088）。

## 見直し条件

- held ページの `reviewBy` 到来時に「公開（品質ゲート通過）／削除」を決める（台帳を更新）。
- 検索エンジンへの一時的な露出や URL 直打ち閲覧を許容しない要件が出た場合は、方針A（held も含めて生成除外し 404 化）へ切り替える。切り替え時は `tests/prune-unpublished.test.ts` と台帳の扱いを更新する。

## 関連

- #1088（本方針の決定 Issue）
- `config/unpublished-article-holds.mjs`, `scripts/prune-unpublished-articles.mjs`, `public/_redirects`, `functions/articles/`
