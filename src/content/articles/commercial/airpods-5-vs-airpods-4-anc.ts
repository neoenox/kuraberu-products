import type { CommercialArticleSeed } from "./types";

export const airpods5VsAirpods4AncSeed: CommercialArticleSeed = {
  id: "airpods-5-vs-airpods-4-anc",
  draft: true,
  publishedAt: "2026-09-30",
  modifiedAt: "2026-09-30",
  productInfoCheckedAt: "2026-09-30",
  handoffManifestId: "airpods-5-vs-airpods-4-anc-2026-09-30",
  purchaseLinksCheckedAt: "2026-09-30",
  purchaseLinkStatus: "unverified",
  amazonLinkStatus: "unverified",
  rakutenLinkStatus: "unverified",
  leftAmazonLinkStatus: "unverified",
  rightAmazonLinkStatus: "unverified",
  leftAmazonUrl: "https://www.amazon.co.jp/dp/B0HJ9VNBZ8",
  rightAmazonUrl: "https://www.amazon.co.jp/dp/B0DGJBNYVY",
  leftRakutenUrl: null,
  rightRakutenUrl: null,
  title:
    "AirPods 5とANC搭載AirPods 4の違いを比較｜ノイズキャンセリング・耐水性能・ケース",
  headline: "AirPods 5とアクティブノイズキャンセリング搭載AirPods 4の違い",
  description:
    "AirPods 5（USB-C充電ケース）とアクティブノイズキャンセリング搭載AirPods 4をApple公式仕様で比較。ANCの公表試験、防塵・耐汗耐水性能、ケース機能、バッテリーの違いを確認します。",
  category: "ワイヤレスイヤホン",
  tags: ["AirPods", "Apple", "ノイズキャンセリング", "ワイヤレスイヤホン"],
  audiences: [
    "Appleのオープンイヤー型AirPodsでANCモデルを選びたい人",
    "AirPods 5とANC搭載AirPods 4の違いを購入前に確認したい人",
  ],
  uses: [
    "通勤・通学中に周囲の音を抑えて音声を聴く",
    "Apple製デバイスと組み合わせて使う",
    "充電ケースの機能や耐汗耐水性能から選ぶ",
  ],
  summary:
    "Appleが公表するANC比較試験とIP等級を重視するならAirPods 5、ワイヤレス充電ケースと「探す」用スピーカーを使いたいならANC搭載AirPods 4が候補です。ANC有効時の再生時間とイヤホン本体の寸法・重さは公式仕様で同じです。",
  leftProduct: "Apple AirPods 5（USB-C充電ケース）",
  rightProduct:
    "Apple アクティブノイズキャンセリング搭載AirPods 4（ワイヤレス充電ケース）",
  leftPoint: "Apple公表のANC比較試験とIP57の防塵・耐汗耐水性能を重視する人向け",
  rightPoint:
    "Qi／Apple Watch充電と「探す」用スピーカー付きケースを使いたい人向け",
  leftImage: "/products/airpods-5-hero.jpg",
  rightImage: "/products/airpods-4-anc.png",
  officialSources: [
    {
      label: "Apple AirPods 5 仕様",
      url: "https://www.apple.com/jp/airpods-5/specs/",
    },
    {
      label: "Apple AirPods モデル比較",
      url: "https://www.apple.com/jp/airpods/compare/",
    },
    {
      label: "Apple アクティブノイズキャンセリング搭載AirPods 4 技術仕様",
      url: "https://support.apple.com/ja-jp/121204",
    },
  ],
  verifiedRows: [
    {
      label: "ANC（Appleの公表比較）",
      left: "ANC搭載AirPods 4との比較で最大1.5倍",
      right: "AirPods 5の比較対象",
      highlight: "left",
      highlightNote:
        "Appleの比較試験での公表値。実際の聞こえ方を保証するものではありません。",
      direction: "higher-is-better",
    },
    {
      label: "防塵・耐汗耐水性能",
      left: "IP57",
      right: "IP54",
      highlight: "left",
      highlightNote:
        "両方とも水上・水中のスポーツや運動には非対応で、耐性は通常使用で低下することがあります。",
      direction: "higher-is-better",
    },
    {
      label: "充電ケース",
      left: "USB-C充電ケース",
      right:
        "ワイヤレス充電ケース。Qi／Apple Watch充電と「探す」用スピーカーに対応",
      highlight: null,
    },
    {
      label: "ANC有効時のイヤホン単体の最大再生時間",
      left: "最大4時間",
      right: "最大4時間",
      highlight: null,
      highlightNote: "Apple公表の最大値。設定、環境、使い方などで変わります。",
    },
    {
      label: "ANC有効時のケース併用の最大再生時間",
      left: "最大20時間",
      right: "最大20時間",
      highlight: null,
      highlightNote: "Apple公表の最大値。設定、環境、使い方などで変わります。",
    },
    {
      label: "イヤホン本体（左右各）のサイズ・重量",
      left: "30.2×18.3×18.1mm・4.3g",
      right: "30.2×18.3×18.1mm・4.3g",
      highlight: null,
    },
  ],
  faqEntries: [
    {
      question: "AirPods 5のノイズキャンセリングはどのくらい強いですか？",
      answer:
        "Appleのモデル比較ページは、AirPods 5についてANC搭載AirPods 4との比較で最大1.5倍と案内しています。これはAppleが公表する比較試験の結果で、騒音の種類や装着状態などによって、実際に感じる差は変わります。",
    },
    {
      question: "ANCを使ったときの電池持ちはAirPods 5のほうが長いですか？",
      answer:
        "Appleの仕様では、ANC有効時のイヤホン単体はどちらも最大4時間、ケースを使った合計は最大20時間です。AirPods 5のワイヤレス充電ケース版は別モデルで、Appleの比較表ではANC有効時に最大22時間とされています。ここで扱うAirPods 5はUSB-C充電ケース版です。",
    },
    {
      question: "ケースの使い勝手にはどんな違いがありますか？",
      answer:
        "AirPods 5のUSB-C充電ケース版はUSB-C経由で充電します。ANC搭載AirPods 4のケースはQiまたはApple Watch充電器でのワイヤレス充電に対応し、「探す」機能用のスピーカーを搭載しています。充電方法やケースを探す機能を使うかで選べます。",
    },
    {
      question: "IP57とIP54なら、雨や水中でも使えますか？",
      answer:
        "IP57とIP54はAppleが示す防塵・耐汗耐水等級で、どちらも水上・水中のスポーツや運動には対応しません。耐性は永続せず、通常の使用でも低下する可能性があります。濡れた場合は乾かしてから充電してください。",
    },
    {
      question: "イヤホン本体の大きさや重さに差はありますか？",
      answer:
        "Appleの比較表では、左右それぞれ高さ30.2mm、幅18.3mm、厚さ18.1mm、重量4.3gで共通です。数値が同じでも耳への合い方は人によって異なるため、装着感を優先する場合は店頭などで試着して選んでください。",
    },
  ],
  lead: "AirPods 5とアクティブノイズキャンセリング搭載AirPods 4は、どちらもH2チップとBluetooth 5.3を備え、ANC有効時の再生時間はイヤホン単体で最大4時間、ケース併用で最大20時間です。主な違いはAppleが公表するANC比較結果、防塵・耐汗耐水等級、充電ケースの機能です。この記事のAirPods 5はUSB-C充電ケース版を指します。",
  decisionGuideSteps: [
    "ANCの公表比較結果とIP57等級を重視するなら、AirPods 5を候補にする",
    "Qi／Apple Watch充電や「探す」用スピーカー付きケースが必要なら、ANC搭載AirPods 4を候補にする",
    "ANC有効時の公称再生時間は同じなので、電池持ちだけでは決めにくい",
    "耳への合い方は仕様値から判断できないため、装着感を重視する場合は試着する",
  ],
  socialProofQuery: "AirPods 5 AirPods 4 ANC 使用感 比較 X YouTube Reddit",
  socialProofCheckedAt: "2026-09-30",
  socialProofHasPosts: false,
  socialProofBestMatch: "model",
  officialProse: [
    {
      heading: "AirPods 5（USB-C充電ケース）",
      items: [
        "Appleのモデル比較ページでは、ANC搭載AirPods 4との比較で最大1.5倍のアクティブノイズキャンセリングと案内されています。比較はApple公表の試験結果として扱い、実環境での効果を断定しません。",
        "防塵・耐汗耐水性能はIP57。USB-C充電ケースを使用し、ANC有効時の最大再生時間はイヤホン単体4時間、ケース併用20時間です。",
        "イヤホン本体は左右各30.2×18.3×18.1mm、4.3g。ワイヤレス充電ケース付きAirPods 5とはケース機能と電池仕様が異なります。",
      ],
    },
    {
      heading: "アクティブノイズキャンセリング搭載AirPods 4",
      items: [
        "Appleの技術仕様では防塵・耐汗耐水性能をIP54としています。ANC有効時の最大再生時間はイヤホン単体4時間、ケース併用20時間です。",
        "付属ケースはQi／Apple Watch充電器でのワイヤレス充電に対応し、「探す」機能用のスピーカーを備えます。",
        "イヤホン本体は左右各30.2×18.3×18.1mm、4.3g。AirPods 5と同じ寸法・重量です。",
      ],
    },
  ],
  sourceLinks: [
    {
      label: "Apple AirPods 5 仕様",
      url: "https://www.apple.com/jp/airpods-5/specs/",
      date: "2026-09-30",
    },
    {
      label: "Apple AirPods モデル比較",
      url: "https://www.apple.com/jp/airpods/compare/",
      date: "2026-09-30",
    },
    {
      label: "Apple アクティブノイズキャンセリング搭載AirPods 4 技術仕様",
      url: "https://support.apple.com/ja-jp/121204",
      date: "2026-09-30",
    },
  ],
  disclaimer:
    "比較は2026-09-30に確認したApple公式仕様に基づきます。ANCの公表値はAppleの試験結果で、実環境での感じ方を保証するものではありません。価格・在庫・販売条件は購入時点の販売ページでご確認ください。",
};
