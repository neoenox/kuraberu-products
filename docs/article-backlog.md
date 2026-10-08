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

## 現在の公開済み（76本）

2026-10-07に本番URLへ直接アクセスし、HTTP 200で公開されていた記事だけを載せている（`nintendo-switch-2-vs-switch-oled`は同日のデプロイ後に実測して追加）。公開状況は`public/_redirects`やコード上の記事の有無ではなく、本番の実測を正とする。

注意（2026-10-08）: HTTP 200だけでは、読者が来る「公開」とは言えない。旧形式の約60本（`config/article-template-policy.mjs`の`LEGACY_ARTICLE_PAGE_SLUGS`）は、URLを直接開けば表示される（HTTP 200）が、`noindex,nofollow`で、サイトマップ・記事一覧に載らない。この表では、`PUBLISHED_ARTICLE_PAGE_SLUGS`に入っている記事（検索・一覧に載る記事）と、旧形式の記事を分けて数える必要がある。次の整理で、表を2つに分ける。

| slug                                                 | 状態                         |
| ---------------------------------------------------- | ---------------------------- |
| `airpods-5-vs-airpods-4-anc`                         | 公開済み                     |
| `anker-a121a-vs-a2688`                               | 公開済み                     |
| `anker-a1664-vs-a1654`                               | 公開済み                     |
| `anker-nano-a1638-vs-power-bank-a1256`               | 公開済み                     |
| `anker-nano-power-bank-vs-zolo-a1688`                | 公開済み                     |
| `anker-solix-c300-vs-jackery-240-new`                | 公開済み                     |
| `anker-soundcore-liberty-5-pro-vs-liberty-5-pro-max` | 公開済み                     |
| `crucial-x10-pro-vs-kingston-xs2000`                 | 公開済み                     |
| `dainichi-hd-lx1226-vs-hd-lx1026`                    | 公開済み                     |
| `dji-osmo-action-6-vs-gopro-hero13-black`            | 公開済み                     |
| `elecom-de-c85-vs-de-c86`                            | 公開済み                     |
| `garmin-forerunner-570-vs-coros-pace-4`              | 公開済み                     |
| `instax-mini-13-vs-mini-41`                          | 公開済み                     |
| `instax-mini-evo-vs-evo-cinema`                      | 公開済み                     |
| `ipad-a16-vs-ipad-air-m4`                            | 公開済み                     |
| `iphone-18-pro-vs-pixel-11-pro`                      | 公開済み                     |
| `jbl-flip-7-vs-charge-6`                             | 公開済み                     |
| `jbl-tour-pro-3-vs-live-beam-3`                      | 公開済み                     |
| `karcher-k2-silent-vs-k3-silent-plus`                | 公開済み                     |
| `kindle-paperwhite-vs-colorsoft`                     | 公開済み                     |
| `kobo-clara-colour-vs-libra-colour`                  | 公開済み                     |
| `logicool-mx-master-4-vs-mx-master-3s`               | 公開済み                     |
| `logicool-pebble-m350s-vs-m650`                      | 公開済み                     |
| `logicool-pro-x-superlight-2-dex-vs-superlight-2`    | 公開済み                     |
| `nintendo-switch-2-vs-switch-oled`                   | 公開済み                     |
| `pixel-watch-5-vs-galaxy-watch9`                     | 公開済み                     |
| `sharp-hotcook-kn-hw24k-vs-kn-hw24h`                 | 公開済み                     |
| `shokz-openfit-2-plus-vs-openfit-2`                  | 公開済み                     |
| `sony-wf-1000xm6-vs-linkbuds-fit`                    | 公開済み                     |
| `sony-wf-c710n-vs-linkbuds-fit`                      | 公開済み                     |
| `sony-wf-c710n-vs-soundcore-liberty-5`               | 公開済み                     |
| `sony-zv-1-ii-vs-zv-1f`                              | 公開済み                     |
| `sony-zv-e10m2-vs-nikon-z30`                         | 公開済み                     |
| `switchbot-hub3-vs-hub2`                             | 公開済み                     |
| `amazon-fire-tv-stick-4k-max-vs-4k-select`           | 公開済み                     |
| `amazon-echo-show-8-vs-echo-show-5`                  | 公開済み                     |
| `amazon-echo-dot-max-vs-echo-dot-5th`                | 公開済み                     |
| `philips-sonicare-7100-hx7420-vs-6500-hx7410`        | 公開済み                     |
| `t-fal-ko5901jp-vs-zoujirushi-ck-pa08`               | 公開済み                     |
| `tanita-bc-772-vs-omron-hbf-702t`                    | 公開済み                     |
| `tefal-cy8768jp-vs-panasonic-sr-mp300`               | 公開済み                     |
| `tefal-dv4030j0-vs-dv8070j0`                         | 公開済み                     |
| `tefal-ko5901jp-vs-ko8601j0`                         | 公開済み                     |
| `tempur-original-vs-nishikawa-air-pillow`            | 公開済み                     |
| `thermos-jdp-501-vs-zojirushi-sm-za48`               | 公開済み                     |
| `thermos-kfm-020-vs-kfi-020`                         | 公開済み                     |
| `thermos-tiger-bottle`                               | 公開済み                     |
| `tiger-jpv-l100-vs-jpv-m100`                         | 公開済み                     |
| `tiger-mta-j050-guide`                               | 公開済み                     |
| `tiger-pcj-a080-vs-pcm-a080`                         | 公開済み                     |
| `tiger-pct-a120-vs-pct-a150`                         | 公開済み                     |
| `toshiba-er-d3000b-vs-aladdin-agt-g13b`              | 公開済み                     |
| `toshiba-tw-127xm5l-vs-panasonic-na-lx127el`         | 公開済み                     |
| `tp-link-archer-be550-vs-be450`                      | 公開済み                     |
| `yamajitsu-film-holder-242286-vs-242287`             | 公開済み                     |
| `yamazaki-condor-wagon-vs-self-wagon`                | 公開済み                     |
| `yamazaki-dishwasher-rack-241925-vs-241926`          | 公開済み                     |
| `yamazaki-dust-wagon-45l-2division-vs-3division`     | 公開済み                     |
| `yamazaki-free-broom-32-vs-45`                       | 公開済み                     |
| `yamazaki-laundry-wire-basket-m-vs-l`                | 公開済み                     |
| `yamazaki-magnet-kitchen-shelf-240005-vs-241830`     | 公開済み（購入リンク未設定） |
| `yamazaki-ofuda-stand-rin-vs-single`                 | 公開済み                     |
| `yamazaki-rainmat-f216-vs-lonstep`                   | 公開済み（購入リンク未設定） |
| `yamazaki-refrigerator-rack-240057-vs-240059`        | 公開済み                     |
| `yamazaki-tower-desk-panel-vs-pen-stand`             | 公開済み                     |
| `zojirushi-ck-pa08-vs-ck-dc08`                       | 公開済み                     |
| `zojirushi-cv-gb22-vs-tiger-pim-g220`                | 公開済み                     |
| `zojirushi-ec-kv50-vs-ec-ma60`                       | 公開済み                     |
| `zojirushi-ee-dg35-vs-ee-dg50`                       | 公開済み                     |
| `zojirushi-ee-dg50-vs-ee-rv50`                       | 公開済み                     |
| `zojirushi-ee-tc60-vs-dainichi-hd-lx1026`            | 公開済み                     |
| `zojirushi-eq-aa22-vs-eq-sa22`                       | 公開済み                     |
| `zojirushi-eq-ja22-vs-eq-fa22`                       | 公開済み                     |
| `zojirushi-eq-sb22-vs-eq-ah22`                       | 公開済み                     |
| `zojirushi-nx-ab10-vs-nw-wd10`                       | 公開済み                     |
| `zojirushi-nx-ab10-vs-tiger-jrt-a100`                | 公開済み                     |

## 公開されていない記事（99本）

記事ページのコードと記事データは残っているが、2026-10-07の実測で本番がHTTP 302（`/404.html`）を返した記事。過去に記事を取り下げた運用（履歴: `ops: take comparison articles offline`、`ops: withdraw existing articles from public site`）の結果とみられる。再公開するときは、公式情報・購入導線を再確認し、品質ゲートを通してから`PUBLISHED_ARTICLE_PAGE_SLUGS`へ追加する。

| slug                                              | 旧バックログの状態             |
| ------------------------------------------------- | ------------------------------ |
| `airpods-pro-3-vs-sony-wf-1000xm6`                | 表に記載なし                   |
| `amazon-echo-dot-5th-vs-google-nest-mini-2nd`     | 公開済み                       |
| `anessa-perfect-uv-vs-biore-aqua-rich`            | 公開済み                       |
| `anker-soundcore-liberty-4-nc-vs-sony-wf-c710n`   | 公開済み                       |
| `apple-watch-se-vs-xiaomi-redmi-watch-5`          | 公開済み                       |
| `babybjorn`                                       | 公開済み                       |
| `babybjorn-bouncer`                               | 公開済み                       |
| `babybjorn-cradle`                                | 公開済み                       |
| `babybjorn-onekai`                                | 公開済み                       |
| `babybjorn-potty`                                 | 公開済み                       |
| `balmuda-the-toaster-vs-aladdin-graphite-toaster` | 公開済み                       |
| `braun-series9pro-vs-series7`                     | 公開済み                       |
| `bruno-boe021-vs-iris-php-1002tc`                 | 公開済み                       |
| `canon-pixus-ts8830-vs-epson-ep-887a`             | 公開済み                       |
| `casio-px-s1100-vs-yamaha-p-225`                  | 公開済み                       |
| `combi-the-s-plus-vs-premium`                     | 公開済み                       |
| `dainichi-efh-1219d-vs-panasonic-ds-fwx1200`      | 公開済み                       |
| `dainichi-hd-rxt525-vs-panasonic-fe-kxu07`        | 公開済み                       |
| `delonghi-ecam22112b-vs-ecam25023sb`              | 公開済み                       |
| `dyson-v12-detect-slim-vs-shark-evo-power`        | 公開済み                       |
| `dyson-v12-vs-micro-plus`                         | 公開済み                       |
| `fitbit-charge-6-vs-xiaomi-smart-band-9`          | 公開済み                       |
| `gopro-hero13-black-vs-dji-osmo-action-5-pro`     | 公開済み                       |
| `hitachi-bd-sx130k-vs-bd-stx130k`                 | 公開済み                       |
| `hitachi-pv-bl1c4-vs-dyson-sv46-ff`               | 表に記載なし                   |
| `hitachi-ras-aj2226s-vs-daikin-s406atep`          | 表に記載なし                   |
| `iris-fk-c5-vs-panasonic-fd-f06x2`                | 公開済み                       |
| `irobot-roomba-j9plus-vs-j7`                      | 公開済み                       |
| `juki-hzl-f400jp-vs-brother-ps202`                | 公開済み                       |
| `kingjim-tepra-sr-r2500p-vs-sr-mk1`               | 公開済み                       |
| `logicool-k650-vs-k580`                           | 公開済み                       |
| `logicool-lift-vs-m550`                           | 公開済み                       |
| `logicool-mx-keys-s-for-mac-vs-k780`              | 公開済み                       |
| `logicool-mx-keys-s-vs-mx-keys-mini`              | 公開済み                       |
| `logicool-mx-master-3s-vs-m650`                   | 公開済み                       |
| `logicool-mx-master-3s-vs-mx-anywhere-3s`         | 公開済み                       |
| `logicool-zone-vibe-100-vs-zone-300`              | 公開済み                       |
| `makita-cl107-vs-cl286`                           | 公開済み                       |
| `merries-newborn`                                 | 公開済み                       |
| `merries-pants`                                   | 公開済み                       |
| `montbell-tri-pack-vs-anello-backpack`            | 公開済み                       |
| `moony-m`                                         | 公開済み                       |
| `nitori-n-sleep-vs-nishikawa-air-mattress`        | 公開済み                       |
| `omron-hem-7281t-vs-terumo-p2020`                 | 公開済み                       |
| `omron-mc-681-vs-terumo-c205`                     | 公開済み                       |
| `pampers-newborn`                                 | 公開済み                       |
| `panasonic-baby-monitor-kx-hc705`                 | 公開済み                       |
| `panasonic-be-fd633-vs-bridgestone-a6xc41`        | 公開済み                       |
| `panasonic-db-bm1l-vs-db-rm3m`                    | 公開済み                       |
| `panasonic-eh-na0j-vs-eh-na0g`                    | 公開済み                       |
| `panasonic-eh-na0k-vs-eh-ne9n`                    | 公開済み                       |
| `panasonic-eh-na0k-vs-panasonic-eh-na9m`          | 表に記載なし                   |
| `panasonic-eh-na9m-guide`                         | 公開済み                       |
| `panasonic-eh-na9m-vs-eh-na7m`                    | 公開済み                       |
| `panasonic-eh-na9m-vs-refa-beautech`              | 公開済み                       |
| `panasonic-eh-nc80-vs-eh-nc50`                    | 公開済み                       |
| `panasonic-eh-ne7m-vs-eh-ne5m`                    | 公開済み                       |
| `panasonic-ep-ma110-vs-ep-ma121`                  | 公開済み                       |
| `panasonic-es-lt4b-vs-es-lv7j`                    | 公開済み                       |
| `panasonic-es-lv9w-vs-es-lv7w`                    | 公開済み                       |
| `panasonic-es-pv6a-vs-es-pv3a`                    | 公開済み                       |
| `panasonic-es-wp9b-vs-es-wg0b`                    | 公開済み                       |
| `panasonic-ew-da19-vs-ew-da49`                    | 公開済み                       |
| `panasonic-ew-dp57-vs-ew-dt73`                    | 公開済み                       |
| `panasonic-ew-dp57-vs-philips-hx9911`             | 公開済み                       |
| `panasonic-f-px60c-vs-f-px70c`                    | 公開済み                       |
| `panasonic-f-yhvx120-vs-f-yhvx90`                 | 公開済み（公式画像・導線更新） |
| `panasonic-hh-cf1285a-vs-iris-cl12dl`             | 公開済み                       |
| `panasonic-mc-jp860k-vs-mc-sb70km`                | 公開済み                       |
| `panasonic-mc-nx810km-vs-mc-nx700k`               | 公開済み                       |
| `panasonic-mc-sb53k-vs-mc-sb33j`                  | 公開済み                       |
| `panasonic-mc-sb55k-vs-mc-sb35k`                  | 公開済み                       |
| `panasonic-ne-bs6e-vs-ne-bs5e`                    | 公開済み                       |
| `panasonic-ne-bs9c-vs-ne-ubs10c`                  | 公開済み                       |
| `panasonic-ne-fl1a-vs-ne-fl1c`                    | 公開済み                       |
| `panasonic-ne-ms4c-vs-ne-bs5c`                    | 公開済み                       |
| `panasonic-ni-fs70a-vs-ni-fs60b`                  | 公開済み                       |
| `panasonic-nr-f55hy3-vs-sharp-sj-mf55r`           | 公開済み                       |
| `panasonic-nt-t501-vs-nt-d700`                    | 公開済み                       |
| `panasonic-sq-ld560-vs-sq-ld540`                  | 公開済み                       |
| `panasonic-washer-na-lx129c-vs-hitachi-bd-sx130k` | 公開済み                       |
| `philips-s9000-vs-braun-series9pro`               | 公開済み                       |
| `pigeon-bottle-160-240`                           | 公開済み                       |
| `pigeon-bottle-240`                               | 公開済み                       |
| `pigeon-slim-240`                                 | 公開済み                       |
| `re-fa-straight-iron-vs-panasonic-eh-hs0e`        | 公開済み                       |
| `recolte-automatic-cooker-vs-panasonic-nf-pc400`  | 公開済み                       |
| `regza-32v35s-vs-regza-43m550m`                   | 表に記載なし                   |
| `roborock-qrevo-curv-vs-dreame-x50`               | 公開済み                       |
| `samsonite-c-lite-vs-proteca-maxpass`             | 公開済み                       |
| `sharp-heater-hv-r55-vs-iris-uhk500`              | 公開済み                       |
| `sharp-kc-s50-vs-fu-s50`                          | 公開済み                       |
| `sharp-kc-s50-vs-panasonic-f-vxw55`               | 公開済み                       |
| `shupot`                                          | 公開済み                       |
| `sony-bravia-55-xr80-vs-regza-55z870n`            | 公開済み                       |
| `sony-wh-1000xm6-vs-airpods-max`                  | 表に記載なし                   |
| `sony-wh-1000xm6-vs-wh-1000xm5`                   | 公開済み                       |
| `soundcore-liberty-5-pro-vs-liberty-4-pro`        | 公開済み                       |
| `switch-2-vs-switch-2-zelda`                      | 表に記載なし                   |

## 次の候補

公開済み記事は上の表を正とし、各記事の確認記録は`docs/article-handoffs/`のhandoffを参照する。以下は公式情報が未確認の候補で（2026-10-08に5本を補充。アクセス実績は参照していない。現行モデルの存在をAmazonの検索結果またはApple公式ページで確認しただけで、仕様・価格・型番は未確認）、記事化前に公式URLの再取得が必要。

候補を選ぶときは、次を先に確認する（2026-10-07〜08の作業で、記事化できなかった例から）。

- 両方の商品に、Amazonまたは楽天で、単体の商品詳細ページがある（セット品しかない商品は、購入先を確認できず公開できない）
- 比較する両方の商品が、メーカーの現行ラインナップで、購入できる（旧モデルは公式ストアで購入不可のことがある）
- 色・容量・構成違いが多い商品は、比較する型番・構成を先に決める

新たに着手する場合は、選定基準に沿ってslug・比較軸・公式URL・購入導線の
確認状態をここへ追記し、公開時に上の表へ移す。

### Amazon Kindle Scribe vs Kindle Scribe Colorsoft（2026年発売）

- 選定理由: 公開中のKindle記事（Paperwhite vs Colorsoft）から読者が移りやすい。手書きノート対応のKindleは未着手。
- 状態: 候補（公式情報は未確認。2026-10-08のAmazon検索で、Kindle Scribe Colorsoft（2026年発売）の存在を確認。比較相手のKindle Scribeの現行モデルは、単体の商品ページを特定できていない）
- 想定比較軸: カラー表示、画面サイズ、ペンの種類、ストレージ、バッテリー、価格
- 確認すること: Amazon.co.jpの両商品ページ、世代・容量の組み合わせ、ペンが付属する構成か、発売前か販売中か

### Amazon Kindle vs Kindle Paperwhite

- 選定理由: Kindleの入門機と上位機の迷いは検索需要が見込める。公開中のPaperwhite vs Colorsoft記事とは比較相手が異なる。
- 状態: 候補（公式情報は未確認。2026-10-06のAmazonの比較表に、Kindle（29,980円）とKindle Paperwhite（39,980円）が載っていたことのみ確認）
- 想定比較軸: 画面サイズ・解像度、ストレージ、防水、フロントライト、バッテリー、価格
- 確認すること: Amazon.co.jpの両商品ページ、世代・容量・色の組み合わせ、公開中のPaperwhite記事との重複

### iPad mini（A17 Pro） vs iPad（A16）

- 選定理由: 公開中のタブレット記事（iPad vs iPad Air）から読者が移りやすい。小型タブレットの選択が未着手。
- 状態: 候補（公式情報は未確認。2026-10-08にApple日本の仕様ページで、iPad miniがA17 Proチップ搭載であることを確認）
- 想定比較軸: 画面サイズ、チップ、質量、対応Apple Pencil、ストレージ、公式価格
- 確認すること: Apple日本の両仕様ページ、現行の販売状況、Amazon・楽天の商品一致（色・容量違いの扱い）、公開中のiPad記事との重複

### Apple Watch Series 12 vs Apple Watch SE 3

- 選定理由: スマートウォッチは公開中の記事に旧形式のApple Watch SE記事しかなく、Apple公式で現行ラインナップを確認しやすい。
- 状態: 候補（公式情報は未確認。2026-10-08にApple日本の比較ページで、Series 12・Ultra 4・SE 3などの存在を確認。どのモデルが現行販売中かは未確認）
- 想定比較軸: ディスプレイ、チップ、健康機能、バッテリー、サイズ・素材、公式価格
- 確認すること: Apple日本の比較ページと両仕様ページ、現行の販売状況、ケースサイズ・素材・GPS/セルラーの構成の決め方、Amazon・楽天の商品一致

## 追加確認・保留

### SwitchBot ロックUltra vs ロックPro

- 2026-10-08確認: ロックUltraはAmazon・楽天（SwitchBot公式店）に単体の商品ページがあるが、ロックProは単体の商品ページが見つからなかった（Amazonは「Pro＋顔認証パッド」などのセット買い、楽天は「ドアロックProセット」のみ）。購入先を確認できず、公開できないため保留。
- 再開条件: ロックProの単体の商品詳細ページが、AmazonまたはSwitchBot公式店（楽天）で確認できること。または、同じ構成のセット同士（例: 顔認証パッドとのセット）の比較に切り替えること。

### DJI Mini 5 Pro vs Mini 4 Pro

- 2026-10-08確認: Mini 5 ProはDJI日本の公式ページとAmazonにある。Mini 4 ProはDJIストア日本版で「お住まいの国／地域ではご購入いただけません」と表示され、Amazonでも本体の商品ページが見つからなかった（アクセサリーのみ）。現行の購入先がない旧モデルとの比較になるため保留。
- 再開条件: 比較相手を、現行で購入できるモデル（例: Mini 4K、Lito X1）に変えること。DJIのドローンはラインナップの変更が多いため、公式ページで現行モデルを再確認してから決める。

### 旧形式の記事のうち、購入リンクがない3本（2026-10-08確認）

旧形式の記事は、本番でURLを直接開けば表示される（HTTP 200）が、`noindex,nofollow`で、サイトマップ・記事一覧にも載らない（`PUBLISHED_ARTICLE_PAGE_SLUGS`に入っていない）。そのため「現在の公開済み」の表に載っていても、検索や記事一覧から読者が来る状態ではない。以下の3本は、現行の購入先を確認できず、リンクを付けていない。

| slug                               | 確認結果                                                                                                                                             | 再開条件                                                                         |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `zojirushi-eq-aa22-vs-eq-sa22`     | 象印公式で「在庫限定」。Amazonに本体の出品なし。楽天は焼き網などの部品のみ                                                                           | 現行モデル（例: EQ-AB22、EQ-FA22）での比較記事への書き直し                       |
| `tiger-pcj-a080-vs-pcm-a080`       | タイガー公式でPCJ-A（生産終了）、PCM-A（数量限定）。楽天は部品のみ、Amazonは旧型の割高な出品のみ                                                     | 現行モデル（例: PCJ-A101、PCM-N080）での比較記事への書き直し                     |
| `yamazaki-rainmat-f216-vs-lonstep` | F-216は楽天の業務用品店に別注サイズ専用の出品のみ。Amazonに出品なし。ロンステップマット#12は、記事の画像（レッド）と同じ色のAmazon出品が見つからない | 色・サイズを確認できる出品の特定、または記事の画像・仕様を出品に合わせて直すこと |

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
