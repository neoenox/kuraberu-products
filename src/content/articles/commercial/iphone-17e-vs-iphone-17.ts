import type { CommercialArticleSeed } from "./types";

export const iphone17eVsIphone17Seed: CommercialArticleSeed = {
  id: "iphone-17e-vs-iphone-17",
  draft: false,
  publishedAt: "2026-10-10",
  modifiedAt: "2026-10-10",
  productInfoCheckedAt: "2026-10-10",
  handoffManifestId: "iphone-17e-vs-iphone-17-2026-10-10",
  purchaseLinksCheckedAt: "2026-10-10",
  purchaseLinkStatus: "verified",
  amazonLinkStatus: "verified",
  rakutenLinkStatus: "unverified",
  title:
    "iPhone 17eとiPhone 17の違いを比較｜価格・画面・カメラ・バッテリー・充電",
  headline: "iPhone 17eとiPhone 17の違い",
  description:
    "iPhone 17eとiPhone 17を、Appleの公式仕様とAmazonの商品ページで比較。画面サイズとリフレッシュレート、カメラ構成、バッテリー、MagSafe充電、重さ、価格の違いを整理します。",
  category: "スマートフォン",
  tags: ["iPhone", "スマートフォン", "iPhone 17e", "iPhone 17"],
  audiences: [
    "価格を抑えたiPhone 17eと、標準モデルのiPhone 17で迷っている人",
    "iPhone 17eとiPhone 17の違いをApple公式の仕様で確認したい人",
  ],
  uses: [
    "通話・連絡・写真撮影・動画視聴など、毎日の基本的な使い方",
    "画面の滑らかさやカメラの画角など、日常での見た目や撮影のしやすさ",
    "価格を抑えて、最新世代のチップ（A19）のiPhoneを選ぶ",
  ],
  summary:
    "価格を抑えて、A19チップのiPhoneを使いたいならiPhone 17e（256GBで124,800円）、120Hzの滑らかな画面、超広角カメラ、バッテリーの余裕、速いMagSafe充電を重視するならiPhone 17（256GBで159,800円）が候補です。",
  lead: "iPhone 17eとiPhone 17は、A19チップ、256GBと512GBのストレージ、Ceramic Shield 2の前面、IP68等級の耐水性能、48MPのFusionメインカメラ、デュアルeSIM（物理SIM非対応）、USB-C、Action Button、MagSafeとQi2のワイヤレス充電が共通です。違いは、画面（6.1インチと6.3インチ、最大120HzのProMotionの記載の有無、ピーク輝度）、背面カメラ（メイン1眼と、メイン＋超広角）、フロントカメラ（12MPと18MPのセンターフレーム）、ビデオ再生時間（最大26時間と最大30時間）、MagSafeの最大出力（15Wと25W）、Wi-FiとBluetoothの規格、質量（169gと177g）、色の数、価格（256GBで124,800円と159,800円）です。この記事では、256GBのモデルで比べています。",
  leftProduct: "Apple iPhone 17e 256GB ソフトピンク",
  rightProduct: "Apple iPhone 17 256GB セージ",
  leftPoint:
    "A19チップのiPhoneを、35,000円低い価格で使いたい人向け。画面の滑らかさや超広角カメラにこだわらない人に向く",
  rightPoint:
    "120Hzの滑らかな画面、超広角カメラ、バッテリーの余裕、速いMagSafe充電を重視し、価格が高くなってもよい人向け",
  leftAmazonUrl: "https://www.amazon.co.jp/dp/B0GQVYHYFK",
  rightAmazonUrl: "https://www.amazon.co.jp/dp/B0FQG97CDB",
  leftRakutenUrl: null,
  rightRakutenUrl: null,
  leftImage: "/products/iphone-17e-256gb.jpg",
  rightImage: "/products/iphone-17-256gb.jpg",
  officialSources: [
    {
      label: "Apple iPhone 17e 技術仕様",
      url: "https://www.apple.com/jp/iphone-17e/specs/",
    },
    {
      label: "Apple iPhone 17 技術仕様",
      url: "https://www.apple.com/jp/iphone-17/specs/",
    },
  ],
  verifiedRows: [
    {
      label: "Appleオンラインストアの価格（256GB・税込・2026-10-10確認）",
      left: "124,800円",
      right: "159,800円",
      highlight: "left",
      highlightNote:
        "どちらも色によらず同額の表示。価格は購入時点で変わる場合があります",
      direction: "lower-is-better",
    },
    {
      label: "ディスプレイのサイズ",
      left: "6.1インチ（2,532×1,170ピクセル・460ppi）",
      right: "6.3インチ（2,622×1,206ピクセル・460ppi）",
      highlight: null,
    },
    {
      label: "リフレッシュレート",
      left: "記載が見当たらない",
      right: "最大120Hz（ProMotion）",
      highlight: "right",
      highlightNote:
        "17eの仕様ページにProMotionの記載は見当たらない。非対応とは断定していない",
    },
    {
      label: "ピーク輝度（HDR／屋外）",
      left: "1,200ニト／2,000ニト",
      right: "1,600ニト／3,000ニト",
      highlight: "right",
      direction: "higher-is-better",
    },
    {
      label: "チップ",
      left: "A19（6コアCPU・4コアGPU・16コアNeural Engine）",
      right: "A19（6コアCPU・5コアGPU・16コアNeural Engine）",
      highlight: null,
      highlightNote: "GPUのコア数が異なる",
    },
    {
      label: "背面カメラ",
      left: "48MP Fusionメイン（1眼）",
      right: "48MP Fusionメイン＋48MP Fusion超広角（120°）",
      highlight: "right",
    },
    {
      label: "フロントカメラ",
      left: "12MP TrueDepth",
      right: "18MPセンターフレーム",
      highlight: "right",
    },
    {
      label: "ビデオ再生時間",
      left: "最大26時間",
      right: "最大30時間",
      highlight: "right",
      highlightNote: "使用条件による目安",
      direction: "higher-is-better",
    },
    {
      label: "ビデオのストリーミング再生時間",
      left: "最大21時間",
      right: "最大27時間",
      highlight: "right",
      highlightNote: "使用条件による目安",
      direction: "higher-is-better",
    },
    {
      label: "MagSafe充電の最大出力",
      left: "最大15W",
      right: "最大25W",
      highlight: "right",
      direction: "higher-is-better",
    },
    {
      label: "Wi-Fi・Bluetooth",
      left: "Wi-Fi 6・Bluetooth 5.3",
      right: "Wi-Fi 7・Bluetooth 6",
      highlight: "right",
    },
    {
      label: "質量",
      left: "169g",
      right: "177g",
      highlight: "left",
      highlightNote: "質量はApple公式の値",
      direction: "lower-is-better",
    },
    {
      label: "サイズ（幅×高さ×厚さ）",
      left: "71.5×146.7×7.80mm",
      right: "71.5×149.6×7.95mm",
      highlight: null,
    },
    {
      label: "色",
      left: "ブラック・ホワイト・ソフトピンク",
      right: "ブラック・ホワイト・ミストブルー・セージ・ラベンダー",
      highlight: null,
    },
    {
      label: "耐水性能",
      left: "IP68等級（最大水深6メートルで最大30分間）",
      right: "IP68等級（最大水深6メートルで最大30分間）",
      highlight: null,
    },
    {
      label: "ストレージ",
      left: "256GB／512GB",
      right: "256GB／512GB",
      highlight: null,
    },
  ],
  faqEntries: [
    {
      question: "iPhone 17eとiPhone 17の大きな違いは何ですか？",
      answer:
        "価格、画面、カメラ構成、バッテリー、MagSafe充電の出力です。Appleオンラインストアの256GBの価格は、17eが124,800円、17が159,800円で、差は35,000円です。17は、6.3インチで最大120HzのProMotion、超広角カメラ、18MPのフロントカメラ、ビデオ再生最大30時間、最大25WのMagSafe充電の記載があります。",
    },
    {
      question: "どちらもチップは同じですか？",
      answer:
        "どちらもA19チップで、CPUは6コア、Neural Engineは16コアです。GPUは、17eが4コア、17が5コアと記載されています。",
    },
    {
      question: "iPhone 17eに超広角カメラはありますか？",
      answer:
        "Appleの仕様ページでは、17eの背面カメラは48MPのFusionメインカメラ（1眼）の構成で、超広角カメラの記載は見当たりませんでした。17は、48MPのFusionメインカメラと48MPのFusion超広角カメラ（120°）の2眼構成です。",
    },
    {
      question: "iPhone 17eは120Hzの画面に対応していますか？",
      answer:
        "17eの仕様ページに、ProMotionや最大120Hzの記載は見当たりませんでした。17は最大120HzのProMotionと記載されています。ただし、記載が見当たらないことは、非対応であることを示すものではありません。購入前に、Appleの公式ページで確認してください。",
    },
    {
      question: "どの容量・色で比較していますか？",
      answer:
        "どちらも256GBのSIMフリーモデルで比べています。Amazonの商品ページは、17eがソフトピンク（B0GQVYHYFK）、17がセージ（B0FQG97CDB）の色の表示です。Appleオンラインストアの256GBの価格は、色によらず同額と表示されていました。512GBと、ほかの色は比較していません。",
    },
    {
      question: "SIMカードは使えますか？",
      answer:
        "どちらも、物理SIMカードには非対応で、デュアルeSIM（同時にアクティブなeSIMは2つ）と記載されています。",
    },
  ],
  decisionGuideSteps: [
    "予算を確認し、124,800円の17eで足りるか、159,800円の17を出せるかを決める",
    "画面の滑らかさ（最大120Hz）や大きさ（6.3インチ）を重視する場合は、17を確認する",
    "超広角カメラや18MPのフロントカメラを使いたい場合は、17を選ぶ",
    "軽さ（169g）と価格を重視し、メインカメラ1眼で足りる場合は、17eを確認する",
  ],
  socialProofQuery: "iPhone 17e iPhone 17 違い 使用感 X YouTube",
  socialProofCheckedAt: "2026-10-10",
  socialProofHasPosts: true,
  socialProofBestMatch: "model",
  embeds: [
    {
      provider: "youtube",
      url: "https://www.youtube.com/watch?v=AN3eWFg2hRM",
      title: "今買うならiPhone 17か17eどっち？買い方も含め考察",
      match: "model",
      purpose: "iPhone 17と17eの比較検討に関する使用・購入の感想",
      author: "Appleが大好きなんだよ",
      summary:
        "iPhone 17と17eの性能・機能の比較と価格・買い方の考察。楽天購入の記載あり。個人の使用感で、比較の根拠ではない。",
      autoload: true,
      autoDisplay: true,
      compact: true,
    },
    {
      provider: "youtube",
      url: "https://www.youtube.com/watch?v=ZM6Hfemszq8",
      title:
        "【結論】iPhone 17eを17・16eと使い比べて感じた、選ぶメリット・デメリット",
      match: "model",
      purpose: "17eをメインスマホとして使い込んだ上での17・16e比較の感想",
      author: "こにたく | konitaku",
      summary:
        "17eを約1か月使い込んだ上での17・16eとの比較。個人の使用感で、比較の根拠ではない。",
      autoload: true,
      autoDisplay: true,
      compact: true,
    },
  ],
  officialProse: [
    {
      heading: "iPhone 17e",
      items: [
        "A19チップ（6コアCPU・4コアGPU）、6.1インチの有機ELディスプレイ（ピーク輝度1,200ニト）、48MPのFusionメインカメラを備えています。",
        "ビデオ再生は最大26時間。MagSafe・Qi2の充電は最大15Wで、質量は169gです。",
        "Appleオンラインストアでは、256GBが124,800円（税込）です。",
      ],
    },
    {
      heading: "iPhone 17",
      items: [
        "A19チップ（6コアCPU・5コアGPU）、6.3インチの最大120Hz ProMotionディスプレイ（ピーク輝度1,600ニト）、48MPのFusionメインカメラと48MPの超広角カメラを備えています。",
        "ビデオ再生は最大30時間。MagSafe・Qi2の充電は最大25Wで、質量は177gです。",
        "Appleオンラインストアでは、256GBが159,800円（税込）です。",
      ],
    },
  ],
  sourceLinks: [
    {
      label: "Apple iPhone 17e 技術仕様",
      url: "https://www.apple.com/jp/iphone-17e/specs/",
      date: "2026-10-10",
    },
    {
      label: "Apple iPhone 17 技術仕様",
      url: "https://www.apple.com/jp/iphone-17/specs/",
      date: "2026-10-10",
    },
    {
      label: "Apple iPhone 17e 購入ページ（価格）",
      url: "https://www.apple.com/jp/shop/buy-iphone/iphone-17e",
      date: "2026-10-10",
    },
    {
      label: "Apple iPhone 17 購入ページ（価格）",
      url: "https://www.apple.com/jp/shop/buy-iphone/iphone-17",
      date: "2026-10-10",
    },
    {
      label: "YouTube iPhone 17と17eの比較検討",
      url: "https://www.youtube.com/watch?v=AN3eWFg2hRM",
      date: "2026-10-10",
    },
    {
      label: "YouTube iPhone 17eの使い比べ",
      url: "https://www.youtube.com/watch?v=ZM6Hfemszq8",
      date: "2026-10-10",
    },
  ],
  disclaimer:
    "仕様と価格は2026年10月10日にApple公式サイトで確認しました。価格は256GBのSIMフリーモデルの表示です。商品画像はAmazonの商品ページの画像を使用しています。SNSの感想は個人の使用感で、比較の根拠ではありません。この記事にはアフィリエイトリンクが含まれる場合があります。",
};
