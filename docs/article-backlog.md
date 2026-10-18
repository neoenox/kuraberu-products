# 記事バックログ

「くらべて、選ぶ。」の比較記事を、公式情報で裏取りできる比較軸と記事の重複を見ながら管理する。

## 選定基準

1. 公式商品ページ・公式Q&Aで比較軸を裏取りできる
2. 2つの対象を同じ観点で比較できる
3. 読者の選択に影響する差分がある
4. 体験談・口コミを比較の根拠にせず、公式情報中心で構成できる
5. 既存記事と検索意図・対象商品が過度に重複しない

## 新規作成・確認中

現在、作成中の記事はない。

## 現在の公開済み（53本）

検索・記事一覧・サイトマップに載る記事（`config/article-template-policy.mjs`の`PUBLISHED_ARTICLE_PAGE_SLUGS`）だけを載せている。公開状況は、コード上の記事の有無ではなく、本番の実測（HTTP 200かつ`robots`が`index`）を正とする。

2026-10-09に、旧形式で検索・一覧に載らなかった57本（URLを直接開けば表示されたが`noindex,nofollow`）と、商品選択診断（`/tools/product-finder/`の5カテゴリ）を削除した。削除した記事のURLは、`public/_redirects`で`/404.html`（302）を返す。

| slug                                                 | 状態     |
| ---------------------------------------------------- | -------- |
| `airpods-5-vs-airpods-4-anc`                         | 公開済み |
| `airpods-pro-3-vs-pixel-buds-pro-2`                  | 公開済み |
| `amazon-echo-dot-max-vs-echo-dot-5th`                | 公開済み |
| `amazon-echo-show-8-vs-echo-show-5`                  | 公開済み |
| `amazon-fire-tv-stick-4k-max-vs-4k-select`           | 公開済み |
| `anker-a121a-vs-a2688`                               | 公開済み |
| `anker-a1664-vs-a1654`                               | 公開済み |
| `anker-nano-a1638-vs-power-bank-a1256`               | 公開済み |
| `anker-solix-c300-vs-jackery-240-new`                | 公開済み |
| `anker-soundcore-liberty-5-pro-vs-liberty-5-pro-max` | 公開済み |
| `apple-watch-series-12-vs-se-3`                      | 公開済み |
| `apple-watch-ultra-4-vs-series-12`                   | 公開済み |
| `crucial-x10-pro-vs-kingston-xs2000`                 | 公開済み |
| `dainichi-hd-lx1226-vs-hd-lx1026`                    | 公開済み |
| `dji-osmo-action-6-vs-gopro-hero13-black`            | 公開済み |
| `galaxy-s26-ultra-vs-s26`                            | 公開済み |
| `garmin-forerunner-570-vs-coros-pace-4`              | 公開済み |
| `insta360-x5-vs-dji-osmo-360-ii`                     | 公開済み |
| `instax-mini-13-vs-mini-41`                          | 公開済み |
| `instax-mini-evo-vs-evo-cinema`                      | 公開済み |
| `ipad-a16-vs-ipad-air-m4`                            | 公開済み |
| `ipad-air-11-vs-13-m4`                               | 公開済み |
| `ipad-mini-a17-pro-vs-ipad-a16`                      | 公開済み |
| `iphone-17e-vs-iphone-17`                            | 公開済み |
| `iphone-18-pro-vs-pixel-11-pro`                      | 公開済み |
| `iphone-air-vs-iphone-17`                            | 公開済み |
| `jbl-flip-7-vs-charge-6`                             | 公開済み |
| `jbl-tour-pro-3-vs-live-beam-3`                      | 公開済み |
| `karcher-k2-silent-vs-k3-silent-plus`                | 公開済み |
| `kindle-paperwhite-vs-colorsoft`                     | 公開済み |
| `kindle-scribe-vs-scribe-colorsoft`                  | 公開済み |
| `kindle-vs-kindle-paperwhite`                        | 公開済み |
| `kobo-clara-colour-vs-libra-colour`                  | 公開済み |
| `logicool-mx-master-4-vs-mx-master-3s`               | 公開済み |
| `logicool-pebble-m350s-vs-m650`                      | 公開済み |
| `logicool-pro-x-superlight-2-dex-vs-superlight-2`    | 公開済み |
| `macbook-air-13-vs-15-m5`                            | 公開済み |
| `macbook-pro-14-vs-16-m5-pro`                        | 公開済み |
| `nintendo-switch-2-vs-switch-oled`                   | 公開済み |
| `philips-sonicare-7100-hx7420-vs-6500-hx7410`        | 公開済み |
| `pixel-watch-5-vs-galaxy-watch9`                     | 公開済み |
| `roborock-qrevo-l-pro-vs-qrevo-curv-2-flow`          | 公開済み |
| `sharp-hotcook-kn-hw24k-vs-kn-hw24h`                 | 公開済み |
| `sony-wf-1000xm6-vs-linkbuds-fit`                    | 公開済み |
| `sony-wf-c710n-vs-linkbuds-fit`                      | 公開済み |
| `sony-wf-c710n-vs-soundcore-liberty-5`               | 公開済み |
| `sony-zv-1-ii-vs-zv-1f`                              | 公開済み |
| `sony-zv-e10m2-vs-nikon-z30`                         | 公開済み |
| `switchbot-hub3-vs-hub2`                             | 公開済み |
| `tp-link-archer-be550-vs-be450`                      | 公開済み |
| `zojirushi-ee-dg35-vs-ee-dg50`                       | 公開済み |
| `zojirushi-ee-dg50-vs-ee-rv50`                       | 公開済み |
| `zojirushi-ee-tc60-vs-dainichi-hd-lx1026`            | 公開済み |

## 公開されていない記事（64本）

記事ページのコードと記事データは残っているが、2026-10-07の実測で本番がHTTP 302（`/404.html`）を返した記事。過去に記事を取り下げた運用（履歴: `ops: take comparison articles offline`、`ops: withdraw existing articles from public site`）の結果とみられる。再公開するときは、公式情報・購入導線を再確認し、品質ゲートを通してから`PUBLISHED_ARTICLE_PAGE_SLUGS`へ追加する。

公開許可外URLはHTMLを配信しない（#1088）。`PUBLISHED_ARTICLE_PAGE_SLUGS`に載らない記事は、`scripts/prune-unpublished-articles.mjs`が本番ビルド（`dist/articles/<slug>/`）から除去する。以前はrobots `noindex`を宣言する保持中の初稿を配信対象に残していたが、静的アセットが`_redirects`より優先されてHTTP 200で配信され、`noindex`だけではURL直打ち・一時索引を防げなかったため撤廃した。`noindex`は補助的な多重防御として残るが、非配信の根拠は生成物からの除去（prune）である。

| slug                                              | 旧バックログの状態 |
| ------------------------------------------------- | ------------------ |
| `airpods-pro-3-vs-sony-wf-1000xm6`                | 表に記載なし       |
| `anessa-perfect-uv-vs-biore-aqua-rich`            | 公開済み           |
| `apple-watch-se-vs-xiaomi-redmi-watch-5`          | 公開済み           |
| `braun-series9pro-vs-series7`                     | 公開済み           |
| `casio-px-s1100-vs-yamaha-p-225`                  | 公開済み           |
| `dainichi-efh-1219d-vs-panasonic-ds-fwx1200`      | 公開済み           |
| `dainichi-hd-rxt525-vs-panasonic-fe-kxu07`        | 公開済み           |
| `delonghi-ecam22112b-vs-ecam25023sb`              | 公開済み           |
| `dyson-v12-detect-slim-vs-shark-evo-power`        | 公開済み           |
| `dyson-v12-vs-micro-plus`                         | 公開済み           |
| `fitbit-charge-6-vs-xiaomi-smart-band-9`          | 公開済み           |
| `hitachi-pv-bl1c4-vs-dyson-sv46-ff`               | 表に記載なし       |
| `hitachi-ras-aj2226s-vs-daikin-s406atep`          | 表に記載なし       |
| `iris-fk-c5-vs-panasonic-fd-f06x2`                | 公開済み           |
| `irobot-roomba-j9plus-vs-j7`                      | 公開済み           |
| `juki-hzl-f400jp-vs-brother-ps202`                | 公開済み           |
| `logicool-k650-vs-k580`                           | 公開済み           |
| `logicool-lift-vs-m550`                           | 公開済み           |
| `logicool-mx-keys-s-for-mac-vs-k780`              | 公開済み           |
| `logicool-mx-keys-s-vs-mx-keys-mini`              | 公開済み           |
| `logicool-mx-master-3s-vs-m650`                   | 公開済み           |
| `logicool-mx-master-3s-vs-mx-anywhere-3s`         | 公開済み           |
| `logicool-zone-vibe-100-vs-zone-300`              | 公開済み           |
| `makita-cl107-vs-cl286`                           | 公開済み           |
| `montbell-tri-pack-vs-anello-backpack`            | 公開済み           |
| `nitori-n-sleep-vs-nishikawa-air-mattress`        | 公開済み           |
| `omron-hem-7281t-vs-terumo-p2020`                 | 公開済み           |
| `omron-mc-681-vs-terumo-c205`                     | 公開済み           |
| `panasonic-baby-monitor-kx-hc705`                 | 公開済み           |
| `panasonic-be-fd633-vs-bridgestone-a6xc41`        | 公開済み           |
| `panasonic-db-bm1l-vs-db-rm3m`                    | 公開済み           |
| `panasonic-eh-na0j-vs-eh-na0g`                    | 公開済み           |
| `panasonic-eh-na0k-vs-eh-ne9n`                    | 公開済み           |
| `panasonic-eh-na0k-vs-panasonic-eh-na9m`          | 表に記載なし       |
| `panasonic-eh-na9m-guide`                         | 公開済み           |
| `panasonic-eh-na9m-vs-refa-beautech`              | 公開済み           |
| `panasonic-eh-nc80-vs-eh-nc50`                    | 公開済み           |
| `panasonic-ep-ma110-vs-ep-ma121`                  | 公開済み           |
| `panasonic-es-lv9w-vs-es-lv7w`                    | 公開済み           |
| `panasonic-es-pv6a-vs-es-pv3a`                    | 公開済み           |
| `panasonic-es-wp9b-vs-es-wg0b`                    | 公開済み           |
| `panasonic-ew-da19-vs-ew-da49`                    | 公開済み           |
| `panasonic-ew-dp57-vs-ew-dt73`                    | 公開済み           |
| `panasonic-ew-dp57-vs-philips-hx9911`             | 公開済み           |
| `panasonic-mc-jp860k-vs-mc-sb70km`                | 公開済み           |
| `panasonic-mc-sb53k-vs-mc-sb33j`                  | 公開済み           |
| `panasonic-ne-bs6e-vs-ne-bs5e`                    | 公開済み           |
| `panasonic-ne-bs9c-vs-ne-ubs10c`                  | 公開済み           |
| `panasonic-ni-fs70a-vs-ni-fs60b`                  | 公開済み           |
| `panasonic-sq-ld560-vs-sq-ld540`                  | 公開済み           |
| `panasonic-washer-na-lx129c-vs-hitachi-bd-sx130k` | 公開済み           |
| `philips-s9000-vs-braun-series9pro`               | 公開済み           |
| `re-fa-straight-iron-vs-panasonic-eh-hs0e`        | 公開済み           |
| `recolte-automatic-cooker-vs-panasonic-nf-pc400`  | 公開済み           |
| `regza-32v35s-vs-regza-43m550m`                   | 表に記載なし       |
| `roborock-qrevo-curv-vs-dreame-x50`               | 公開済み           |
| `samsonite-c-lite-vs-proteca-maxpass`             | 公開済み           |
| `sharp-heater-hv-r55-vs-iris-uhk500`              | 公開済み           |
| `sharp-kc-s50-vs-panasonic-f-vxw55`               | 公開済み           |
| `sony-bravia-55-xr80-vs-regza-55z870n`            | 公開済み           |
| `sony-wh-1000xm6-vs-airpods-max`                  | 表に記載なし       |
| `sony-wh-1000xm6-vs-wh-1000xm5`                   | 公開済み           |
| `soundcore-liberty-5-pro-vs-liberty-4-pro`        | 公開済み           |
| `switch-2-vs-switch-2-zelda`                      | 表に記載なし       |

2026-10-09に、これとは別の旧形式の57本（URLを直接開けば表示されたが`noindex,nofollow`で、検索・一覧に載らなかった記事）を、ページ・データ・画像ごと削除した。再び扱うときは、新しい記事として、公式情報・購入導線を確認してから作り直す（削除前の内容は、git履歴の`d46c95a`にある）。

## 次の候補

公開済み記事は上の表を正とし、各記事の確認記録は`docs/article-handoffs/`のhandoffを参照する。以下は公式情報が未確認の候補で（2026-10-08に5本、2026-10-09にさらに5本、2026-10-11にさらに5本を補充（うち2本は調査の結果、保留または記事化済み）。アクセス実績は参照していない。現行モデルの存在をAmazonの検索結果またはApple公式ページで確認しただけで、仕様・価格・型番は未確認）、記事化前に公式URLの再取得が必要。

2026-10-18に、次の4候補でメーカー公式の仕様と価格を確認し、各節に結果を記録した（Google Pixel 11 vs Pixel 11 Pro、Samsung Galaxy Z Fold8 vs Galaxy Z Flip8、Meta Quest 3S vs Meta Quest 3、ASUS ROG Xbox Ally vs ROG Xbox Ally X）。この日は当環境からAmazon.co.jp（検索ページ・トップページ）がHTTP 503で応答せず、Amazonの商品詳細ページ（ASIN）の商品名・価格・販売元・ツールバー表示は再確認できていない。ASINを再確認できないことは「Amazonに存在しない」ことを意味しない。（例外として、Samsung Galaxy Z Fold8 / Z Flip8 の2機だけは、同日にヘッドレスChromeでクライアント側描画後のDOMを取得でき、Amazon.co.jpの商品名と価格を確認できた。販売元とツールバーの表示は未確認のまま。）

候補を選ぶときは、次を先に確認する（2026-10-07〜08の作業で、記事化できなかった例から）。

- 両方の商品に、Amazonまたは楽天で、単体の商品詳細ページがある（セット品しかない商品は、購入先を確認できず公開できない）
- Amazonのアソシエイト対象は、`bsk observe`で見えるツールバーの表示（カテゴリー・販売手数料率・画面上の警告）で判断する。HTML全文にある「対象外」の文言は、全商品ページにあるポップアップ用のひな形で、根拠にしない（2026-10-11の誤認から）
- 商品名が似た別ASIN（セット品、旧型番、整備済み品、AppleCare+とのセット）を取り違えない。ASINは、商品名・パターンの表示で確認する
- 比較する両方の商品が、メーカーの現行ラインナップで、購入できる（旧モデルは公式ストアで購入不可のことがある）
- 色・容量・構成違いが多い商品は、比較する型番・構成を先に決める

新たに着手する場合は、選定基準に沿ってslug・比較軸・公式URL・購入導線の
確認状態をここへ追記し、公開時に上の表へ移す。

### Sony WH-1000XM6 vs Bose QuietComfort Ultra Headphones（第2世代）

- 選定理由: ヘッドホンは公開中の記事がなく（イヤホンのみ）、ノイズキャンセリングのヘッドホンは検索需要が見込める。ソニーの旧記事（`sony-wh-1000xm6-vs-wh-1000xm5`など）は本番で非公開で、比較相手が異なる。
- 状態: 候補（公式情報は未確認。2026-10-09にAmazon.co.jpの検索で、WH-1000XM6（B0F77PMC1P、ブラック）とBose QuietComfort Ultra Headphones（第2世代）（B0FL2HYBGJ）の存在を確認。ソニー・ボーズの公式ページが開くことのみ確認）
- 想定比較軸: ノイズキャンセリング、バッテリー、質量、対応コーデック、空間オーディオ、マルチポイント、価格
- 確認すること: ソニー・ボーズの公式仕様ページ、Amazonの両商品ページ（色違い・LE版の扱い）、型番・世代、既存の非公開記事との重複
- 2026-10-11確認: ソニー公式（sony.jp）の仕様ページで質量254g、連続再生30時間（NC ON）、Bluetooth 5.3、対応コーデックSBC・AAC・LDAC・LC3を確認できた。ボーズ公式（bose.co.jp）の製品ページには、価格（59,400円）とバッテリー（30時間、15分で3時間）、モードの記載はあるが、質量・Bluetoothのバージョン・対応コーデックの記載が見当たらず、取扱説明書のPDFからも取得できなかった。公式情報が不足するため、記事化を見送った。再開条件: ボーズ公式の技術仕様を取得できること

### Google Pixel 11 vs Pixel 11 Pro

- 選定理由: 公開中のスマートフォン記事に、Pixel 11 Pro（iPhone 18 Pro vs Pixel 11 Pro）はあるが、Pixel 11と11 Proの比較は未着手。標準モデルと上位モデルの選択は迷いが明確。
- 状態: 候補（2026-10-18にGoogle Storeの公式仕様・価格を確認（下記）。Amazon.co.jpの商品詳細（ASIN）は未確認。2026-10-12にAmazon.co.jpの検索で、Pixel 11 SIMフリー 256GB オブシディアン B0HHHTTM95、Pixel 11 Pro 256GB SIMフリー（オブシディアン B0HC3B8NG6、オリーブ B0HC3BNS1T）の存在を確認。両ASINの商品名・価格・販売元・ツールバーの表示は未確認。同じ検索に、容量・色を選ぶ形式の別出品も表示された）
- 想定比較軸: 画面サイズ、カメラ構成とズーム、バッテリー、重さ、メモリ・容量、公式価格
- 確認すること: Google Store Japanの両仕様・価格、比較する容量（256GB）・色を揃える、両ASINの商品名・価格・販売元・ツールバーの表示、公開中のiphone-18-pro-vs-pixel-11-proとの重複（Pixel 11 Proが共通）
- 注意: 色・容量違いのASINと、第三者の出品を取り違えない。
- 2026-10-18確認: Google Store日本（`store.google.com/jp`）の商品・構成・仕様ページで両機の税込価格と主な仕様を確認。Pixel 11（256GB/12GB）＝136,800円、Pixel 11 Pro（256GB/12GB）＝174,800円。チップは両機ともTensor G6。画面はPixel 11が6.3インチActua（1,080×2,424、60〜120Hz、Gorilla Glass Victus 2）、Pixel 11 Proが6.3インチSuper Actua LTPO（1〜120Hz）。重量はPixel 11が197g、Pixel 11 Proが204g。カメラは両機とも光学5倍望遠（Pixel 11は48MP広角＋13MP超広角＋10.8MP望遠、Pixel 11 Proは50MP広角＋48MP超広角＋48MP望遠）。バッテリーはPixel 11が4,985mAh、Pixel 11 Proが4,850mAh。掲載価格は税込の定価で、下取り・キャンペーンを含まない。Pixel 11 Proの174,800円は、公開中の`iphone-18-pro-vs-pixel-11-pro`の公式価格と一致する。
- 2026-10-18未確認: Amazon.co.jpの商品詳細ページ（Pixel 11 B0HHHTTM95、Pixel 11 Pro B0HC3B8NG6）は当環境からHTTP 503で到達できず、商品名・価格・販売元・ツールバー表示を再確認できなかった。

### Samsung Galaxy Z Fold8 vs Galaxy Z Flip8

- 選定理由: 折りたたみスマートフォンは公開中の記事がなく、FoldとFlipは形状も用途も違うため、選択で迷いが明確。
- 状態: 候補（2026-10-18にSamsung日本公式の仕様と販売価格、Amazon.co.jpの両ASINの商品名・価格を確認（下記）。Samsung公式の税込表示の有無と、Amazonの販売元・ツールバーの表示は未確認。2026-10-12にAmazon.co.jpの検索で、Galaxy Z Fold8 256GB グラファイト B0H5VQTTP8、Galaxy Z Flip8 256GB（グラファイト B0H5VWFLVW、ピンク B0H5VWR9RP、クリーム B0H5W21FCM）の存在を確認）
- 想定比較軸: 画面サイズ（内側・外側）、厚さ・重さ、カメラ、バッテリー、折りたたみ時の大きさ、公式価格
- 確認すること: Samsung Japanの両仕様・価格、比較する容量（256GB）・色（グラファイト）を揃える、両ASINの商品名・価格・販売元・ツールバーの表示
- 注意: Z Fold8 Ultraなど、名称の似た別モデルがある場合は取り違えない。
- 2026-10-18確認: Samsung日本公式（`samsung.com/jp`）の製品ページで両機の主な仕様を確認。Galaxy Z Flip8はメイン約6.9インチ・カバー約4.1インチ、厚さ約6.1mm（開いた状態）、約180g、約5,000万画素広角（光学相当2倍）＋約1,200万画素超広角、4,300mAh、Snapdragon 8 Elite Gen 5 for Galaxy。Galaxy Z Fold8はメイン約7.6インチ・カバー約5.5インチ、厚さ約4.5mm（開いた状態）、約201g、約5,000万画素広角＋約5,000万画素超広角、4,800mAh、同じチップ。容量はいずれも256GB/512GB（12GB RAM）。
- 2026-10-18未確認（当初）: 両機の税込価格。Samsung公式のbuyページがクライアント側描画で、サーバー応答HTMLに価格が含まれず取得できなかった。Amazon.co.jpもHTTP 503で、ASIN（Fold8 B0H5VQTTP8、Flip8 B0H5VWFLVW）の商品名・価格・販売元は再確認できていなかった。→ 同日、ヘッドレスChromeでクライアント側描画後のDOMを取得して再確認し、下記のとおり価格と在庫を確認した。
- 2026-10-18確認（価格・在庫）: Samsung日本公式の購入ページとAmazon.co.jpの商品詳細（ASIN）で、比較する256GB（12GB RAM）の価格を確認した。取得はクライアント側描画後のDOM（ヘッドレスChrome、`chrome.exe --headless=new --virtual-time-budget=25000 --dump-dom`）。Samsung.comはGalaxy Z Fold8 256GB＝256,385円（取り消し線269,880円・13,495円引き）、Galaxy Z Flip8 256GB＝183,045円（取り消し線192,680円・9,635円引き）で、いずれも在庫あり（DOM内の`pAvailability`が`InStock`）。ページのバナーは「Samsung Week（10/8〜11/4） Galaxy製品が最大10％OFF」で、この256GBでの実測は約5％引き。取り消し線の価格に「定価」のラベルはない。Amazon.co.jpは、Galaxy Z Fold8（B0H5VQTTP8）＝269,880円、Galaxy Z Flip8（B0H5VWFLVW）＝192,680円（`a-price-whole`とJSON-LDの`displayPrice`が一致）で、どちらもSamsung.comの取り消し線価格と同額。Amazon側ではキャンペーン価格を確認できていない。商品名は「Samsung Galaxy Z Fold8 256GB|グラファイト|Galaxy AI対応|SIMフリースマホ 本体 端末|Samsung純正 国内正規品|FeliCa対応|7.6インチ|… SM-F971QZKASJP」で、国内正規品であることを確認した（Flip8も同様にSM-F776QZKASJP）。
- 2026-10-18未確認（残り）: 両機の「税込」表示。Samsung公式のDOMには価格と通貨（`pPriceCurrency`＝JPY）はあるが、税込・税抜を示すラベルが見当たらない。Amazon.co.jpは商品名と価格のみで、販売元（Amazon.co.jp自身か第三者か）とツールバーの表示（アソシエイト対象の判断材料）を取得できていない。
- 2026-10-18注意: 「Galaxy Z Fold8 Ultra」は別機種（メイン約8.0インチ・カバー約6.5インチ、約4.1mm、約215g、約2億画素広角、5,000mAh）で、Fold8と取り違えない。
- 再開条件: Amazon.co.jpで両機の販売元（Amazon.co.jpの直販か）とツールバーの表示を確認でき、確認済みの購入先が1つ以上になること。あわせて、Samsung公式で販売価格が税込であることを確認すること。税込と確認できるまでは、金額を示す場合も「2026-10-18時点でSamsung公式が表示していた販売価格」のように確認日つきで書き、税込や定価と断定しない。

### Meta Quest 3S vs Meta Quest 3

- 選定理由: VR/MRヘッドセットは公開中の記事がなく、3Sと3は価格差・画質・容量で迷いが明確。
- 状態: 候補（2026-10-18にMeta日本公式の仕様・価格を確認（下記）。Amazon.co.jpの直販の新品単体は未確認。2026-10-12にAmazon.co.jpの検索で、Meta Quest 3S 128GB（ゲームのバンドル品 B0F8VJ57Q1）、Meta Quest 3 512GB B0CF1DLZPY、Meta Quest 3 128GB B0CB3WXL12、3S 256GB B09JMJX9DT等の存在を確認。バンドル品と単体品の区別、旧世代・並行輸入の有無、ASINの価格・販売元・ツールバーの表示は未確認）
- 想定比較軸: レンズ・解像度、視野角、容量、プロセッサ、価格、重さ
- 確認すること: Meta公式の仕様と価格、ゲームのバンドルなしの単体のASINを特定する、容量を揃えるか決める、両ASINの価格・販売元・ツールバーの表示
- 注意: バンドル品（ゲーム同梱）を、単体品と取り違えない。
- 2026-10-18確認: Meta日本公式（`meta.com/jp`）のbuy-nowページ（JSON-LD）・比較ページ・製品ページで価格と仕様を確認。Meta Quest 3S 128GB＝50,490円（定価59,400円）、Meta Quest 3 512GB＝102,300円。3Sはフレネルレンズ・1832×1920px/片目・水平96°/垂直90°・Snapdragon XR2 Gen 2・8GB・4324mAh（約2.5時間）・約514g。Quest 3はパンケーキレンズ・2064×2208px/片目・水平110°/垂直96°・同じSoC・8GB・5060mAh（約2.2時間）・約515g。
- 2026-10-18確認（容量の制約）: 公式比較ページの現行ラインアップは「Quest 3S 128GB / Quest 3S 256GB / Quest 3 512GB」の3つのみで、Quest 3の128GB/256GBは掲載がない。容量を揃えた比較は組めず、「Quest 3S（128GBまたは256GB） vs Quest 3（512GB）」の構成になり、容量差を記事で明示する必要がある。
- 2026-10-18確認（購入導線）: Meta公式ではQuest 3S 256GB（65,450円）が在庫切れ。Amazon.co.jpはQuest 3S 128GB（B09MJQKS5D）が「現在お取り扱いできません」、Quest 3 512GB（B0CF1DLZPY）は第三者出品（新品16件中、表示100,900円）のみで、Amazon直販の新品単体は確認できていない。
- 2026-10-18未確認: Quest 3S 256GBのAmazon.co.jp単体ページ（ASIN）。質量（514g/515g）は公式ページ本文がクライアント側描画のため公式ページの文言を検索経由で確認したもので、一次取得での再確認が望ましい。

### ASUS ROG Xbox Ally vs ROG Xbox Ally X

- 選定理由: ポータブルゲーミングPCは公開中の記事がなく、通常版とXは、チップ・メモリ・ストレージ・バッテリーが異なり、選択で迷いが明確。
- 状態: 候補（2026-10-18にASUS公式の仕様・価格を確認（下記）。Amazon.co.jpの直販の新品単体は未確認。2026-10-12にAmazon.co.jpの検索で、ROG Xbox Ally RC73YA（Ryzen Z2 A・16GB・512GB）B0FPLQXZR5、ROG Xbox Ally X RC73XA（Ryzen AI Z2 Extreme・24GB・1TB）B0FPLP6N4F、旧世代のROG Ally X RC72LA B0D7M6KHS6の存在を確認。ASINの価格・販売元・ツールバーの表示は未確認）
- 想定比較軸: プロセッサ、メモリ、ストレージ、バッテリー容量、重さ、価格
- 確認すること: ASUS Japanの両仕様・価格、両ASINの商品名・価格・販売元・ツールバーの表示、旧世代（Ally X RC72LA）と取り違えない
- 注意: ROG Allyの旧世代と、Xboxの名称が付いた現行モデルを取り違えない。
- 2026-10-18確認: ASUS公式（`rog.asus.com/jp`）の仕様ページで両機を確認。型番はAllyがRC73YA-Z2A16G512（ASUS estore価格129,800円）、Ally XがRC73XA-Z2E24G1T（169,800円）。AllyはRyzen Z2 A（4コア/8スレッド）・16GB LPDDR5-6400・512GB SSD・60Wh・約670g、Ally XはRyzen AI Z2 Extreme（8コア/16スレッド）・24GB LPDDR5X・1TB SSD・80Wh・約715g。ディスプレイは両機とも7.0型1920×1080・120Hz、OSはWindows 11 Home。
- 2026-10-18注意（世代）: ASUS公式には2026年モデル「ROG Xbox Ally X20（RC74XA）」が存在し、旧世代「ROG Ally X（RC72LA、2024）」もある。本候補は2025年モデルのRC73YA/RC73XAで、記事では世代と型番を必ず明示する。
- 2026-10-18確認（購入導線）: Amazon.co.jpはAlly（B0FPLQXZR5）が第三者出品の新品（表示125,000円）、Ally X（B0FPLP6N4F）は中古品のみで、Amazon直販の新品単体は確認できていない。ASUS公式ストア（`store.asus.com/jp`）はHTTP 403で在庫・実売価格を取得できなかった。

## 追加確認・保留

### PlayStation 5 Pro vs PlayStation 5 デジタル・エディション

- 2026-10-11確認: ソニー公式（playstation.com/ja-jp）に、PS5 Pro（希望小売価格137,980円・税込、2TB SSD、Wi-Fi 7、PSSR）と、PS5 デジタル・エディション 日本語専用（希望小売価格55,000円・税込）の価格と主な仕様の記載がある。デジタル・エディションのストレージ容量、両機の質量・サイズは、ソニー公式のページに見当たらなかった（技術仕様ページはHTTP 404）。
- Amazon.co.jp: PS5 デジタル・エディション（CFI-2200B01、B0FX2GKFP8、55,000円）は、出荷元・販売元がAmazon.co.jpで、ツールバーにカテゴリー『TVゲーム』・販売手数料率2.00%が表示された。PS5 Pro（CFI-7100B01、B0G4RR4DM7）のページは、第三者の中古商品（169,999円）の出品だけで、新品の購入先がなく、ツールバーのカテゴリー・販売手数料率が空欄だった。
- 楽天: PS5 Proの新品の出品は転売店が中心で、メーカー直販や信頼できる販売店の商品詳細ページを特定できなかった。
- 保留理由: PS5 Proの新品の購入先を確認できず、各商品に確認済みの購入先がない。
- 再開条件: Amazon.co.jpのPS5 Proに、Amazon販売の新品の出品が戻ること、または、楽天で信頼できる販売店の商品詳細ページが確認できること。その際、公式価格（137,980円）と購入先の価格が大きく離れていないことも確認する。

### iPhone 17 Pro vs iPhone 17

- 2026-10-11確認: Amazon.co.jpの「iPhone 17 Pro 256GB SIMフリー」の検索結果の上位に、新品の単体の商品ページは見当たらなかった（上位は【整備済み品】のiPhone 17 Proとケース類）。iPhone 17eとiPhone 17の記事は公開済み。
- 再開条件: Amazon.co.jpに、新品のiPhone 17 Proの単体の商品詳細ページがあること、または楽天などで、確認済みの購入先が見つかること。

### SwitchBot ロックUltra vs ロックPro

- 2026-10-08確認: ロックUltraはAmazon・楽天（SwitchBot公式店）に単体の商品ページがあるが、ロックProは単体の商品ページが見つからなかった（Amazonは「Pro＋顔認証パッド」などのセット買い、楽天は「ドアロックProセット」のみ）。購入先を確認できず、公開できないため保留。
- 再開条件: ロックProの単体の商品詳細ページが、AmazonまたはSwitchBot公式店（楽天）で確認できること。または、同じ構成のセット同士（例: 顔認証パッドとのセット）の比較に切り替えること。

### DJI Mini 5 Pro vs Mini 4 Pro

- 2026-10-08確認: Mini 5 ProはDJI日本の公式ページとAmazonにある。Mini 4 ProはDJIストア日本版で「お住まいの国／地域ではご購入いただけません」と表示され、Amazonでも本体の商品ページが見つからなかった（アクセサリーのみ）。現行の購入先がない旧モデルとの比較になるため保留。
- 再開条件: 比較相手を、現行で購入できるモデル（例: Mini 4K、Lito X1）に変えること。DJIのドローンはラインナップの変更が多いため、公式ページで現行モデルを再確認してから決める。

### iPad Pro 11インチ vs 13インチ（M5）

- 状態: 保留。2026-10-12のAmazon.co.jpの検索（iPad Pro M5 11インチ Wi-Fi 256GB）では、整備済み品とAppleCare+とのセット品しか確認できず、新品単体の商品詳細ページ（ASIN）を特定できなかった。
- 再開条件: 11インチと13インチの新品単体のASINをAmazonで特定でき、ツールバーの表示（対象可否）と在庫を確認できたとき。

### アップリカ ラクーナ クッションフリー AF vs プラス AE

- 2026-10-05再確認: aprica.jpは商品一覧が403、チャイルドシート配下が404で、HTTP確認できず。保留を継続。
- 保留理由: 公式サイトで対象商品ページを安定して確認できない場合は記事化しない。
- 再開条件: 現行公式ページと両モデルの仕様・画像を個別にHTTP確認できること。

## 調査メモ

- チャイルドシート: `C:\Users\neoen\kuraberu-notes\childseat-research-2026-08.md`
- サーモス・タイガー水筒: `C:\Users\neoen\kuraberu-notes\thermos-tiger-research-2026-08.md`
- 記事テンプレート相談: `C:\Users\neoen\kuraberu-notes\chatgpt-consult-2026-08.md`
- SNS参考情報の選定: `C:\Users\neoen\kuraberu-notes\chatgpt-sns-selection-2026-08.md`

## 運用

- 新記事は必ずブランチ → PR → 必須 `pnpm verify` → マージの順で反映する
- 記事化前に公式URLを再取得し、対象商品・型番・比較軸を確認する
- 記事化後は `src/content/articles.ts` とこのバックログの状態を同じ変更で更新する
- 「現在の公開済み」の表は、本番URLがHTTP 200を返す記事だけにする。公開・取り下げのたびに、本番を実測して表と「公開されていない記事」を更新する
- 本番デプロイはGitマージとは別工程。Direct Uploadの実体と公開URLを確認してから完了扱いにする
- 価格・在庫・体験談は、確認できないものを推測して掲載しない

- [x] パナソニック MC-NX810KM vs MC-NX700K（掃除・収納）— 公式仕様・画像・楽天成果リンク確認済み、2026-08-24実装
