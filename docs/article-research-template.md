# 新規比較記事リサーチ台帳

新規記事は、この記事台帳を埋めてからseedを追加する。検索結果の断片、推測URL、既存商品のURL流用は証跡として認めない。

## 1. 記事候補

- slug:
- title:
- category:
- left product:
- right product:
- duplicate check:
  - slug/route search:
  - left model reuse:
  - right model reuse:
- adoption: `候補` / `保留` / `採用`
- research date (JST):

## 2. 公式商品証跡

| 項目                                  | 左商品 | 右商品 |
| ------------------------------------- | ------ | ------ |
| メーカー公式個別URL                   |        |        |
| HTTP status / final URL               |        |        |
| 公式ページ表示名                      |        |        |
| 型番・品番                            |        |        |
| 公式ページ内の仕様表                  |        |        |
| 共通比較項目1（原文）                 |        |        |
| 共通比較項目2（原文）                 |        |        |
| 製品ごとの差分（原文）                |        |        |
| 公式画像URL                           |        |        |
| 画像HTTP status / Content-Type / byte |        |        |
| 公式画像を`public/products/`へ保存    |        |        |

公式ページが型番、仕様、画像のいずれかを直接確認できない場合は `確認不可` と記録し、採用しない。後継機・海外モデル・シリーズ一覧の値を転用しない。

## 3. 楽天導線証跡

| 項目                                  | 左商品 | 右商品 |
| ------------------------------------- | ------ | ------ |
| 楽天市場の商品詳細URL                 |        |        |
| 商品名・型番一致                      |        |        |
| 商品ページのショップ                  |        |        |
| 楽天商品ページHTTP status / final URL |        |        |
| 楽天公式アフィリエイトUI入力URL       |        |        |
| UI表示の商品名                        |        |        |
| UI表示のショップ                      |        |        |
| UI生成の完全成果URL                   |        |        |
| 成果URLの外側ホスト                   |        |        |
| リダイレクト先                        |        |        |
| リダイレクト先HTTP status             |        |        |
| `rel="nofollow sponsored noopener"`   |        |        |

ショップ不一致、検索結果URL、最終遷移先を特定できない短縮URL、既存URLの流用は `unverified` とし、CTAを表示しない。

## 4. 実装チェック

### 4.1 比較記事（editorial）の新規作成 — メタ1本 + 1行ラッパ（推奨）

新規の比較記事は `src/pages/articles/<slug>/index.astro` に 50〜80 行を手書きしない。`src/content/articles/<slug>.ts` に全データを集約し、ページは 1 行ラッパにする（`combi-the-s-plus-vs-premium` 等が雛形）。

```ts
// src/content/articles/<slug>.ts
export const fooBarArticle = defineArticleMetadata({
  id: "<slug>",
  productCount: 2,
  path: "/articles/<slug>/" /* title, headline, ... */,
  leftModel: {
    brand,
    line,
    tagline,
    image,
    imageAlt,
    officialHref,
    guidePoints,
  },
  rightModel: {
    brand,
    line,
    tagline,
    image,
    imageAlt,
    officialHref,
    guidePoints,
  },
  keyDiffRows: [/* 比較行 */],
  lead: "...",
  summaryParagraph: "..." /* optional */,
  officialDescription: "..." /* optional, articleId ルートで優先表示 */,
  officialSources: [
    /* {label, url} 情報源一覧。checkedAt は productInfoCheckedAt から自動付与 */
  ],
  socialProofQuery: "...",
  faqEntries: [/* ... */],
  purchaseWarning: "..." /* optional, article.purchaseWarning ?? default */,
  disclaimer: "..." /* optional, article.disclaimer ?? default */,
});
```

```astro
---
// src/pages/articles/<slug>/index.astro
import CommercialArticlePage from "../../../components/CommercialArticlePage.astro";
---
<CommercialArticlePage articleId="<slug>" />
```

- [ ] メタ (`src/content/articles/<slug>.ts`) に `leftModel` / `rightModel` / `keyDiffRows` / `lead` / `faqEntries` を追加（`combi-the-s-plus-vs-premium.ts` を参照）
- [ ] 必要に応じて `officialSources` / `purchaseWarning` / `disclaimer` / `officialDescription` / `summaryParagraph` / `socialProofQuery` を追加（`CommercialArticlePage` の `articleId` ルートで `article.* ?? default` される）
- [ ] `src/lib/products.ts` の `articlePurchaseLinks["<slug>:left" | ":right"]` に左右の商品詳細成果URLを追加
- [ ] `src/pages/articles/<slug>/index.astro` は `CommercialArticlePage` の1行ラッパのみ
- [ ] CTAに商品画像を含めた（`leftModel.image` / `rightModel.image` は `purchaseHref` とともに自動で CTA へ渡る）
- [ ] 未確認商品はfail-closedでCTA非表示（`articlePurchaseLinks` 未登録 or 到達ホスト不正なら表示されない）
- [ ] `articleMetadata` / canonical / sitemap / 一覧へ反映（`articles/index.ts` の re-export と `articleMetadata` 配列に追加）
- [ ] 価格・在庫・人気・口コミを公式根拠なしに記載していない
- [ ] SNS情報を比較根拠にしていない

> 旧 `ArticleComparisonPage` と `explicit` 方式は過去記事互換用であり、新規記事では使用しない。新規記事は `CommercialArticlePage` のみを使用する。

新規ページのテンプレート判定は `scripts/check-article-template-policy.mjs` で行う。過去記事の互換ページだけを許可リストに残し、許可リストにないページで `ArticleComparisonPage` を使うと検証に失敗する。過去記事の互換ページを現行テンプレートへ自動変換して表示を変えることはしない。

### 4.2 商業記事（commercial）の新規作成

- [ ] `CommercialArticleSeed`へ商品名・公式URL・確認日・仕様を追加
- [ ] `articlePurchaseLinks`へ左右の商品詳細成果URLを追加
- [ ] CTAに商品画像を含めた
- [ ] 未確認商品はfail-closedでCTA非表示
- [ ] `articleMetadata` / canonical / sitemap / 一覧へ反映
- [ ] 価格・在庫・人気・口コミを公式根拠なしに記載していない
- [ ] SNS情報を比較根拠にしていない

## 5. 検証と公開

### 現行記事レイアウトの確認

- [ ] 本文上部に枠付きの見出し「目次」と番号付き`<ol>`がある
- [ ] 目次の順序は「結論 → 比較ポイント → FAQ → 購入先 → SNS（採用時のみ）」で、リンク先IDと一致する
- [ ] 比較ポイントの各行で、価格・重量・出力など判断できる項目の勝者だけをハイライトしている
- [ ] 「30秒でわかる」「次にすること」「迷ったら、ここから決める」「公式情報（確認できた項目）」「詳細仕様（公式ページで確認した項目）」を新規記事に出していない
- [ ] SNSの採用件数が0件ならSNS見出し・検索リンク・空欄枠を出していない
- [ ] 購入先は商品画像カード内にAmazon・楽天ボタンを配置し、未確認の販売先ボタンを出していない

```bash
pnpm test
PUBLIC_BUILD_SHA=$(git rev-parse HEAD) pnpm verify
```

- [ ] 生成HTMLで左右の商品名・型番・公式リンク・画像を確認
- [ ] 生成HTMLで成果URLのホスト、`sponsored`、広告表示、計測属性を確認
- [ ] 全外部リンクの最終URLとHTTP statusを確認
- [ ] 専用PRのexact-head CIが全PASS
- [ ] merge SHAを確認
- [ ] Production deploymentが`main`かつmerge SHAと一致
- [ ] Productionの対象記事、sitemap、画像、JSON-LD、CTA DOMをcache-buster付きで確認

## 6. 残件

確認できなかった項目、停止理由、再調査URL、再開条件を列挙する。残件がある場合、記事を「最新化済み」や「公開完了」と報告しない。
