import type { CommercialArticleSeed } from "./types";

const rakutenBase =
  "https://hb.afl.rakuten.co.jp/ichiba/57a4962c.d331655a.57a4962d.2b976f04/?pc=";
const rakutenToken =
  "&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJpdGVtIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW1lIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D";
export const shokzOpenfit2PlusVsOpenfit2Seed: CommercialArticleSeed = {
  id: "shokz-openfit-2-plus-vs-openfit-2",
  publishedAt: "2026-09-22",
  modifiedAt: "2026-09-22",
  handoffManifestId: "shokz-openfit-2-plus-vs-openfit-2-2026-09-22",
  productInfoCheckedAt: "2026-09-22",
  purchaseLinksCheckedAt: "2026-09-22",
  purchaseLinkStatus: "verified",
  title:
    "Shokz OpenFit 2+とOpenFit 2の違いを比較｜Dolby Audioとワイヤレス充電で選ぶ",
  headline:
    "OpenFit 2+とOpenFit 2を比較。Dolby Audio・ワイヤレス充電・価格の違い",
  description:
    "Shokzのオープンイヤーイヤホン2機種を公式仕様、販売ページ、実利用者の投稿で比較します。",
  category: "オープンイヤー完全ワイヤレスイヤホン",
  tags: ["Shokz", "オープンイヤー", "ワイヤレスイヤホン"],
  audiences: [
    "Dolby Audioを使いたい人",
    "ワイヤレス充電対応のオープンイヤーを選びたい人",
  ],
  uses: ["通勤・通学", "ランニングや散歩", "周囲の音を聞きながらの通話"],
  summary:
    "Dolby Audioとワイヤレス充電ならOpenFit 2+、2,000円安く軽い本体ならOpenFit 2が向いています。",
  lead: "結論：音の機能と充電ケースの便利さならOpenFit 2+、価格と軽さを優先するならOpenFit 2です。",
  leftProduct: "Shokz OpenFit 2+ T921",
  rightProduct: "Shokz OpenFit 2 T920",
  leftPoint: "Dolby Audio・ワイヤレス充電に対応",
  rightPoint: "2,000円安く約3g軽い",
  leftImage: "/products/shokz-openfit-2-plus.png",
  rightImage: "/products/shokz-openfit-2.png",
  leftAmazonUrl: "https://www.amazon.co.jp/dp/B0F1Y3CJJ2",
  rightAmazonUrl: "https://www.amazon.co.jp/dp/B0DJMG7YW9",
  leftRakutenUrl:
    "https://hb.afl.rakuten.co.jp/ichiba/57a4962c.d331655a.57a4962d.2b976f04/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fakky2018%2Fau-skz-openfit2plus-%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJpdGVtIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW1lIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowfQ%3D%3D",
  rightRakutenUrl:
    "https://hb.afl.rakuten.co.jp/ichiba/57a4962c.d331655a.57a4962d.2b976f04/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fflaner%2F10022823old%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJpdGVtIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW1lIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowfQ%3D%3D",
  officialSources: [
    {
      label: "Shokz OpenFit 2+公式",
      url: "https://jp.shokz.com/products/openfit2plus",
    },
    {
      label: "Shokz OpenFit 2公式",
      url: "https://jp.shokz.com/products/openfit2",
    },
  ],
  verifiedRows: [
    {
      label: "公式価格（税込）",
      left: "27,880円",
      right: "25,880円",
      highlight: "right",
      highlightNote: "2,000円安い",
      direction: "lower-is-better",
    },
    {
      label: "Dolby Audio",
      left: "対応",
      right: "非対応",
      highlight: "left",
      highlightNote: "対応",
    },
    {
      label: "充電ケースのワイヤレス充電",
      left: "対応",
      right: "非対応",
      highlight: "left",
      highlightNote: "対応",
    },
    {
      label: "イヤホン単体再生",
      left: "最大11時間",
      right: "最大11時間",
      highlight: null,
    },
    {
      label: "ケース込み再生",
      left: "最大48時間",
      right: "最大48時間",
      highlight: null,
    },
    {
      label: "イヤホン重量",
      left: "9.4g ± 0.2g",
      right: "9.4g ± 0.2g",
      highlight: null,
    },
    {
      label: "充電ケース重量",
      left: "56g ± 2.0g",
      right: "53g ± 2.0g",
      highlight: "right",
      highlightNote: "約3g軽い",
      direction: "lower-is-better",
    },
    {
      label: "総重量",
      left: "74.8g ± 2.0g",
      right: "71.8g ± 2.0g",
      highlight: "right",
      highlightNote: "約3g軽い",
      direction: "lower-is-better",
    },
    {
      label: "防塵防水",
      left: "イヤホンIP55",
      right: "イヤホンIP55",
      highlight: null,
    },
    { label: "マルチポイント", left: "対応", right: "対応", highlight: null },
  ],
  faqEntries: [
    {
      question: "Dolby Audioに対応するのは？",
      answer: "OpenFit 2+です。OpenFit 2はDolby Audio非対応です。",
    },
    {
      question: "ワイヤレス充電できるのは？",
      answer: "OpenFit 2+です。OpenFit 2はUSB充電のみです。",
    },
    {
      question: "安くて軽いのは？",
      answer:
        "OpenFit 2です。公式価格は2,000円安く、総重量も約3g軽くなっています。",
    },
    {
      question: "再生時間は違う？",
      answer: "イヤホン単体は最大11時間、ケース込みは最大48時間で同じです。",
    },
  ],
  decisionGuideSteps: [
    "Dolby Audioが必要か決める",
    "充電ケースをワイヤレス充電したいか確認する",
    "2,000円の価格差と約3gの重量差を比べる",
    "購入前に販売ページで価格・在庫・カラーを確認する",
  ],
  socialProofQuery: "Shokz OpenFit 2+ T921 OpenFit 2 T920 使用感",
  socialProofCheckedAt: "2026-09-22",
  socialProofHasPosts: true,
  socialProofBestMatch: "model",
  socialProofDirectPosts: [
    {
      label: "OpenFit 2+の使用感（Reddit）",
      href: "https://www.reddit.com/r/shokz/comments/1umknfx/shokz_openfit_2_bad_sound/",
      note: "購入後の音質とDolby Audioについての実利用投稿",
    },
    {
      label: "OpenFit 2の使用感（Reddit）",
      href: "https://www.reddit.com/r/shokz/comments/1svhlc9/openfit_2_quality_and_warrenty_warning/",
      note: "約1か月使用後の装着感と保証対応についての投稿",
    },
  ],
  embeds: [
    {
      provider: "reddit",
      url: "https://www.reddit.com/r/shokz/comments/1umknfx/shokz_openfit_2_bad_sound/",
      title: "Shokz OpenFit 2+の使用感",
      match: "model",
      purpose: "購入後の音質とDolby Audioの感想",
      summary: "購入後の音のこもりや個体差についての実利用投稿",
      author: "Soggy_Fly_5781",
      community: "shokz",
      tone: "negative",
      autoload: true,
      autoDisplay: true,
      compact: true,
    },
    {
      provider: "reddit",
      url: "https://www.reddit.com/r/shokz/comments/1svhlc9/openfit_2_quality_and_warrenty_warning/",
      title: "OpenFit 2の使用感",
      match: "model",
      purpose: "約1か月使用後の装着感と保証対応",
      summary: "イヤーフックのフィット感変化と保証対応についての実利用投稿",
      author: "Terrible_Riddle",
      community: "shokz",
      tone: "negative",
      autoload: true,
      autoDisplay: true,
      compact: true,
    },
  ],
  officialProse: [
    {
      heading: "Shokz OpenFit 2+ T921",
      items: [
        "税込27,880円。Dolby Audioと充電ケースのワイヤレス充電に対応します。",
        "Bluetooth 5.4、最大11時間再生、ケース込み最大48時間、イヤホンIP55です。",
      ],
    },
    {
      heading: "Shokz OpenFit 2 T920",
      items: [
        "税込25,880円。Dolby Audioとワイヤレス充電には対応しません。",
        "Bluetooth 5.4、最大11時間再生、ケース込み最大48時間、イヤホンIP55です。",
      ],
    },
  ],
  sourceLinks: [
    {
      label: "OpenFit 2+公式",
      url: "https://jp.shokz.com/products/openfit2plus",
      date: "2026-09-22",
    },
    {
      label: "OpenFit 2公式",
      url: "https://jp.shokz.com/products/openfit2",
      date: "2026-09-22",
    },
    {
      label: "Amazon OpenFit 2+",
      url: "https://www.amazon.co.jp/dp/B0F1Y3CJJ2",
      date: "2026-09-22",
    },
    {
      label: "Amazon OpenFit 2",
      url: "https://www.amazon.co.jp/dp/B0DJMG7YW9",
      date: "2026-09-22",
    },
    {
      label: "楽天市場 OpenFit 2+",
      url: "https://item.rakuten.co.jp/akky2018/au-skz-openfit2plus-/",
      date: "2026-09-22",
    },
    {
      label: "楽天市場 OpenFit 2",
      url: "https://item.rakuten.co.jp/flaner/10022823old/",
      date: "2026-09-22",
    },
  ],
  disclaimer:
    "仕様・価格・在庫は変更される可能性があります。購入前に公式ページと販売ページをご確認ください。SNSの採用投稿は個人の感想です。",
};
