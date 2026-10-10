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

## 現在の公開済み（42本）

検索・記事一覧・サイトマップに載る記事（`config/article-template-policy.mjs`の`PUBLISHED_ARTICLE_PAGE_SLUGS`）だけを載せている。公開状況は、コード上の記事の有無ではなく、本番の実測（HTTP 200かつ`robots`が`index`）を正とする。

2026-10-09に、旧形式で検索・一覧に載らなかった57本（URLを直接開けば表示されたが`noindex,nofollow`）と、商品選択診断（`/tools/product-finder/`の5カテゴリ）を削除した。削除した記事のURLは、`public/_redirects`で`/404.html`（302）を返す。

| slug                                                 | 状態     |
| ---------------------------------------------------- | -------- |
| `airpods-5-vs-airpods-4-anc`                         | 公開済み |
| `anker-a121a-vs-a2688`                               | 公開済み |
| `anker-a1664-vs-a1654`                               | 公開済み |
| `anker-nano-a1638-vs-power-bank-a1256`               | 公開済み |
| `anker-solix-c300-vs-jackery-240-new`                | 公開済み |
| `anker-soundcore-liberty-5-pro-vs-liberty-5-pro-max` | 公開済み |
| `crucial-x10-pro-vs-kingston-xs2000`                 | 公開済み |
| `dainichi-hd-lx1226-vs-hd-lx1026`                    | 公開済み |
| `dji-osmo-action-6-vs-gopro-hero13-black`            | 公開済み |
| `garmin-forerunner-570-vs-coros-pace-4`              | 公開済み |
| `instax-mini-13-vs-mini-41`                          | 公開済み |
| `instax-mini-evo-vs-evo-cinema`                      | 公開済み |
| `ipad-a16-vs-ipad-air-m4`                            | 公開済み |
| `iphone-18-pro-vs-pixel-11-pro`                      | 公開済み |
| `jbl-flip-7-vs-charge-6`                             | 公開済み |
| `jbl-tour-pro-3-vs-live-beam-3`                      | 公開済み |
| `karcher-k2-silent-vs-k3-silent-plus`                | 公開済み |
| `kindle-paperwhite-vs-colorsoft`                     | 公開済み |
| `kindle-vs-kindle-paperwhite`                        | 公開済み |
| `ipad-mini-a17-pro-vs-ipad-a16`                      | 公開済み |
| `apple-watch-series-12-vs-se-3`                      | 公開済み |
| `kobo-clara-colour-vs-libra-colour`                  | 公開済み |
| `logicool-mx-master-4-vs-mx-master-3s`               | 公開済み |
| `logicool-pebble-m350s-vs-m650`                      | 公開済み |
| `logicool-pro-x-superlight-2-dex-vs-superlight-2`    | 公開済み |
| `nintendo-switch-2-vs-switch-oled`                   | 公開済み |
| `pixel-watch-5-vs-galaxy-watch9`                     | 公開済み |
| `sharp-hotcook-kn-hw24k-vs-kn-hw24h`                 | 公開済み |
| `sony-wf-1000xm6-vs-linkbuds-fit`                    | 公開済み |
| `sony-wf-c710n-vs-linkbuds-fit`                      | 公開済み |
| `sony-wf-c710n-vs-soundcore-liberty-5`               | 公開済み |
| `sony-zv-1-ii-vs-zv-1f`                              | 公開済み |
| `sony-zv-e10m2-vs-nikon-z30`                         | 公開済み |
| `switchbot-hub3-vs-hub2`                             | 公開済み |
| `amazon-fire-tv-stick-4k-max-vs-4k-select`           | 公開済み |
| `amazon-echo-show-8-vs-echo-show-5`                  | 公開済み |
| `amazon-echo-dot-max-vs-echo-dot-5th`                | 公開済み |
| `philips-sonicare-7100-hx7420-vs-6500-hx7410`        | 公開済み |
| `tp-link-archer-be550-vs-be450`                      | 公開済み |
| `zojirushi-ee-dg35-vs-ee-dg50`                       | 公開済み |
| `zojirushi-ee-dg50-vs-ee-rv50`                       | 公開済み |
| `zojirushi-ee-tc60-vs-dainichi-hd-lx1026`            | 公開済み |

## 公開されていない記事（64本）

記事ページのコードと記事データは残っているが、2026-10-07の実測で本番がHTTP 302（`/404.html`）を返した記事。過去に記事を取り下げた運用（履歴: `ops: take comparison articles offline`、`ops: withdraw existing articles from public site`）の結果とみられる。再公開するときは、公式情報・購入導線を再確認し、品質ゲートを通してから`PUBLISHED_ARTICLE_PAGE_SLUGS`へ追加する。

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

公開済み記事は上の表を正とし、各記事の確認記録は`docs/article-handoffs/`のhandoffを参照する。以下は公式情報が未確認の候補で（2026-10-08に5本、2026-10-09にさらに5本を補充。アクセス実績は参照していない。現行モデルの存在をAmazonの検索結果またはApple公式ページで確認しただけで、仕様・価格・型番は未確認）、記事化前に公式URLの再取得が必要。

候補を選ぶときは、次を先に確認する（2026-10-07〜08の作業で、記事化できなかった例から）。

- 両方の商品に、Amazonまたは楽天で、単体の商品詳細ページがある（セット品しかない商品は、購入先を確認できず公開できない）
- 比較する両方の商品が、メーカーの現行ラインナップで、購入できる（旧モデルは公式ストアで購入不可のことがある）
- 色・容量・構成違いが多い商品は、比較する型番・構成を先に決める

新たに着手する場合は、選定基準に沿ってslug・比較軸・公式URL・購入導線の
確認状態をここへ追記し、公開時に上の表へ移す。

### Amazon Kindle Scribe vs Kindle Scribe Colorsoft（2026年発売）

- 選定理由: 公開中のKindle記事（Paperwhite vs Colorsoft）から読者が移りやすい。手書きノート対応のKindleは未着手。
- 状態: 候補（公式情報を一部確認。2026-10-10にAmazon公式プレスリリース（https://press.aboutamazon.com/jp/2026/5/amazon-launches-new-kindle-scribe-lineup-in-japan-including-kindle-scribe-colorsoft-the-first-color-display-model）で、新Kindle Scribeシリーズ（2026年6月10日出荷開始予定）を確認。AmazonのASIN・商品詳細ページ・画像は未確認）
- プレスリリースで確認した値（税込）: 画面11インチ（反射防止）、厚さ5.4mm、質量400g、バッテリーは「数週間」（時間の記載なし）。Kindle Scribe（フロントライト搭載）は32GB 89,980円・64GB 98,980円、フロントライト非搭載は16GB 72,980円。Kindle Scribe Colorsoftは32GB 106,980円・64GB 115,980円（グラファイト/フィグ）。画面解像度・ペンの仕様は記載なし。
- 注意: 画面サイズ・厚さ・質量はプレスリリース上、新シリーズ共通の記載で、Colorsoftとの違いは主に色表示と価格。比較軸は「カラー表示の有無と価格差」が中心になる。比較する容量（32GBどうし）を先に決める。
- 想定比較軸: カラー表示、画面サイズ、ペンの種類、ストレージ、バッテリー、価格
- 確認すること: Amazon.co.jpの両商品ページ、世代・容量の組み合わせ、ペンが付属する構成か、発売前か販売中か

### Sony WH-1000XM6 vs Bose QuietComfort Ultra Headphones（第2世代）

- 選定理由: ヘッドホンは公開中の記事がなく（イヤホンのみ）、ノイズキャンセリングのヘッドホンは検索需要が見込める。ソニーの旧記事（`sony-wh-1000xm6-vs-wh-1000xm5`など）は本番で非公開で、比較相手が異なる。
- 状態: 候補（公式情報は未確認。2026-10-09にAmazon.co.jpの検索で、WH-1000XM6（B0F77PMC1P、ブラック）とBose QuietComfort Ultra Headphones（第2世代）（B0FL2HYBGJ）の存在を確認。ソニー・ボーズの公式ページが開くことのみ確認）
- 想定比較軸: ノイズキャンセリング、バッテリー、質量、対応コーデック、空間オーディオ、マルチポイント、価格
- 確認すること: ソニー・ボーズの公式仕様ページ、Amazonの両商品ページ（色違い・LE版の扱い）、型番・世代、既存の非公開記事との重複

### Apple AirPods Pro 3 vs Google Pixel Buds Pro 2

- 選定理由: 公開中のイヤホン記事はAirPods 5とソニー・Ankerが中心で、Pixel Budsが未着手。スマホ記事（iPhone vs Pixel）から読者が移りやすい。
- 状態: 候補（公式情報は未確認。2026-10-09にAmazon.co.jpの検索で、AirPods Pro 3（B0FRZ3SZWX）とGoogle Pixel Buds Pro 2（B0FN3KT3C8、Moonstone）の存在を確認。AppleとGoogleの公式ページが開くことのみ確認）
- 想定比較軸: ノイズキャンセリング、バッテリー、心拍センサー・補聴機能、対応端末、IP等級、価格
- 確認すること: Apple日本・Googleストアの公式仕様ページ、Amazonの両商品ページ（色の扱い）、Pixel Buds Pro 2の現行販売状況、既存の非公開記事（`airpods-pro-3-vs-sony-wf-1000xm6`）との重複

### MacBook Air 13インチ vs 15インチ（M5）

- 選定理由: ノートPCは公開中の記事にないカテゴリで、画面サイズ違いの選択は迷いが明確。Apple公式で比較軸を確認しやすい。
- 状態: 候補（公式情報は未確認。2026-10-09にAmazon.co.jpの検索で、2026年のMacBook Air M5の13インチ（B0GR1T11D6）と15インチ（B0GR1PRMDS）の存在を確認。Apple日本の仕様ページが開くことのみ確認）
- 想定比較軸: 画面サイズ、質量、バッテリー、スピーカー、ポート、公式価格
- 確認すること: Apple日本の仕様・購入ページ、比較する構成（メモリ・ストレージ・色）を先に決める、Amazonの両商品ページが同じ構成か、公開中のApple記事との重複
- 注意: メモリ・ストレージ・色の違いで価格と商品ページが分かれるため、比較する構成を1つに絞る。

### Roborock Qrevo L Pro vs Qrevo Curv 2 Flow

- 選定理由: ロボット掃除機は公開中の記事がなく、水拭き対応のモデル選びは迷いやすい。2026年モデルが両方Amazonに単体の商品ページがある。
- 状態: 候補（公式情報は未確認。2026-10-09にAmazon.co.jpの検索で、Qrevo L Pro（B0GXB5HWWD、2026年モデル）とQrevo Curv 2 Flow（B0GXB2RZ9Y）の存在を確認。ロボロック公式の日本語ページのURLは未特定）
- 想定比較軸: 吸引力、モップの方式、ステーションの機能、障害物回避、本体サイズ、価格
- 確認すること: ロボロック公式の日本語商品ページ（URLの特定）、Amazonの両商品ページ、型番・色、既存の非公開記事（`roborock-qrevo-curv-vs-dreame-x50`）との重複
- 注意: 旧記事のQrevo Curvとは別モデル。型番が似ているため、取り違えないよう型番を先に確認する。

### iPhone 17e vs iPhone 17

- 選定理由: 公開中のスマートフォン記事は1本のみで、価格を抑えたiPhoneと標準モデルの迷いは検索需要が見込める。Apple公式で比較軸を確認しやすい。
- 状態: 候補（公式情報は未確認。2026-10-09にAmazon.co.jpの検索で、iPhone 17e 256GB（B0GQVYHYFK）とiPhone 17 256GB（B0FQG97CDB）の存在を確認）
- 想定比較軸: 画面サイズ・リフレッシュレート、チップ、カメラ、バッテリー、ストレージ、公式価格
- 確認すること: Apple日本の両仕様ページと購入ページ、比較する容量・色を1つに絞る、Amazonの両商品ページが同じ構成か、公開中のiPhone記事（iPhone 18 Pro vs Pixel 11 Pro）との重複

## 追加確認・保留

### SwitchBot ロックUltra vs ロックPro

- 2026-10-08確認: ロックUltraはAmazon・楽天（SwitchBot公式店）に単体の商品ページがあるが、ロックProは単体の商品ページが見つからなかった（Amazonは「Pro＋顔認証パッド」などのセット買い、楽天は「ドアロックProセット」のみ）。購入先を確認できず、公開できないため保留。
- 再開条件: ロックProの単体の商品詳細ページが、AmazonまたはSwitchBot公式店（楽天）で確認できること。または、同じ構成のセット同士（例: 顔認証パッドとのセット）の比較に切り替えること。

### DJI Mini 5 Pro vs Mini 4 Pro

- 2026-10-08確認: Mini 5 ProはDJI日本の公式ページとAmazonにある。Mini 4 ProはDJIストア日本版で「お住まいの国／地域ではご購入いただけません」と表示され、Amazonでも本体の商品ページが見つからなかった（アクセサリーのみ）。現行の購入先がない旧モデルとの比較になるため保留。
- 再開条件: 比較相手を、現行で購入できるモデル（例: Mini 4K、Lito X1）に変えること。DJIのドローンはラインナップの変更が多いため、公式ページで現行モデルを再確認してから決める。

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
