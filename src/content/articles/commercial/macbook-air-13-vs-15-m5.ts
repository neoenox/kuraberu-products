import type { CommercialArticleSeed } from "./types";

export const macbookAir13Vs15M5Seed: CommercialArticleSeed = {
  id: "macbook-air-13-vs-15-m5",
  draft: false,
  publishedAt: "2026-10-10",
  modifiedAt: "2026-10-10",
  productInfoCheckedAt: "2026-10-10",
  handoffManifestId: "macbook-air-13-vs-15-m5-2026-10-10",
  purchaseLinksCheckedAt: "2026-10-10",
  purchaseLinkStatus: "verified",
  amazonLinkStatus: "verified",
  rakutenLinkStatus: "unverified",
  title:
    "MacBook Air 13インチと15インチ（M5）の違いを比較｜価格・画面・バッテリー・スピーカー・重さ",
  headline: "MacBook Air 13インチと15インチ（M5）の違い",
  description:
    "MacBook Air 13インチと15インチ（M5チップ搭載）を、Appleの公式仕様とAmazonの商品ページで比較。画面サイズ、バッテリー、スピーカー、重さ、価格の違いを、16GBメモリ・512GBの構成で整理します。",
  category: "ノートパソコン",
  tags: ["MacBook Air", "ノートパソコン", "M5", "13インチ", "15インチ"],
  audiences: [
    "MacBook Airの13インチと15インチのどちらにするか迷っている人",
    "画面の大きさと、持ち運びやすさ・価格の違いをApple公式の仕様で確認したい人",
  ],
  uses: [
    "文章作成・表計算・ブラウジングなどの普段使い",
    "写真や動画の編集など、画面を広く使いたい作業",
    "カフェや出先への持ち運び",
  ],
  summary:
    "持ち運びやすさと価格を重視するなら13インチ（16GB・512GBで224,800円から）、広い画面、大きなバッテリー、6スピーカーを重視するなら15インチ（16GB・512GBで264,800円から）が候補です。",
  lead: "MacBook Airの13インチと15インチは、Apple M5チップ（10コアCPU）、16コアNeural Engine、500ニトの輝度、Wi-Fi 7、Bluetooth 6、Thunderbolt 4（USB-C）ポート2つ、MagSafe 3、12MPセンターフレームカメラ、Touch ID、最大18時間のビデオストリーミングが共通です。違いは、画面（13.6インチと15.3インチ）、バッテリー容量（53.8Whと66.5Wh）、スピーカー（4スピーカーと6スピーカー）、重さ（1.23kgと1.51kg）、本体サイズ、価格（Appleオンラインストアで224,800円からと264,800円から）です。この記事では、どちらもメモリ16GB・SSD 512GBの構成で比べています。GPUは、13インチが8コア、15インチが10コアの構成です。",
  leftProduct:
    "Apple MacBook Air 13インチ（M5・10コアCPU/8コアGPU・16GB・512GB）ミッドナイト",
  rightProduct:
    "Apple MacBook Air 15インチ（M5・10コアCPU/10コアGPU・16GB・512GB）ミッドナイト",
  leftPoint:
    "持ち運びやすさと価格を重視し、13.6インチの画面で足りる人向け。1.23kgで、40,000円低い価格から選べる",
  rightPoint:
    "広い画面（15.3インチ）、大きなバッテリー、6スピーカーを重視し、重さと価格が上がってもよい人向け",
  leftAmazonUrl: "https://www.amazon.co.jp/dp/B0GR1T11D6",
  rightAmazonUrl: "https://www.amazon.co.jp/dp/B0GR1PRMDS",
  leftRakutenUrl: null,
  rightRakutenUrl: null,
  leftImage: "/products/macbook-air-13-m5.jpg",
  rightImage: "/products/macbook-air-15-m5.jpg",
  officialSources: [
    {
      label: "Apple MacBook Air 技術仕様",
      url: "https://www.apple.com/jp/macbook-air/specs/",
    },
    {
      label: "Apple MacBook Air 購入ページ（13インチ）",
      url: "https://www.apple.com/jp/shop/buy-mac/macbook-air/13-インチ",
    },
    {
      label: "Apple MacBook Air 購入ページ（15インチ）",
      url: "https://www.apple.com/jp/shop/buy-mac/macbook-air/15-インチ",
    },
  ],
  verifiedRows: [
    {
      label:
        "Appleオンラインストアの価格（16GB・512GBの構成・税込・2026-10-10確認）",
      left: "224,800円から",
      right: "264,800円から",
      highlight: "left",
      highlightNote:
        "「から」の表示。13インチは8コアGPU、15インチは10コアGPUの構成の価格。色によらず同額の表示",
      direction: "lower-is-better",
    },
    {
      label: "ディスプレイのサイズ",
      left: "13.6インチ（2,560×1,664ピクセル・224ppi）",
      right: "15.3インチ（2,880×1,864ピクセル・224ppi）",
      highlight: null,
    },
    {
      label: "輝度",
      left: "500ニト",
      right: "500ニト",
      highlight: null,
    },
    {
      label: "チップ",
      left: "Apple M5（10コアCPU・8コアGPU）",
      right: "Apple M5（10コアCPU・10コアGPU）",
      highlight: null,
      highlightNote:
        "GPUのコア数は、この記事で比べる構成の違い。13インチも、10コアGPUの構成を選べます",
    },
    {
      label: "バッテリー容量",
      left: "53.8Wh",
      right: "66.5Wh",
      highlight: "right",
      direction: "higher-is-better",
    },
    {
      label: "ビデオストリーミング・ワイヤレスインターネット",
      left: "最大18時間・最大15時間",
      right: "最大18時間・最大15時間",
      highlight: null,
      highlightNote: "使用条件による目安",
    },
    {
      label: "スピーカー",
      left: "4スピーカーサウンドシステム",
      right:
        "フォースキャンセリングウーファーを備えた6スピーカーサウンドシステム",
      highlight: "right",
    },
    {
      label: "質量",
      left: "1.23kg",
      right: "1.51kg",
      highlight: "left",
      highlightNote: "質量はApple公式の値。構成によって異なる場合があります",
      direction: "lower-is-better",
    },
    {
      label: "サイズ（高さ×幅×奥行き）",
      left: "1.13×30.41×21.5cm",
      right: "1.15×34.04×23.76cm",
      highlight: null,
    },
    {
      label: "ポート",
      left: "Thunderbolt 4（USB-C）×2、MagSafe 3、3.5mmヘッドフォンジャック",
      right: "Thunderbolt 4（USB-C）×2、MagSafe 3、3.5mmヘッドフォンジャック",
      highlight: null,
    },
    {
      label: "ワイヤレス",
      left: "Wi-Fi 7・Bluetooth 6",
      right: "Wi-Fi 7・Bluetooth 6",
      highlight: null,
    },
    {
      label: "カメラ",
      left: "12MPセンターフレームカメラ",
      right: "12MPセンターフレームカメラ",
      highlight: null,
    },
    {
      label: "色",
      left: "スカイブルー・シルバー・スターライト・ミッドナイト",
      right: "スカイブルー・シルバー・スターライト・ミッドナイト",
      highlight: null,
    },
  ],
  faqEntries: [
    {
      question: "13インチと15インチの大きな違いは何ですか？",
      answer:
        "画面サイズ、バッテリー容量、スピーカー、重さ、価格です。Appleオンラインストアの16GB・512GBの構成の価格は、13インチが224,800円から、15インチが264,800円からで、差は40,000円です。15インチは、15.3インチの画面、66.5Whのバッテリー、6スピーカーの構成で、1.51kgです。13インチは13.6インチ、53.8Wh、4スピーカーで、1.23kgです。",
    },
    {
      question: "バッテリーの持ちはどれくらい違いますか？",
      answer:
        "Appleの仕様ページでは、どちらも最大18時間のビデオストリーミングと最大15時間のワイヤレスインターネットと記載されています。バッテリー容量は、13インチが53.8Wh、15インチが66.5Whです。駆動時間は使用条件による目安で、実際の持ちは使い方によって変わります。",
    },
    {
      question: "チップの性能は同じですか？",
      answer:
        "どちらもApple M5チップで、10コアCPUと16コアNeural Engineは共通です。この記事で比べている構成のGPUは、13インチが8コア、15インチが10コアです。13インチも、10コアGPUの構成（Appleオンラインストアで242,800円から）を選べます。",
    },
    {
      question: "どの構成で比較していますか？",
      answer:
        "どちらもメモリ16GB・SSD 512GB・ミッドナイトの構成で比べています。Amazonの商品ページは、13インチがB0GR1T11D6（10コアCPU/8コアGPU）、15インチがB0GR1PRMDS（10コアCPU/10コアGPU）です。24GBメモリ、1TB以上のSSD、ほかの色は比較していません。",
    },
    {
      question: "ポートや無線の違いはありますか？",
      answer:
        "Appleの仕様ページでは、どちらも2つのThunderbolt 4（USB-C）ポート、MagSafe 3、3.5mmヘッドフォンジャック、Wi-Fi 7、Bluetooth 6で、違いは記載されていません。",
    },
    {
      question: "価格は購入先によって変わりますか？",
      answer:
        "Appleオンラインストアの価格は「から」の表示で、構成によって変わります。Amazonの表示価格は、確認時点で13インチが224,800円（税込）、15インチが262,612円（税込）でした。Amazonの価格は購入時点で変動するため、購入前に商品ページで確認してください。",
    },
  ],
  decisionGuideSteps: [
    "予算を確認し、224,800円からの13インチで足りるか、264,800円からの15インチを出せるかを決める",
    "持ち運ぶことが多い場合は、1.23kgで本体が小さい13インチを確認する",
    "画面を広く使いたい場合や、スピーカーの音を重視する場合は、15.3インチ・6スピーカーの15インチを確認する",
    "メモリ（24GB）やストレージ（1TB以上）を増やしたい場合は、Appleの購入ページで構成と価格を確認する",
  ],
  socialProofQuery: "MacBook Air M5 13インチ 15インチ 違い 使用感 X YouTube",
  socialProofCheckedAt: "2026-10-10",
  socialProofHasPosts: false,
  socialProofBestMatch: "model",
  officialProse: [
    {
      heading: "MacBook Air 13インチ（M5）",
      items: [
        "13.6インチのLiquid Retinaディスプレイ、Apple M5チップ（10コアCPU・8コアGPU）、16GBのユニファイドメモリ、512GBのSSDの構成です。",
        "53.8Whのバッテリー、4スピーカー、質量1.23kg。最大18時間のビデオストリーミングと記載されています。",
        "Appleオンラインストアでは、224,800円（税込）からです。",
      ],
    },
    {
      heading: "MacBook Air 15インチ（M5）",
      items: [
        "15.3インチのLiquid Retinaディスプレイ、Apple M5チップ（10コアCPU・10コアGPU）、16GBのユニファイドメモリ、512GBのSSDの構成です。",
        "66.5Whのバッテリー、フォースキャンセリングウーファーを備えた6スピーカー、質量1.51kg。最大18時間のビデオストリーミングと記載されています。",
        "Appleオンラインストアでは、264,800円（税込）からです。",
      ],
    },
  ],
  sourceLinks: [
    {
      label: "Apple MacBook Air 技術仕様",
      url: "https://www.apple.com/jp/macbook-air/specs/",
      date: "2026-10-10",
    },
    {
      label: "Apple MacBook Air 購入ページ（13インチ）",
      url: "https://www.apple.com/jp/shop/buy-mac/macbook-air/13-インチ",
      date: "2026-10-10",
    },
    {
      label: "Apple MacBook Air 購入ページ（15インチ）",
      url: "https://www.apple.com/jp/shop/buy-mac/macbook-air/15-インチ",
      date: "2026-10-10",
    },
  ],
  disclaimer:
    "仕様と価格は2026年10月10日にApple公式サイトで確認しました。価格は「から」の表示で、メモリ・ストレージ・GPUの構成によって異なります。商品画像はAmazonの商品ページの画像を使用しています。この記事にはアフィリエイトリンクが含まれる場合があります。",
};
