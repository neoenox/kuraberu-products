import type { CommercialArticleSeed } from "./types";

export const kindleVsKindlePaperwhiteSeed: CommercialArticleSeed = {
  id: "kindle-vs-kindle-paperwhite",
  draft: false,
  publishedAt: "2026-10-09",
  modifiedAt: "2026-10-09",
  productInfoCheckedAt: "2026-10-09",
  handoffManifestId: "kindle-vs-kindle-paperwhite-2026-10-09",
  purchaseLinksCheckedAt: "2026-10-09",
  purchaseLinkStatus: "verified",
  amazonLinkStatus: "verified",
  rakutenLinkStatus: "unverified",
  title:
    "KindleとKindle Paperwhiteの違いを比較｜画面サイズ・防水・バッテリー・価格",
  headline: "KindleとKindle Paperwhiteの違い",
  description:
    "最新モデルのKindle（16GB）とKindle Paperwhite（16GB）をAmazonの商品ページで比較。画面サイズ、質量、防水、色調調節ライト、バッテリー持続時間、価格が異なり、容量とディスプレイの解像度は共通です。",
  category: "電子書籍リーダー",
  tags: ["Kindle", "電子書籍リーダー", "Paperwhite"],
  audiences: [
    "Kindleの入門機と、上位機のPaperwhiteで迷っている人",
    "KindleとKindle Paperwhiteの違いをAmazonの仕様で確認したい人",
  ],
  uses: [
    "通勤・通学で持ち歩く、軽い電子書籍リーダー",
    "お風呂や寝る前の読書など、防水や色調調節ライトが気になる使い方",
    "小説・ビジネス書などの文字中心の読書",
  ],
  summary:
    "価格を抑え、140gの軽さと6インチの小さな本体を重視するならKindle、7インチの画面と最大12週間のバッテリー、IPX8等級の防水、色調調節ライトを重視するなら、価格が10,000円高くなるKindle Paperwhiteが候補です。",
  lead: "最新モデルのKindle（16GB）とKindle Paperwhite（16GB）は、フロントライト内蔵、解像度300ppi、16GB（使用可能なストレージ10.8GB）、Wi-Fi 2.4GHz・5.0GHz、USB-C充電が共通です。違いは、画面サイズ（6インチと7インチ）、本体サイズ・質量（152.8×108×6.9mm・140gと174.7×126.8×6.8mm・204g）、防水（Kindle Paperwhiteのみ）、色調調節ライト（Kindle Paperwhiteのみ）、バッテリー持続時間（最大6週間と最大12週間）、Amazonの表示価格（29,980円と39,980円）です。2026年10月9日時点で、Kindleは在庫あり、Kindle Paperwhiteは発売予定日が2026年11月11日で予約受付中です。",
  leftProduct: "Kindle 16GB 最新モデル（ウベパープル）",
  rightProduct: "Kindle Paperwhite 16GB 最新モデル（グラファイト）",
  leftPoint:
    "価格を抑え、140gの軽さと6インチの小さな本体を重視し、防水や色調調節ライトは必須ではない人向け",
  rightPoint:
    "7インチの画面、最大12週間のバッテリー、IPX8等級の防水、色調調節ライトを重視し、価格が高くなってもよい人向け",
  leftAmazonUrl: "https://www.amazon.co.jp/dp/B0G4SMGD8C",
  rightAmazonUrl: "https://www.amazon.co.jp/dp/B0GV5VHTL6",
  leftRakutenUrl: null,
  rightRakutenUrl: null,
  leftImage: "/products/kindle-16gb-2026.jpg",
  rightImage: "/products/kindle-paperwhite-2026.jpg",
  officialSources: [
    {
      label: "Amazon Kindle 16GB 最新モデル 商品ページ",
      url: "https://www.amazon.co.jp/dp/B0G4SMGD8C",
    },
    {
      label: "Amazon Kindle Paperwhite 16GB 最新モデル 商品ページ",
      url: "https://www.amazon.co.jp/dp/B0GV5VHTL6",
    },
  ],
  verifiedRows: [
    {
      label: "Amazon表示価格（税込・2026-10-09確認）",
      left: "29,980円",
      right: "39,980円（予約受付中）",
      highlight: "left",
      highlightNote:
        "価格はAmazonの商品ページの表示。セールや予約時の価格は変動するため購入時点で確認",
      direction: "lower-is-better",
    },
    {
      label: "ディスプレイ",
      left: "6インチ Amazonディスプレイ（フロントライト内蔵）",
      right: "7インチ Amazon Paperwhiteディスプレイ（フロントライト内蔵）",
      highlight: null,
    },
    {
      label: "解像度",
      left: "300ppi",
      right: "300ppi",
      highlight: null,
    },
    {
      label: "本体サイズ",
      left: "152.8×108×6.9mm",
      right: "174.7×126.8×6.8mm",
      highlight: null,
    },
    {
      label: "質量",
      left: "140g",
      right: "204g",
      highlight: "left",
      highlightNote: "質量は仕様や製造過程によって多少異なる場合があります",
      direction: "lower-is-better",
    },
    {
      label: "バッテリー持続時間",
      left: "最大6週間",
      right: "最大12週間",
      highlight: "right",
      highlightNote: "どちらも使用条件による目安",
      direction: "higher-is-better",
    },
    {
      label: "防水",
      left: "Amazonの比較表では対応の表示なし",
      right: "IPX8等級",
      highlight: "right",
      highlightNote:
        "Amazonの比較表で、防水機能に対応する表示があるのはKindle Paperwhiteのみ",
    },
    {
      label: "色調調節ライト",
      left: "Amazonの比較表では対応の表示なし",
      right: "対応",
      highlight: "right",
    },
    {
      label: "容量（使用可能なストレージ）",
      left: "16GB（10.8GB）",
      right: "16GB（10.8GB）",
      highlight: null,
    },
    {
      label: "充電",
      left: "USB-C・20W電源アダプターで約2時間",
      right: "USB-C・20W電源アダプターで約2.5時間",
      highlight: null,
    },
    {
      label: "Wi-Fi",
      left: "2.4GHz・5.0GHz",
      right: "2.4GHz・5.0GHz",
      highlight: null,
    },
    {
      label: "発売状況（2026-10-09確認）",
      left: "在庫あり",
      right: "2026年11月11日発売予定（予約受付中）",
      highlight: null,
    },
  ],
  faqEntries: [
    {
      question: "KindleとKindle Paperwhiteの大きな違いは何ですか？",
      answer:
        "画面サイズと本体の大きさ、防水、色調調節ライト、バッテリー、価格です。Kindleは6インチ・140g・最大6週間・29,980円、Kindle Paperwhiteは7インチ・204g・最大12週間・39,980円で、防水と色調調節ライトに対応します。容量（16GB）と解像度（300ppi）は共通です。",
    },
    {
      question: "防水に対応しているのはどちらですか？",
      answer:
        "Amazonの商品ページでは、Kindle PaperwhiteがIPX8等級の防水に対応すると記載されています。Amazonの比較表では、Kindleの防水機能の欄に対応の表示はありません。お風呂で使いたい場合は、Kindle Paperwhiteの仕様を確認してください。",
    },
    {
      question: "バッテリーの持ちはどれくらい違いますか？",
      answer:
        "Amazonの商品ページでは、Kindleが最大6週間、Kindle Paperwhiteが最大12週間と記載されています。持続時間は使用条件による目安で、実際の持ちは明るさや使い方によって変わります。",
    },
    {
      question: "価格はどれくらい違いますか？",
      answer:
        "2026年10月9日時点のAmazonの表示価格（税込）は、Kindle 16GBが29,980円、Kindle Paperwhite 16GBが39,980円で、差は10,000円です。Kindle Paperwhiteは予約受付中の表示のため、価格は購入時点でご確認ください。",
    },
    {
      question: "いつ買えますか？",
      answer:
        "2026年10月9日時点で、KindleはAmazonで在庫ありと表示されています。Kindle Paperwhiteは発売予定日が2026年11月11日と表示され、予約受付中です。発売日や配送予定は変更される場合があります。",
    },
    {
      question: "容量は同じですか？",
      answer:
        "この記事で比較している16GBモデルは、どちらも16GB（使用可能なストレージ10.8GB）です。Amazonには32GBのKindleも掲載されていますが、この記事では16GB同士を比較しています。",
    },
  ],
  decisionGuideSteps: [
    "予算を確認し、29,980円のKindleで足りるか、10,000円高い39,980円のKindle Paperwhiteを出せるかを決める",
    "お風呂や水まわりで使うなら、防水に対応するKindle Paperwhiteを候補にする",
    "持ち歩きやすさ（140gの軽さ）を重視するならKindle、画面の大きさ（7インチ）を重視するならKindle Paperwhiteを選ぶ",
    "充電の頻度を減らしたい場合は、最大12週間のKindle Paperwhiteを確認する",
  ],
  socialProofQuery: "Kindle Kindle Paperwhite 2026 違い 使用感 X YouTube",
  socialProofCheckedAt: "2026-10-09",
  socialProofHasPosts: false,
  socialProofBestMatch: "model",
  officialProse: [
    {
      heading: "Kindle 16GB 最新モデル",
      items: [
        "6インチAmazonディスプレイ（解像度300ppi・フロントライト内蔵）で、本体は152.8×108×6.9mm・140gです。",
        "容量は16GB（使用可能なストレージ10.8GB）、バッテリーは最大6週間、USB-C充電で約2時間です。",
        "Amazonの表示価格は29,980円（税込）で、2026年10月9日時点で在庫ありと表示されています。",
      ],
    },
    {
      heading: "Kindle Paperwhite 16GB 最新モデル",
      items: [
        "7インチAmazon Paperwhiteディスプレイ（解像度300ppi・フロントライト内蔵）で、色調調節ライトとIPX8等級の防水に対応します。",
        "容量は16GB（使用可能なストレージ10.8GB）、バッテリーは最大12週間、USB-C充電で約2.5時間です。",
        "本体は174.7×126.8×6.8mm・204g。Amazonの表示価格は39,980円（税込）で、発売予定日は2026年11月11日です。",
      ],
    },
  ],
  sourceLinks: [
    {
      label: "Amazon Kindle 16GB 最新モデル 商品ページ",
      url: "https://www.amazon.co.jp/dp/B0G4SMGD8C",
      date: "2026-10-09",
    },
    {
      label: "Amazon Kindle Paperwhite 16GB 最新モデル 商品ページ",
      url: "https://www.amazon.co.jp/dp/B0GV5VHTL6",
      date: "2026-10-09",
    },
  ],
  disclaimer:
    "仕様と価格は2026年10月9日にAmazon.co.jpの商品ページで確認しました。Kindle Paperwhiteは予約受付中で、発売予定日・価格・配送予定は変更される場合があります。商品画像はAmazonの商品ページの画像を使用しています（Kindleはウベパープルの画像）。この記事にはアフィリエイトリンクが含まれる場合があります。",
};
