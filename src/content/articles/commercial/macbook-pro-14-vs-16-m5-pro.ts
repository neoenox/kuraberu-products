import type { CommercialArticleSeed } from "./types";

export const macbookPro14Vs16M5ProSeed: CommercialArticleSeed = {
  id: "macbook-pro-14-vs-16-m5-pro",
  draft: false,
  publishedAt: "2026-10-12",
  modifiedAt: "2026-10-12",
  productInfoCheckedAt: "2026-10-12",
  handoffManifestId: "macbook-pro-14-vs-16-m5-pro-2026-10-12",
  purchaseLinksCheckedAt: "2026-10-12",
  purchaseLinkStatus: "verified",
  amazonLinkStatus: "verified",
  rakutenLinkStatus: "unverified",
  title:
    "MacBook Pro 14インチと16インチ（M5 Pro）の違いを比較｜価格・画面・バッテリー・重さ",
  headline: "MacBook Pro 14インチと16インチ（M5 Pro）の違い",
  description:
    "MacBook Pro 14インチと16インチ（M5 Pro）を、Appleの公式仕様とAmazonの商品ページで比較。画面サイズ、チップの構成、メモリ、バッテリー、電源アダプタ、重さ、価格の違いを、Amazonで販売されている構成で整理します。",
  category: "ノートパソコン",
  tags: ["MacBook Pro", "ノートパソコン", "M5 Pro", "14インチ", "16インチ"],
  audiences: [
    "MacBook Proの14インチと16インチのどちらにするか迷っている人",
    "画面の大きさ、バッテリー、重さ、価格の違いをApple公式の仕様で確認したい人",
  ],
  uses: [
    "動画編集・写真編集・開発など、負荷の高い作業",
    "持ち運びと据え置きの使い分け",
    "外部ディスプレイにつないだ作業",
  ],
  summary:
    "持ち運びやすさと価格を重視するなら14インチ（M5 Pro・24GB・1TBで429,800円、1.60kg）、広い画面と大きなバッテリー（100Wh）、48GBメモリの構成を重視するなら16インチ（M5 Pro・48GB・1TBでAmazon 627,800円、2.14kg）が候補です。",
  lead: "MacBook Proの14インチと16インチ（どちらもM5 Pro）は、Liquid Retina XDRディスプレイ（1,000ニトの持続輝度・最大120Hz）、Thunderbolt 5ポート3つ・HDMI・SDXCカードスロット・MagSafe 3、Wi-Fi 7・Bluetooth 6、12MPのセンターフレームカメラ、6スピーカー、Touch IDが共通です。違いは、画面サイズ（14.2インチと16.2インチ）、チップの構成（15コアCPU・16コアGPUと18コアCPU・20コアGPU）、メモリ（この記事の構成は24GBと48GB）、バッテリー（72.4Whと100Wh・ビデオ再生最大22時間と最大24時間）、付属の電源アダプタ（70Wと140W）、質量（1.60kgと2.14kg）、本体サイズ、価格です。この記事では、Amazonで販売されているシルバー・1TBの構成で比べています。メモリとチップの構成が異なる点に注意してください。",
  leftProduct:
    "Apple 2026 MacBook Pro 14インチ（M5 Pro 15コアCPU・16コアGPU・24GB・1TB）シルバー",
  rightProduct:
    "Apple 2026 MacBook Pro 16インチ（M5 Pro 18コアCPU・20コアGPU・48GB・1TB）シルバー",
  leftPoint:
    "持ち運びやすさ（1.60kg）と価格（429,800円）を重視する人向け。画面は14.2インチ、バッテリーは72.4Wh",
  rightPoint:
    "広い画面（16.2インチ）、大きなバッテリー（100Wh）、48GBのメモリを重視し、重さ（2.14kg）と価格が上がってもよい人向け",
  leftAmazonUrl: "https://www.amazon.co.jp/dp/B0GR1KP26Q",
  rightAmazonUrl: "https://www.amazon.co.jp/dp/B0GR1FPZSG",
  leftRakutenUrl: null,
  rightRakutenUrl: null,
  leftImage: "/products/macbook-pro-14-m5-pro-silver.jpg",
  rightImage: "/products/macbook-pro-16-m5-pro-silver.jpg",
  officialSources: [
    {
      label: "Apple MacBook Pro 技術仕様（14インチ・16インチ）",
      url: "https://www.apple.com/jp/macbook-pro/specs/",
    },
    {
      label: "Apple MacBook Pro 購入ページ",
      url: "https://www.apple.com/jp/shop/buy-mac/macbook-pro",
    },
  ],
  verifiedRows: [
    {
      label:
        "Appleオンラインストアの価格（M5 Pro・標準構成から・税込・2026-10-12確認）",
      left: "429,800円から（15コアCPU・16コアGPU）",
      right: "519,800円から（18コアCPU・20コアGPU）",
      highlight: "left",
      highlightNote:
        "各サイズの標準構成の「から」価格。16インチのAmazon構成（48GB・1TB）は、メモリが標準構成と異なる",
      direction: "lower-is-better",
    },
    {
      label: "Amazonの表示価格（この記事の構成・税込・2026-10-12確認）",
      left: "429,800円（24GB・1TB）",
      right: "627,800円（48GB・1TB）",
      highlight: "left",
      highlightNote:
        "14インチはAppleの「から」価格と一致。16インチはメモリを48GBに増やした構成で、このAmazon構成のAppleでの価格は確認していない",
      direction: "lower-is-better",
    },
    {
      label: "ディスプレイ",
      left: "14.2インチ・3,024×1,964ピクセル・254ppi",
      right: "16.2インチ・3,456×2,234ピクセル・254ppi",
      highlight: null,
      highlightNote:
        "どちらもLiquid Retina XDR・1,000ニトの持続輝度・ピーク1,600ニト（HDRのみ）・最大120Hz",
    },
    {
      label: "チップ",
      left: "Apple M5 Pro（15コアCPU・16コアGPU・16コアNeural Engine）",
      right: "Apple M5 Pro（18コアCPU・20コアGPU・16コアNeural Engine）",
      highlight: "right",
      highlightNote:
        "どちらもM5 Proだが、CPUとGPUのコア数が異なる。実際の性能差は、この記事では評価していない",
    },
    {
      label: "メモリ帯域幅",
      left: "307GB/s",
      right: "307GB/s",
      highlight: null,
    },
    {
      label: "メモリ（この記事の構成）",
      left: "24GBユニファイドメモリ",
      right: "48GBユニファイドメモリ",
      highlight: "right",
      highlightNote: "16インチのAmazon構成は48GB。構成が異なる点に注意",
    },
    {
      label: "ストレージ（この記事の構成）",
      left: "1TB SSD",
      right: "1TB SSD",
      highlight: null,
    },
    {
      label: "バッテリー",
      left: "72.4Wh・ビデオ再生最大22時間・ワイヤレスインターネット最大14時間",
      right: "100Wh・ビデオ再生最大24時間・ワイヤレスインターネット最大17時間",
      highlight: "right",
      highlightNote:
        "Appleの測定条件による目安。実際の駆動時間は使い方で変わる",
      direction: "higher-is-better",
    },
    {
      label: "付属の電源アダプタ",
      left: "70W USB-C電源アダプタ（15コアCPUのM5 Pro）",
      right: "140W USB-C電源アダプタ",
      highlight: null,
      highlightNote: "いずれもUSB-C - MagSafe 3ケーブル（2m）が付属",
    },
    {
      label: "質量",
      left: "1.60kg",
      right: "2.14kg",
      highlight: "left",
      direction: "lower-is-better",
    },
    {
      label: "本体サイズ（高さ×幅×奥行き）",
      left: "1.55×31.26×22.12cm",
      right: "1.68×35.57×24.81cm",
      highlight: null,
    },
    {
      label: "ポート・外部ディスプレイ",
      left: "Thunderbolt 5×3・HDMI・SDXC・MagSafe 3・3.5mmジャック・外部ディスプレイ最大3台",
      right:
        "Thunderbolt 5×3・HDMI・SDXC・MagSafe 3・3.5mmジャック・外部ディスプレイ最大3台",
      highlight: null,
    },
    {
      label: "ワイヤレス・カメラ・オーディオ",
      left: "Wi-Fi 7・Bluetooth 6・12MPセンターフレームカメラ・6スピーカー",
      right: "Wi-Fi 7・Bluetooth 6・12MPセンターフレームカメラ・6スピーカー",
      highlight: null,
    },
  ],
  faqEntries: [
    {
      question: "MacBook Proの14インチと16インチの大きな違いは何ですか？",
      answer:
        "画面サイズ、チップの構成、バッテリー、電源アダプタ、重さ、価格です。M5 Proの14インチは、14.2インチ・15コアCPU・16コアGPU・72.4Wh・70W電源アダプタ・1.60kgです。16インチは、16.2インチ・18コアCPU・20コアGPU・100Wh・140W電源アダプタ・2.14kgです。Appleオンラインストアの標準構成の価格は、14インチが429,800円から、16インチが519,800円からです。",
    },
    {
      question:
        "16インチのAmazon構成が、Appleの標準構成より高いのはなぜですか？",
      answer:
        "この記事で比べる16インチのAmazon構成は、メモリが48GB（1TB SSD）で、627,800円（税込）です。Appleの16インチの標準構成の価格は519,800円からと記載されており、メモリなどの構成が異なります。このAmazon構成のAppleでの価格は確認していないため、価格差の内訳は断定していません。",
    },
    {
      question: "ディスプレイや端子は同じですか？",
      answer:
        "どちらもLiquid Retina XDR（持続輝度1,000ニト・最大120Hz）で、Thunderbolt 5×3・HDMI・SDXCカードスロット・MagSafe 3・3.5mmヘッドフォンジャックを備えます。違いは画面サイズと解像度（3,024×1,964ピクセルと3,456×2,234ピクセル）です。",
    },
    {
      question: "バッテリーの持ちは違いますか？",
      answer:
        "Appleの仕様では、M5 Proのビデオ再生が最大22時間（14インチ）と最大24時間（16インチ）、ワイヤレスインターネットが最大14時間と最大17時間です。バッテリー容量は72.4Whと100Whです。実際の持ちは、使い方によって変わります。",
    },
    {
      question: "どの構成・色で比較していますか？",
      answer:
        "どちらもシルバー・1TB SSD・M5 Proで、14インチは15コアCPU・16コアGPU・24GB（B0GR1KP26Q）、16インチは18コアCPU・20コアGPU・48GB（B0GR1FPZSG）です。スペースブラック、2TB以上の容量、M5 Max、Nano-textureディスプレイ、整備済み品は比較していません。CPU・GPUのコア数とメモリが異なる構成での比較です。",
    },
  ],
  decisionGuideSteps: [
    "予算と持ち運ぶ頻度を確認し、1.60kg・429,800円の14インチで足りるか、2.14kgの16インチを選ぶかを決める",
    "広い画面（16.2インチ）、大きなバッテリー（100Wh）、より多いコア数を重視する場合は、16インチを確認する",
    "16インチは、メモリ（24GB・48GBなど）とストレージの構成で価格が大きく変わる。Appleの購入ページで構成と価格を確認する",
    "M5 Max、2TB以上の容量、Nano-textureディスプレイが必要な場合は、Appleの購入ページで構成を確認する",
  ],
  socialProofQuery: "MacBook Pro 14インチ 16インチ M5 Pro 違い 使用感 YouTube",
  socialProofCheckedAt: "2026-10-12",
  socialProofHasPosts: true,
  socialProofBestMatch: "model",
  embeds: [
    {
      provider: "youtube",
      url: "https://www.youtube.com/watch?v=kNmTfkVK_6I",
      title:
        "【恐るべき本命ミドル】新型M5 Pro MacBook Pro購入機レビュー！吊るし下位機種の進化凄い！",
      match: "model",
      purpose: "実際に使用・購入した人の感想",
      author: "Appleが大好きなんだよ",
      summary: "個人の使用感で、比較の根拠ではない。",
      autoload: true,
      autoDisplay: true,
      compact: true,
    },
    {
      provider: "youtube",
      url: "https://www.youtube.com/watch?v=H99C6DOKccw",
      title:
        "【動画編集】副業YouTuber2年目のMac買い替えガイド！M5 Proの48GBを選んだ理由とおすすめスペック",
      match: "model",
      purpose: "実際に使用・購入した人の感想",
      author: "ゆとり旅",
      summary: "個人の使用感で、比較の根拠ではない。",
      autoload: true,
      autoDisplay: true,
      compact: true,
    },
    {
      provider: "youtube",
      url: "https://www.youtube.com/watch?v=TpY0O9KSqDA",
      title:
        "両方使ったからこそ分かる！14インチと16インチMacBook Proの違い・選び方について解説させて下さい",
      match: "series",
      purpose: "実際に使用・購入した人の感想",
      author: "Apple信者１億人創出計画",
      summary:
        "個人の使用感で、比較の根拠ではない。同シリーズまたは近い型番の動画。",
      autoload: true,
      autoDisplay: true,
      compact: true,
    },
  ],
  officialProse: [
    {
      heading: "MacBook Pro 14インチ（M5 Pro）",
      items: [
        "14.2インチのLiquid Retina XDRディスプレイ、Apple M5 Pro（15コアCPU・16コアGPU）、Thunderbolt 5ポートと記載されています。",
        "72.4Whのバッテリー、ビデオ再生最大22時間、質量は1.60kgです。",
        "Appleオンラインストアでは、標準構成が429,800円から（税込）です。",
      ],
    },
    {
      heading: "MacBook Pro 16インチ（M5 Pro）",
      items: [
        "16.2インチのLiquid Retina XDRディスプレイ、Apple M5 Pro（18コアCPU・20コアGPU）、Thunderbolt 5ポートと記載されています。",
        "100Whのバッテリー、ビデオ再生最大24時間、140W電源アダプタ、質量は2.14kgです。",
        "Appleオンラインストアでは、標準構成が519,800円から（税込）です。",
      ],
    },
  ],
  sourceLinks: [
    {
      label: "Apple MacBook Pro 技術仕様（14インチ・16インチ）",
      url: "https://www.apple.com/jp/macbook-pro/specs/",
      date: "2026-10-12",
    },
    {
      label: "Apple MacBook Pro 購入ページ（価格）",
      url: "https://www.apple.com/jp/shop/buy-mac/macbook-pro",
      date: "2026-10-12",
    },
  ],
  disclaimer:
    "仕様と価格は2026年10月12日にApple公式サイトとAmazon.co.jpの商品ページで確認しました。Appleの価格は標準構成の税込「から」表示で、Amazonの価格はこの記事の構成（シルバー・1TB）の税込表示です。メモリなどの構成が異なる点があります。バッテリーの駆動時間は、Appleの測定条件による目安です。商品画像はAmazonの商品ページの画像を使用しています。この記事にはアフィリエイトリンクが含まれる場合があります。",
};
