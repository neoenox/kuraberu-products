// instax mini 標準フィルム（無地）の 1 枚あたり価格。
// 価格は楽天市場商品検索 API で取得した値（税込・送料込み表示の出品のみ）。
// 送料別の出品は、送料で順位が逆転するため比較に入れない。
// 価格と在庫は日々変わるため、checkedAt 時点の値として表示する。

export const INSTAX_FILM_CHECKED_AT = "2026-09-30";

export interface InstaxFilmOffer {
  /** クリック計測用の識別子（英数字とハイフン） */
  id: string;
  sheets: number;
  packLabel: string;
  shop: string;
  price: number;
  /** 販売ページの直リンク（確認用。購入ボタンには使わない） */
  itemUrl: string;
  /** 楽天市場商品検索APIが返した成果報酬つきURL（購入ボタンはこれを使う） */
  affiliateUrl: string;
  note?: string;
}

export const instaxFilmOffers: readonly InstaxFilmOffer[] = [
  {
    id: "instax-film-100-rainbowlink",
    sheets: 100,
    packLabel: "10枚パック×10（100枚）",
    shop: "Rainbow Link",
    price: 15970,
    itemUrl: "https://item.rakuten.co.jp/rainbowlink/4259-000030/",
    affiliateUrl:
      "https://hb.afl.rakuten.co.jp/hgc/g00uupnn.w78mae9c.g00uupnn.w78mb12c/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frainbowlink%2F4259-000030%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Frainbowlink%2Fi%2F10000027%2F&rafcid=wsc_i_is_5d23370e-9fc6-491b-bf94-c2110514493a",
  },
  {
    id: "instax-film-30-cheki",
    sheets: 30,
    packLabel: "10枚パック×3（30枚）",
    shop: "チェキカメラ専門店 チェキクラブ",
    price: 4860,
    itemUrl: "https://item.rakuten.co.jp/cheki/7410377224-3/",
    affiliateUrl:
      "https://hb.afl.rakuten.co.jp/hgc/g00sv8zn.w78maba9.g00sv8zn.w78mbb62/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fcheki%2F7410377224-3%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fcheki%2Fi%2F10006298%2F&rafcid=wsc_i_is_5d23370e-9fc6-491b-bf94-c2110514493a",
    note: "ポスト投函便。ほかの商品とは同梱できず、代金引換は使えません。",
  },
  {
    id: "instax-film-100-upstart",
    sheets: 100,
    packLabel: "10枚パック×10（100枚）",
    shop: "リサルボ",
    price: 16770,
    itemUrl: "https://item.rakuten.co.jp/upstart0914/45474103772310/",
    affiliateUrl:
      "https://hb.afl.rakuten.co.jp/hgc/g00ueybn.w78ma414.g00ueybn.w78mbe76/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fupstart0914%2F45474103772310%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fupstart0914%2Fi%2F10000290%2F&rafcid=wsc_i_is_5d23370e-9fc6-491b-bf94-c2110514493a",
    note: "販売ページに、外箱の潰れや開封済みの場合があると書かれています。",
  },
  {
    id: "instax-film-100-pdw",
    sheets: 100,
    packLabel: "10枚パック×10（100枚）",
    shop: "PDWストア",
    price: 17000,
    itemUrl: "https://item.rakuten.co.jp/pdw-store/fuji_instax_mini10x10/",
    affiliateUrl:
      "https://hb.afl.rakuten.co.jp/hgc/g00ssgcn.w78ma7b8.g00ssgcn.w78mb286/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fpdw-store%2Ffuji_instax_mini10x10%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fpdw-store%2Fi%2F10000242%2F&rafcid=wsc_i_is_5d23370e-9fc6-491b-bf94-c2110514493a",
  },
  {
    id: "instax-film-10-cheki",
    sheets: 10,
    packLabel: "10枚パック×1（10枚）",
    shop: "チェキカメラ専門店 チェキクラブ",
    price: 1780,
    itemUrl: "https://item.rakuten.co.jp/cheki/m-47410377224/",
    affiliateUrl:
      "https://hb.afl.rakuten.co.jp/hgc/g00sv8zn.w78maba9.g00sv8zn.w78mbb62/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fcheki%2Fm-47410377224%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fcheki%2Fi%2F10005980%2F&rafcid=wsc_i_is_5d23370e-9fc6-491b-bf94-c2110514493a",
    note: "ポスト投函便。ほかの商品とは同梱できず、代金引換は使えません。",
  },
];

export const perSheet = (offer: InstaxFilmOffer): number =>
  Math.round((offer.price / offer.sheets) * 10) / 10;
