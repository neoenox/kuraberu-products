// instax mini の絵柄つき・モノクロームフィルム（10枚入り）の 1 枚あたり価格。
// 価格は楽天市場商品検索 API で取得した値（税込・送料込み表示の出品のみ）。
// 送料別の出品は、送料で順位が逆転するため比較に入れない。
// 柄ごとに、送料込みで、在庫のある出品のうち最安のものを 1 件だけ載せる。

export const INSTAX_PATTERN_CHECKED_AT = "2026-09-30";
export const PATTERN_PACK_SHEETS = 10;

export interface InstaxPatternOffer {
  /** クリック計測用の識別子（英数字とハイフン） */
  id: string;
  pattern: string;
  shop: string;
  price: number;
  /** 販売ページの直リンク（確認用。購入ボタンには使わない） */
  itemUrl: string;
  /** 楽天市場商品検索APIが返した成果報酬つきURL（購入ボタンはこれを使う） */
  affiliateUrl: string;
  note?: string;
}

export const instaxPatternOffers: readonly InstaxPatternOffer[] = [
  {
    id: "instax-pattern-monochrome",
    pattern: "モノクローム",
    shop: "ラサンタ",
    price: 1451,
    itemUrl: "https://item.rakuten.co.jp/lasanta-lease/sll065a517935/",
    affiliateUrl:
      "https://hb.afl.rakuten.co.jp/hgc/g00tz09n.w78maa9a.g00tz09n.w78mb53a/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Flasanta-lease%2Fsll065a517935%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Flasanta-lease%2Fi%2F10072432%2F&rafcid=wsc_i_is_5d23370e-9fc6-491b-bf94-c2110514493a",
  },
  {
    id: "instax-pattern-soft-lavender",
    pattern: "ソフトラベンダー",
    shop: "ファインフォト",
    price: 1980,
    itemUrl: "https://item.rakuten.co.jp/fine-ph/instax_mini_softlavender/",
    affiliateUrl:
      "https://hb.afl.rakuten.co.jp/hgc/g00sk8an.w78mad74.g00sk8an.w78mb56b/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ffine-ph%2Finstax_mini_softlavender%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Ffine-ph%2Fi%2F10000591%2F&rafcid=wsc_i_is_5d23370e-9fc6-491b-bf94-c2110514493a",
    note: "販売ページに、購入数量の制限があると書かれています。",
  },
  {
    id: "instax-pattern-sprinkles",
    pattern: "スプリンクルズ",
    shop: "MoriMoriStore(測定の森)",
    price: 2115,
    itemUrl: "https://item.rakuten.co.jp/sokutei/4547410541700/",
    affiliateUrl:
      "https://hb.afl.rakuten.co.jp/hgc/g00sxgsn.w78ma03b.g00sxgsn.w78mb457/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fsokutei%2F4547410541700%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fsokutei%2Fi%2F10189169%2F&rafcid=wsc_i_is_5d23370e-9fc6-491b-bf94-c2110514493a",
    note: "販売ページに、初期不良の受付ができないと書かれています。",
  },
  {
    id: "instax-pattern-rainbow",
    pattern: "レインボー",
    shop: "三星カメラ楽天市場店",
    price: 2200,
    itemUrl: "https://item.rakuten.co.jp/mituboshicamera/4547410225754/",
    affiliateUrl:
      "https://hb.afl.rakuten.co.jp/hgc/g00r8zen.w78ma4fb.g00r8zen.w78mbca8/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmituboshicamera%2F4547410225754%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fmituboshicamera%2Fi%2F10016118%2F&rafcid=wsc_i_is_5d23370e-9fc6-491b-bf94-c2110514493a",
    note: "ポスト投函またはネコポス発送です。",
  },
  {
    id: "instax-pattern-kikilala",
    pattern: "キキ＆ララ",
    shop: "らいぶshop",
    price: 2773,
    itemUrl: "https://item.rakuten.co.jp/lcs-live/10015467/",
    affiliateUrl:
      "https://hb.afl.rakuten.co.jp/hgc/g00r1fdn.w78ma6ac.g00r1fdn.w78mbe26/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Flcs-live%2F10015467%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Flcs-live%2Fi%2F10015415%2F&rafcid=wsc_i_is_5d23370e-9fc6-491b-bf94-c2110514493a",
    note: "ポスト投函またはネコポス発送です。",
  },
  {
    id: "instax-pattern-macaron",
    pattern: "マカロン",
    shop: "らいぶshop",
    price: 2881,
    itemUrl: "https://item.rakuten.co.jp/lcs-live/10014350/",
    affiliateUrl:
      "https://hb.afl.rakuten.co.jp/hgc/g00r1fdn.w78ma6ac.g00r1fdn.w78mbe26/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Flcs-live%2F10014350%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Flcs-live%2Fi%2F10014329%2F&rafcid=wsc_i_is_5d23370e-9fc6-491b-bf94-c2110514493a",
    note: "ポスト投函またはネコポス発送です。",
  },
  {
    id: "instax-pattern-kitty3",
    pattern: "ハローキティ3",
    shop: "らいぶshop",
    price: 2999,
    itemUrl: "https://item.rakuten.co.jp/lcs-live/10015524/",
    affiliateUrl:
      "https://hb.afl.rakuten.co.jp/hgc/g00r1fdn.w78ma6ac.g00r1fdn.w78mbe26/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Flcs-live%2F10015524%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Flcs-live%2Fi%2F10015474%2F&rafcid=wsc_i_is_5d23370e-9fc6-491b-bf94-c2110514493a",
    note: "ポスト投函またはネコポス発送です。",
  },
  {
    id: "instax-pattern-heart-sketch",
    pattern: "ハートスケッチ",
    shop: "ディーライズ2号店",
    price: 3380,
    itemUrl: "https://item.rakuten.co.jp/e-cutestyle/p003000028940/",
    affiliateUrl:
      "https://hb.afl.rakuten.co.jp/hgc/g00rd00n.w78ma52d.g00rd00n.w78mb3cd/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fe-cutestyle%2Fp003000028940%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fe-cutestyle%2Fi%2F19792854%2F&rafcid=wsc_i_is_5d23370e-9fc6-491b-bf94-c2110514493a",
  },
  {
    id: "instax-pattern-soft-glitter",
    pattern: "ソフトグリッター",
    shop: "ディーライズ2号店",
    price: 3520,
    itemUrl: "https://item.rakuten.co.jp/e-cutestyle/p003000029782/",
    affiliateUrl:
      "https://hb.afl.rakuten.co.jp/hgc/g00rd00n.w78ma52d.g00rd00n.w78mb3cd/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fe-cutestyle%2Fp003000029782%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fe-cutestyle%2Fi%2F19796274%2F&rafcid=wsc_i_is_5d23370e-9fc6-491b-bf94-c2110514493a",
  },
];

export const perSheet = (offer: InstaxPatternOffer): number =>
  Math.round((offer.price / PATTERN_PACK_SHEETS) * 10) / 10;
