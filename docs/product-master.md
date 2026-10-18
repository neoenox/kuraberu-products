# 商品マスタ（`src/data/products/`）（#1064 Phase 1 / Phase 2a・2b・2c）

商品IDを安定キーとし、商品ごとの販売先（Amazon / 楽天）のアフィリエイト可否状態を
1箇所で持つデータです。計画と受入条件は `docs/article-data-schema-plan.md`（§2.1 スキーマ、
§3 Phase 1・2）を参照してください。

- Phase 1 の目的は**マスタを新設し、単体でスキーマ検証できること**でした。
- Phase 2a（2026-10-18）で**記事seedがマスタの商品を一意に参照できるかを検証する層**を追加しました。
- Phase 2b（2026-10-18）で**公開53の全106スロットに `{side}ProductId` を付与**しました（1記事につき2行）。
- Phase 2c（2026-10-18）で**楽天CTAの可否判断をマスタへ委譲**しました（`src/lib/product-master.ts`）。
  表示に使う値（表示名・画像・URL）は記事seedを優先したままで、**出力は変わりません**。
- 記事の表示・出力は**変更しません**（`astro build` の `dist` 全突合で差分ゼロ）。

## 構成

| ファイル                                      | 種別    | 役割                                                                        |
| --------------------------------------------- | ------- | --------------------------------------------------------------------------- |
| `src/data/products/catalog.json`              | 生成物  | 商品マスタ本体。**手で編集しない**（`build:product-master` で再生成する）   |
| `src/data/products/overrides.json`            | 手書き  | 人が確定した補完値（記事間で値が割れた販売先の代表URLなど）                 |
| `src/lib/product-master.ts`                   | 表示    | 可否判断（`isSellerUnavailable`）の型付き窓口（Phase 2c）                   |
| `scripts/build-product-master.mjs`            | 生成    | seed + handoff台帳 → `catalog.json`（再現可能）                             |
| `scripts/validators/product-master.mjs`       | 検証    | スキーマ検証の純関数（fail-closed）                                         |
| `scripts/validators/article-product-refs.mjs` | 検証    | 記事seed → マスタ商品の解決・参照検証・可否検証の純関数（Phase 2a・2b・2c） |
| `scripts/check-product-master.mjs`            | 検証CLI | `check:product-master`。不正なら exit 1（スキーマ + 記事参照 + 可否）       |
| `tests/product-master.test.ts`                | テスト  | スキーマ・再現性・カバレッジ・集約・fail-closed                             |
| `tests/product-master-resolution.test.ts`     | テスト  | 記事参照の解決・併走の既知差分・可否の整合・fail-closed（2a・2b・2c）       |
| `tests/product-master-availability.test.ts`   | テスト  | 可否アクセサ（`src/lib/product-master.ts`）の検証（Phase 2c）               |

## 生成と検証

```bash
pnpm build:product-master                  # catalog.json を再生成
pnpm exec node scripts/build-product-master.mjs --check   # 生成物が最新か確認（書き込まない）
pnpm check:product-master                  # スキーマ検証（verify:fast / verify:lint / CI に含まれる）
```

`check:product-master` は `config/verification-manifest.mjs` の `STATIC_CHECKS` に登録しており、
`pnpm verify:fast` と `pnpm verify:lint`（= CI の `verify.yml`）で毎回実行されます。
既定ファイルを検証するときは、あわせて**記事seedの商品参照**（Phase 2a）も検証します
（`--file` を渡したときはスキーマ検証のみ）。
生成物の再現性は `tests/product-master.test.ts` が「生成結果 = コミット済み `catalog.json`」で検証します。

## 変換元（計画 §付録A.2 の帰結）

計画当初は `src/data/article-purchase-links.json`（registry）からの機械変換を想定していましたが、
付録A.2 の再計測どおり registry は**公開53スラッグのうち2件しか覆わない**ため、変換元を次に変更しています。

- `src/content/articles/commercial/*.ts` の seed（今回は `PUBLISHED_ARTICLE_PAGE_SLUGS` の53スラッグのみ）
- `docs/article-handoffs/*.json`（seed に無い `model` / `officialUrl` の補完）

seed の解析は既存チェック（`check-commercial-article-quality.mjs` / `check-article-handoff.mjs`）と
同じくテキスト正規表現で行います。楽天は seed に記録済みのURLのみを採用し、実行時に楽天APIで
解決している分は Phase 2 の対象です。

## 現在のカバレッジ（2026-10-18時点）

| 項目               | 実測                                                               |
| ------------------ | ------------------------------------------------------------------ |
| 対象               | 公開53スラッグの全商品スロット 106件                               |
| 商品エントリ       | **100件**（ID接頭辞は `amazon-` 89件 / `model-` 11件）             |
| Amazon 販売先      | `verified` 83 / `direct` 6 / `search` 11（`unavailable` なし）     |
| 楽天 販売先        | `verified` 46 / `direct` 2 / `unavailable` 6 / **エントリなし 46** |
| `model` あり       | 88件（12件は型番が seed・handoff のどちらにも無い）                |
| `image` あり       | 100件                                                              |
| `officialUrl` あり | 100件                                                              |
| `checkedAt`        | 2026-09-27 〜 2026-10-13                                           |

楽天の「エントリなし 46」は「未確認」ではなく「**未着手**」です。seed に可否状態の記録が無い分は
マスタへ写していません（Phase 2 で registry / 楽天APIの解決結果を移す対象）。`check:product-master` は
`rakuten` 未登録を正当な状態として扱うため、誤って `unavailable` へ倒すことはありません。

## 同一商品の集約（106スロット → 100商品）

ASIN → `model` → 表示名の優先順で同じキーを共有するスロットを union-find で統合します。
計画 §付録A.5 の ASIN 重複4組のうち3組は ASIN 一致で、`B0F3XFNHCW`（`WF-C710N`）は
seed では `sourceLinks` の URL にのみ現れ CTA は `search` のため、`model` 一致で統合しました。

統合された商品（記事をまたぐ6組）:

| 商品ID              | 統合された記事:side                                                                      | 一致キー |
| ------------------- | ---------------------------------------------------------------------------------------- | -------- |
| `amazon-b0dz7wf87p` | `ipad-a16-vs-ipad-air-m4:left`, `ipad-mini-a17-pro-vs-ipad-a16:right`                    | ASIN     |
| `amazon-b0gv5vhtl6` | `kindle-paperwhite-vs-colorsoft:left`, `kindle-vs-kindle-paperwhite:right`               | ASIN     |
| `amazon-b0hgf5b9d8` | `zojirushi-ee-dg50-vs-ee-rv50:left`, `zojirushi-ee-dg35-vs-ee-dg50:right`                | ASIN     |
| `model-hd-lx1026`   | `zojirushi-ee-tc60-vs-dainichi-hd-lx1026:right`, `dainichi-hd-lx1226-vs-hd-lx1026:right` | `model`  |
| `model-wf-c710n`    | `sony-wf-c710n-vs-linkbuds-fit:left`, `sony-wf-c710n-vs-soundcore-liberty-5:left`        | `model`  |
| `model-wf-ls910n`   | `sony-wf-c710n-vs-linkbuds-fit:right`, `sony-wf-1000xm6-vs-linkbuds-fit:right`           | `model`  |

## 記事→マスタ参照（Phase 2a / 2b / 2c）

記事seedは `{side}ProductId` でマスタの商品を明示参照します（`src/content/articles/commercial/types.ts`）。
無い場合（未公開seedなど）は **ASIN > model > name** の優先でマスタから導出します（生成スクリプトと同じ順序）。

- 解決と検証の純関数は `scripts/validators/article-product-refs.mjs` に置き、生成CLI・検証CLI・テストで共有します。
- `check:product-master`（既定ファイル）が公開53の全106スロットを検証し、明示/導出/可否の内訳を出力します。
- 付与は `{side}Product`（表示名）の直後の行です。付与した値は現行seedからの導出結果と一致します。
- `model-`（11商品）の `model` は handoff 台帳由来なので、seed 単体では再現できません。
  **明示 `productId` を正**とし、handoff を更新して導出結果が変わった場合は CI が fail-closed で止めます。

fail-closed にする規則:

| 規則   | 内容                                                                                                                 |
| ------ | -------------------------------------------------------------------------------------------------------------------- |
| 実在   | `productId` を書いた場合、形式（`amazon-` / `model-` / `name-`）が正しくマスタに実在すること                         |
| 一致   | `productId` は導出結果（ASIN > model > name）と同じ商品を指すこと                                                    |
| 解決   | 公開スコープの全スロットがマスタの商品へ解決できること                                                               |
| 重複   | 同じ記事で同じ商品を左右に使わないこと                                                                               |
| 曖昧さ | 同じ `model` / 表示名が複数商品にある状態を作らないこと                                                              |
| 可否※  | 記事が販売先の商品詳細URLを書けるのは、マスタがその販売先を `verified` / `direct` と判定している場合だけ（Phase 2c） |

※ 可否は**双方向**に検証します。マスタが `unavailable` / `search` / 記載なしなのに記事がURLを持つ状態も、
マスタが `verified` / `direct` なのに記事がURLを持たない状態も**エラー**です。
可否判断の二重基準（記事とマスタでCTA表示が食い違う状態）を作らないためです。

検証対象は**公開スコープの記事（106スロット）**です。マスタ自体が公開53スラッグを変換元にしているため、
未公開seedが参照する商品は含まれません（拡充は Phase 2 以降）。

### CTAの可否判断（Phase 2c）

`src/lib/product-master.ts` の `isSellerUnavailable(productId, seller)` を入口に、
`CommercialArticlePage.astro` は**マスタが `unavailable` と判定した販売先のCTAを出しません**
（記事が独自に確認したURLを持っていても出しません）。マスタに記載が無い商品は従来どおり
記事seedの判断に委ねます。

- 値（表示名・画像・URL）は引き続き**記事seedを優先**します（`{side}RakutenUrl` → registry → 実行時API）。
- 2026-10-18 実測では、公開53の106スロットで**マスタの可否と記事のURL有無は完全に一致**しており
  （`seller-state ok`）、Phase 2c による出力の変化はありません（`dist` 全突合で差分ゼロ）。

### 併走の既知差分（2026-10-18 実測・`tests/product-master-resolution.test.ts` で固定）

`{side}ProductId` の付与後（2b）も、**seedとマスタの値の差分は同じ5点**です（付与は参照キーの追加のみで値は変えていません）。
現行seedとマスタ値を突合した差分は次の5点だけで、他は一致します。

| 項目       | 差分数 | 内容                                                                                                  |
| ---------- | ------ | ----------------------------------------------------------------------------------------------------- |
| 商品名     | 2件    | 「…WF-C710N **ブラック**」→「…WF-C710N」（最短名を採用）／`-Wi-Fi` → ` Wi-Fi`（空白差のみ）           |
| Amazon URL | 0件    | 全スロット一致                                                                                        |
| 画像       | 0件    | 全スロット一致                                                                                        |
| 楽天 URL   | 3件    | 記事間で成果URLが割れた2商品（`model-wf-c710n` / `model-wf-ls910n`）。上記「同一商品の集約」と同じ2件 |

Phase 2c ではこの5点を**表示へ反映しません**（記事が確認した値を優先）。理由:

- 楽天URL3件のうち**2件は別ショップ**（e-earphone ⇔ r-kojima / ビックカメラ）で、差し替えると
  「記事が確認していない遷移先」になります（AGENTS.md の広告リンク規約）。
- 残り1件は**遷移先が同一**で追跡パラメータのみの差、商品名2件は色指定と空白の差です。
- 記事間で値が割れた商品の代表値は `overrides.json` に記録済みで、統一するかは**記事作成者の判断**です。

## 決定規則（再現性のため固定）

- 商品ID: ASIN があれば `amazon-<asin小文字>`、無ければ `model-<正規化model>`、どちらも無ければ `name-<sha1先頭12>`。
- 表示名・`model`・`image`・`officialUrl`: メンバーのうち**辞書順最小**を採用（同値なら自明）。
- `checkedAt`: メンバーの `productInfoCheckedAt` → `purchaseLinksCheckedAt` → `publishedAt` の順に、
  **最古（min）**を採用。複数記事で確認した商品の鮮度を過大に主張しないためです。
- 販売先の状態が記事間で割れた場合は**自動解決せずエラー**にし、`overrides.json` で人が代表値を決めます。
- `overrides.json` の未知の商品ID・未知のキーもエラーにします（タイポを黙って通さない）。

`overrides.json` に記録済みの判断（2件）:

| 商品ID            | 内容                                                                                                                                                             |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `model-wf-c710n`  | 楽天の成果URLが記事間で別ショップ（e-earphone / r-kojima）だったため、`sony-wf-c710n-vs-linkbuds-fit` の e-earphone 版を代表として採用（`checkedAt` 2026-10-13） |
| `model-wf-ls910n` | 同上（e-earphone / ビックカメラ）。`sony-wf-c710n-vs-linkbuds-fit` の e-earphone 版を採用（`checkedAt` 2026-10-13）                                              |

いずれも**遷移先の商品ページは同一**で、成果URLの付与（ショップ）だけが割れていたケースです。
記事側の表示は変えず、Phase 2 で記事ごとの付与を統一するときにこの代表値へ寄せます。

## 販売先状態の意味（`AGENTS.md` の規約と一致）

| `state`       | 意味                                                                        |
| ------------- | --------------------------------------------------------------------------- |
| `verified`    | 商品詳細ページを確認済みの成果URL（`url` / `checkedAt` 必須）               |
| `direct`      | 直リンクで確認済みの購入先（`url` / `checkedAt` 必須）                      |
| `search`      | 商品詳細は未確認だが、商品名・型番を含むタグ付き検索CTAは可（`query` 必須） |
| `unavailable` | 対象外・生成不可（CTAを出さない）                                           |

`search` は**確認済み購入先に数えません**（`AGENTS.md` の規約どおり）。
`sellers` は空オブジェクトを許さず、値の型が状態と食い違う場合は検証エラーにします。

## Phase 2 以降への引き継ぎ

- 記事→マスタ参照の併走移行。**解決層・検証は 2a、全スロットへの `productId` 付与は 2b、
  CTAの可否判断の委譲は 2c で完了**。表示に使う**値**（表示名・画像・URL）は記事seedを優先したままです。
- 2d: `check-purchase-link-consistency.mjs` の registry 検証をマスタへ委譲し、商業記事の除外（計画 §付録A.3）を解除する。
  2026-10-18 実測では、公開53の106スロットで registry が実効URLになった例は**0件**（seed の `{side}RakutenUrl` が52件、
  残り54件は明示的な非表示）で、registry のうち公開53に属するキーは3件だけでした。
- 記事間で割れた値5点（商品名2・楽天URL3）をマスタへ寄せるかは、記事作成者の判断として保留しています。
- 楽天の実行時API解決分と、公開53スラッグ以外のシードをマスタへ拡充する。
- 画像の一元化（計画 Phase 5）で `image` を実体パスへ寄せる。
