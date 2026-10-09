import type { CommercialArticleSeed } from "./types";

export const appleWatchSeries12VsSe3Seed: CommercialArticleSeed = {
  id: "apple-watch-series-12-vs-se-3",
  draft: false,
  publishedAt: "2026-10-09",
  modifiedAt: "2026-10-09",
  productInfoCheckedAt: "2026-10-09",
  handoffManifestId: "apple-watch-series-12-vs-se-3-2026-10-09",
  purchaseLinksCheckedAt: "2026-10-09",
  purchaseLinkStatus: "verified",
  amazonLinkStatus: "verified",
  rakutenLinkStatus: "unverified",
  title:
    "Apple Watch Series 12とSE 3の違いを比較｜価格・バッテリー・ディスプレイ・健康機能",
  headline: "Apple Watch Series 12とApple Watch SE 3の違い",
  description:
    "Apple Watch Series 12とApple Watch SE 3を、Appleの公式仕様とAmazonの商品ページで比較。チップ、ディスプレイの輝度、バッテリー、充電速度、健康機能のセンサー、価格の違いを整理します。",
  category: "スマートウォッチ",
  tags: ["Apple Watch", "スマートウォッチ", "Series 12", "SE 3"],
  audiences: [
    "Apple Watchの標準モデル（Series 12）と、価格を抑えたSE 3で迷っている人",
    "Apple Watch Series 12とSE 3の違いをApple公式の仕様で確認したい人",
  ],
  uses: [
    "通知の確認・運動の記録・睡眠の記録",
    "心拍やバイタルなど、健康データを詳しく見る使い方",
    "初めてのApple Watchを、価格を抑えて選ぶ",
  ],
  summary:
    "価格を抑えて、通知・運動・睡眠の記録を使いたいならApple Watch SE 3（41,800円から）、バッテリーの余裕、明るいディスプレイ、心電図などの健康機能を重視するならApple Watch Series 12（71,800円から）が候補です。",
  lead: "Apple Watch Series 12とApple Watch SE 3は、64GBの容量、Apple Intelligenceのパワーを活用するSiri、常時表示のRetinaディスプレイ、50メートルの耐水性能、5G RedCapとLTE対応（Cellularモデル）が共通です。違いは、チップ（S11とS10）、ディスプレイのピーク輝度（2,000ニトと1,000ニト）、バッテリー（通常使用で最大24時間と最大18時間）、充電速度（約30分で最大80%と約45分で最大80%）、血中酸素・心電図・水深計などのセンサーと機能の記載、ケースの素材と色、価格（Appleオンラインストアで71,800円からと41,800円から）です。この記事では、小さいサイズ（42mmと40mm）のGPSモデルで比べています。",
  leftProduct:
    "Apple Watch Series 12（GPSモデル）42mmブラックアルミニウムケース・ブラックスポーツバンド S/M",
  rightProduct:
    "Apple Watch SE 3（GPSモデル）40mmスターライトアルミニウムケース・サンドスポーツバンド S/M",
  leftPoint:
    "バッテリーの余裕、2,000ニトの明るいディスプレイ、心電図・血中酸素などの健康機能を重視し、価格が高くなってもよい人向け",
  rightPoint:
    "通知・運動・睡眠の記録を、41,800円からの低い価格で使いたい人向け",
  leftAmazonUrl: "https://www.amazon.co.jp/dp/B0HJB812TG",
  rightAmazonUrl: "https://www.amazon.co.jp/dp/B0HJB1CR9Q",
  leftRakutenUrl: null,
  rightRakutenUrl: null,
  leftImage: "/products/apple-watch-series-12-42mm.jpg",
  rightImage: "/products/apple-watch-se-3-40mm.jpg",
  officialSources: [
    {
      label: "Apple Apple Watch Series 12 技術仕様",
      url: "https://www.apple.com/jp/apple-watch-series-12/specs/",
    },
    {
      label: "Apple Apple Watch SE 3 技術仕様",
      url: "https://www.apple.com/jp/apple-watch-se-3/specs/",
    },
  ],
  verifiedRows: [
    {
      label: "Appleオンラインストアの価格（税込・2026-10-09確認）",
      left: "71,800円から",
      right: "41,800円から",
      highlight: "right",
      highlightNote:
        "「から」の表示で、最小構成（GPSモデル）の価格。ケースの素材・サイズ・Cellularの有無で価格は異なります",
      direction: "lower-is-better",
    },
    {
      label: "チップ",
      left: "S11（64ビットデュアルコア、4コアNeural Engine）",
      right: "S10（64ビットデュアルコア、4コアNeural Engine）",
      highlight: "left",
    },
    {
      label: "ディスプレイ",
      left: "LTPO3広視野角OLED常時表示Retina（1Hzのリフレッシュレート）",
      right: "LTPO OLED常時表示Retina",
      highlight: null,
    },
    {
      label: "ピーク輝度",
      left: "2,000ニト",
      right: "1,000ニト",
      highlight: "left",
      direction: "higher-is-better",
    },
    {
      label: "前面ガラス（アルミニウムケース）",
      left: "Ceramic Shield 2",
      right: "Ion-X前面ガラス",
      highlight: null,
    },
    {
      label: "バッテリー駆動時間（通常使用）",
      left: "最大24時間",
      right: "最大18時間",
      highlight: "left",
      highlightNote: "どちらも使用条件による目安",
      direction: "higher-is-better",
    },
    {
      label: "バッテリー駆動時間（低電力モード）",
      left: "最大38時間",
      right: "最大32時間",
      highlight: "left",
      direction: "higher-is-better",
    },
    {
      label: "高速充電",
      left: "約30分で最大80%",
      right: "約45分で最大80%",
      highlight: "left",
    },
    {
      label: "表示サイズ（小さいほうのケース・ピクセル）",
      left: "42mm・374×446ピクセル",
      right: "40mm・324×394ピクセル",
      highlight: null,
    },
    {
      label: "質量（アルミニウム・GPSモデル・小さいほうのケース）",
      left: "32.2g",
      right: "26.3g",
      highlight: "right",
      highlightNote: "質量はApple公式の値",
      direction: "lower-is-better",
    },
    {
      label: "厚さ（アルミニウム）",
      left: "9.7mm",
      right: "10.7mm",
      highlight: null,
    },
    {
      label: "ケースの素材・サイズ",
      left: "アルミニウム・チタニウム・セラミック（46mm・42mm）",
      right: "アルミニウム（44mm・40mm）",
      highlight: null,
    },
    {
      label: "センサー・健康機能の記載",
      left: "第2世代の電気心拍センサー、血中酸素ウェルネスアプリ、心電図アプリ、水深計（6mまで）、水温センサー",
      right: "第2世代の光学式心拍センサー、皮膚温センサー",
      highlight: "left",
      highlightNote:
        "左の血中酸素・心電図・水深計・水温の記載は、SE 3の仕様ページには見当たらない",
    },
    {
      label: "耐水性能",
      left: "50メートル（ISO 22810:2010）・IP6X防塵",
      right: "50メートル（ISO 22810:2010）",
      highlight: null,
    },
    {
      label: "容量",
      left: "64GB",
      right: "64GB",
      highlight: null,
    },
  ],
  faqEntries: [
    {
      question: "Apple Watch Series 12とSE 3の大きな違いは何ですか？",
      answer:
        "価格、バッテリー、ディスプレイの明るさ、センサーと健康機能の記載です。Appleオンラインストアの価格は、Series 12が71,800円から、SE 3が41,800円からで、差は30,000円です。Series 12は、S11チップ、ピーク輝度2,000ニト、通常使用で最大24時間のバッテリー、約30分で最大80%の充電、心電図アプリなどの記載があります。",
    },
    {
      question: "バッテリーの持ちはどれくらい違いますか？",
      answer:
        "Appleの仕様ページでは、通常使用でSeries 12が最大24時間、SE 3が最大18時間、低電力モードでは最大38時間と最大32時間と記載されています。持続時間は使用条件による目安で、実際の持ちは使い方によって変わります。",
    },
    {
      question: "SE 3では心電図や血中酸素は使えますか？",
      answer:
        "Series 12の仕様ページには、心電図アプリと血中酸素ウェルネスアプリの記載があります。SE 3の仕様ページには、これらの記載は見当たりませんでした。SE 3は、心拍数アプリ、高心拍数・低心拍数の通知、不規則な心拍リズムの通知、睡眠スコア、睡眠時無呼吸の通知などが記載されています。",
    },
    {
      question: "どのサイズ・モデルで比較していますか？",
      answer:
        "小さいサイズで、アルミニウムケースのGPSモデルで比べています。Series 12は42mm（ブラックアルミニウムケース・ブラックスポーツバンド S/M）、SE 3は40mm（スターライトアルミニウムケース・サンドスポーツバンド S/M）です。46mm・44mmなどの大きいサイズ、チタニウム・セラミックケース、Cellularモデルは比較していません。",
    },
    {
      question: "防水はどちらも使えますか？",
      answer:
        "どちらも、ISO規格22810:2010にもとづく50メートルの耐水性能が記載されています。Series 12にはIP6X等級の防塵性能の記載もあります。",
    },
    {
      question: "Cellularモデルもありますか？",
      answer:
        "どちらも、5G RedCapとLTEに対応するCellularモデルがあります。この記事の価格・購入リンクは、GPSモデルを対象にしています。",
    },
  ],
  decisionGuideSteps: [
    "予算を確認し、41,800円からのSE 3で足りるか、71,800円からのSeries 12を出せるかを決める",
    "バッテリーを重視する場合は、通常使用で最大24時間・約30分で最大80%充電のSeries 12を確認する",
    "心電図や血中酸素ウェルネスを使いたい場合は、記載のあるSeries 12を選ぶ",
    "ケースの素材（チタニウム・セラミック）やサイズ（46mm・42mm）を選びたい場合は、Series 12を確認する",
  ],
  socialProofQuery: "Apple Watch Series 12 SE 3 違い 使用感 X YouTube",
  socialProofCheckedAt: "2026-10-09",
  socialProofHasPosts: false,
  socialProofBestMatch: "model",
  officialProse: [
    {
      heading: "Apple Watch Series 12",
      items: [
        "S11チップ、LTPO3広視野角OLED常時表示Retinaディスプレイ（ピーク輝度2,000ニト）で、アルミニウム・チタニウム・セラミックのケースを選べます。",
        "第2世代の電気心拍センサー、血中酸素ウェルネスアプリ、心電図アプリ、水深計（6mまで）、水温センサーが記載されています。",
        "バッテリーは通常使用で最大24時間、約30分で最大80%充電。Appleオンラインストアでは71,800円（税込）からです。",
      ],
    },
    {
      heading: "Apple Watch SE 3",
      items: [
        "S10チップ、LTPO OLED常時表示Retinaディスプレイ（ピーク輝度1,000ニト）で、アルミニウムケース（44mm・40mm）です。",
        "第2世代の光学式心拍センサーと皮膚温センサーを備え、睡眠スコア、睡眠時無呼吸の通知などが記載されています。",
        "バッテリーは通常使用で最大18時間、約45分で最大80%充電。Appleオンラインストアでは41,800円（税込）からです。",
      ],
    },
  ],
  sourceLinks: [
    {
      label: "Apple Apple Watch Series 12 技術仕様",
      url: "https://www.apple.com/jp/apple-watch-series-12/specs/",
      date: "2026-10-09",
    },
    {
      label: "Apple Apple Watch SE 3 技術仕様",
      url: "https://www.apple.com/jp/apple-watch-se-3/specs/",
      date: "2026-10-09",
    },
    {
      label: "Apple Apple Watch 購入ページ（価格）",
      url: "https://www.apple.com/jp/shop/buy-watch/apple-watch",
      date: "2026-10-09",
    },
  ],
  disclaimer:
    "仕様と価格は2026年10月9日にApple公式サイトで確認しました。価格は「から」の表示（最小構成・GPSモデル）で、ケースの素材・サイズ・Cellularの有無によって異なります。商品画像はAmazonの商品ページの画像を使用しています。この記事にはアフィリエイトリンクが含まれる場合があります。",
};
