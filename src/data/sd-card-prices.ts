// フルサイズ SDXC カード（UHS-I U3・V30）の 1GB あたり価格。
// 価格は楽天市場商品検索 API で取得した値（税込・送料込み表示の出品のみ）。
// 送料別・並行輸入品・microSD・複数枚セット・ノーブランド品は比較に入れない。
// 容量ごとに、送料込みで在庫のある出品のうち最安の 1 件を、ブランドごとに載せる。

export const SD_CARD_CHECKED_AT = "2026-09-30";

export interface SdCardOffer {
  /** クリック計測用の識別子（英数字とハイフン） */
  id: string;
  model: string;
  capacityGb: number;
  shop: string;
  price: number;
  /** 販売ページの直リンク（確認用。購入ボタンには使わない） */
  itemUrl: string;
  /** 楽天市場商品検索APIが返した成果報酬つきURL（購入ボタンはこれを使う） */
  affiliateUrl: string;
  note?: string;
}

export const sdCardOffers: readonly SdCardOffer[] = [
  {
    id: "sd-card-sandisk-64",
    model: "サンディスク Extreme Pro",
    capacityGb: 64,
    shop: "SPD楽天市場店",
    price: 4240,
    itemUrl: "https://item.rakuten.co.jp/spd-shop/sasd64g-xxu-ex/",
    affiliateUrl:
      "https://hb.afl.rakuten.co.jp/hgc/g00sal7n.w78ma4db.g00sal7n.w78mbc10/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fspd-shop%2Fsasd64g-xxu-ex%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fspd-shop%2Fi%2F10003802%2F&rafcid=wsc_i_is_5d23370e-9fc6-491b-bf94-c2110514493a",
  },
  {
    id: "sd-card-sandisk-128",
    model: "サンディスク Extreme Pro",
    capacityGb: 128,
    shop: "SPD楽天市場店",
    price: 7050,
    itemUrl: "https://item.rakuten.co.jp/spd-shop/sasd128g-xxd-ex/",
    affiliateUrl:
      "https://hb.afl.rakuten.co.jp/hgc/g00sal7n.w78ma4db.g00sal7n.w78mbc10/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fspd-shop%2Fsasd128g-xxd-ex%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fspd-shop%2Fi%2F10003801%2F&rafcid=wsc_i_is_5d23370e-9fc6-491b-bf94-c2110514493a",
  },
  {
    id: "sd-card-sandisk-256",
    model: "サンディスク Extreme Pro",
    capacityGb: 256,
    shop: "SPD楽天市場店",
    price: 13480,
    itemUrl: "https://item.rakuten.co.jp/spd-shop/sasd256g-xpa/",
    affiliateUrl:
      "https://hb.afl.rakuten.co.jp/hgc/g00sal7n.w78ma4db.g00sal7n.w78mbc10/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fspd-shop%2Fsasd256g-xpa%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fspd-shop%2Fi%2F10000099%2F&rafcid=wsc_i_is_5d23370e-9fc6-491b-bf94-c2110514493a",
  },
  {
    id: "sd-card-sandisk-512",
    model: "サンディスク Extreme Pro",
    capacityGb: 512,
    shop: "SPD楽天市場店",
    price: 22900,
    itemUrl: "https://item.rakuten.co.jp/spd-shop/sasd512g-xxd/",
    affiliateUrl:
      "https://hb.afl.rakuten.co.jp/hgc/g00sal7n.w78ma4db.g00sal7n.w78mbc10/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fspd-shop%2Fsasd512g-xxd%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fspd-shop%2Fi%2F10003940%2F&rafcid=wsc_i_is_5d23370e-9fc6-491b-bf94-c2110514493a",
  },
  {
    id: "sd-card-kioxia-64",
    model: "キオクシア EXCERIA G2",
    capacityGb: 64,
    shop: "PCグッドメディア楽天市場店",
    price: 3799,
    itemUrl: "https://item.rakuten.co.jp/pc-goodmedia/20241113-000001/",
    affiliateUrl:
      "https://hb.afl.rakuten.co.jp/hgc/g00qyxan.w78mabea.g00qyxan.w78mbaa1/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fpc-goodmedia%2F20241113-000001%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fpc-goodmedia%2Fi%2F10028090%2F&rafcid=wsc_i_is_5d23370e-9fc6-491b-bf94-c2110514493a",
  },
  {
    id: "sd-card-kioxia-128",
    model: "キオクシア EXCERIA G2",
    capacityGb: 128,
    shop: "PCグッドメディア楽天市場店",
    price: 7299,
    itemUrl: "https://item.rakuten.co.jp/pc-goodmedia/20241114-000001/",
    affiliateUrl:
      "https://hb.afl.rakuten.co.jp/hgc/g00qyxan.w78mabea.g00qyxan.w78mbaa1/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fpc-goodmedia%2F20241114-000001%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fpc-goodmedia%2Fi%2F10028094%2F&rafcid=wsc_i_is_5d23370e-9fc6-491b-bf94-c2110514493a",
  },
  {
    id: "sd-card-kioxia-256",
    model: "キオクシア EXCERIA G2",
    capacityGb: 256,
    shop: "風見鶏",
    price: 7999,
    itemUrl: "https://item.rakuten.co.jp/kazamidori/4582563857148/",
    affiliateUrl:
      "https://hb.afl.rakuten.co.jp/hgc/g00q2htn.w78ma2fe.g00q2htn.w78mb951/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fkazamidori%2F4582563857148%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fkazamidori%2Fi%2F10020989%2F&rafcid=wsc_i_is_5d23370e-9fc6-491b-bf94-c2110514493a",
    note: "販売ページに「海外リテール」と書かれています。国内向けの製品とは、パッケージや保証の扱いが違う場合があります。",
  },
  {
    id: "sd-card-kioxia-512",
    model: "キオクシア EXCERIA G2",
    capacityGb: 512,
    shop: "風見鶏",
    price: 15999,
    itemUrl: "https://item.rakuten.co.jp/kazamidori/4582563857209/",
    affiliateUrl:
      "https://hb.afl.rakuten.co.jp/hgc/g00q2htn.w78ma2fe.g00q2htn.w78mb951/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fkazamidori%2F4582563857209%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fkazamidori%2Fi%2F10020991%2F&rafcid=wsc_i_is_5d23370e-9fc6-491b-bf94-c2110514493a",
    note: "販売ページに「海外リテール」と書かれています。国内向けの製品とは、パッケージや保証の扱いが違う場合があります。",
  },
];

export const perGb = (offer: SdCardOffer): number =>
  Math.round((offer.price / offer.capacityGb) * 10) / 10;
