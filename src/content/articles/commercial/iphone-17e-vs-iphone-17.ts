import type { CommercialArticleSeed } from "./types";

export const iphone17eVsIphone17Seed: CommercialArticleSeed = {
  id: "iphone-17e-vs-iphone-17",
  draft: true,
  publishedAt: "2026-10-10",
  modifiedAt: "2026-10-10",
  productInfoCheckedAt: "2026-10-10",
  handoffManifestId: "iphone-17e-vs-iphone-17-2026-10-10",
  purchaseLinksCheckedAt: "2026-10-10",
  purchaseLinkStatus: "verified",
  amazonLinkStatus: "verified",
  leftAmazonLinkStatus: "verified",
  rightAmazonLinkStatus: "verified",
  rakutenLinkStatus: "unverified",
  title: "iPhone 17eとiPhone 17を比較｜画面・カメラ・サイズの違い",
  headline: "iPhone 17eとiPhone 17を比較｜256GB仕様・カメラ・SIMの違い",
  description:
    "iPhone 17eとiPhone 17の256GBモデルを比較。公式仕様の画面、チップ、カメラ、バッテリー、サイズ、SIMを整理し、選び方を紹介します。",
  category: "スマートフォン",
  tags: ["iPhone", "スマートフォン", "カメラ", "SIMフリー"],
  audiences: [
    "iPhone 17eとiPhone 17のどちらを買うか迷っている人",
    "256GBモデルの画面とカメラ仕様を比べたい人",
  ],
  uses: [
    "写真や動画の撮影",
    "日常の連絡、決済、地図、アプリ利用",
    "長く使うスマートフォンの買い替え",
  ],
  summary:
    "超広角カメラやProMotionの高リフレッシュレート、明るい大画面を重視するならiPhone 17。軽さと小ささを優先し、単眼の48MPメインで足りるならiPhone 17eが候補です。",
  lead: "iPhone 17eとiPhone 17は、どちらもA19チップと256GB／512GBの容量を選べるeSIM専用モデルです。公式仕様では、iPhone 17が6.3インチでProMotion最大120Hzと常時表示、48MPデュアルカメラ、18MPセンターフレームフロントカメラを搭載する一方、iPhone 17eは6.1インチで48MP単眼カメラ、12MPフロントカメラ、169gの軽量本体です。価格の断定は公式の日本向け本体価格を確認できていないため行わず、仕様の差と選び方を整理します。",
  leftProduct: "Apple iPhone 17e 256GB",
  rightProduct: "Apple iPhone 17 256GB",
  leftPoint: "軽さと小ささを優先し、単眼カメラで足りる人向け",
  rightPoint: "大画面、超広角カメラ、高リフレッシュレートを重視する人向け",
  leftImage:
    "https://www.apple.com/v/iphone-17e/e/images/meta/iphone17e_overview__b9tcq8ttub9e_og.png?202609080800",
  rightImage:
    "https://www.apple.com/v/iphone-17/i/images/meta/iphone-17_overview__cg0rlzmbhl7m_og.png?202609172040",
  leftAmazonUrl: "https://www.amazon.co.jp/dp/B0GQVHLG38",
  rightAmazonUrl: "https://www.amazon.co.jp/dp/B0FQGJ6H6X",
  officialSources: [
    {
      label: "iPhone 17e 技術仕様",
      url: "https://www.apple.com/jp/iphone-17e/specs/",
    },
    {
      label: "iPhone 17 技術仕様",
      url: "https://www.apple.com/jp/iphone-17/specs/",
    },
    {
      label: "iPhone 17e 製品ページ",
      url: "https://www.apple.com/jp/iphone-17e/",
    },
    {
      label: "iPhone 17 製品ページ",
      url: "https://www.apple.com/jp/iphone-17/",
    },
  ],
  verifiedRows: [
    {
      label: "ディスプレイ",
      left: "6.1インチ Super Retina XDR（2532×1170、460ppi、最大800ニト／ピーク1200ニトHDR）",
      right:
        "6.3インチ Super Retina XDR（2622×1206、ProMotion最大120Hz、常時表示、Dynamic Island、最大1000／ピーク1600ニトHDR／3000ニト屋外）",
      highlight: "right",
      highlightNote:
        "公式仕様ではiPhone 17の画面が大きく明るく、高リフレッシュレートと常時表示に対応",
    },
    {
      label: "チップ",
      left: "A19（6コアCPU、4コアGPU、16コアNeural Engine）",
      right: "A19（6コアCPU、5コアGPU、16コアNeural Engine）",
      highlight: "right",
      highlightNote: "同じA19世代。公式仕様のGPUコア数はiPhone 17が1コア多い",
    },
    {
      label: "背面カメラ",
      left: "48MP Fusionメインの単眼。2倍望遠（光学品質）、デジタル最大10倍",
      right:
        "48MP Dual Fusion（メイン＋超広角）。超広角マクロ、空間写真、2倍イン／アウト・4倍光学レンジ、デジタル最大10倍",
      highlight: "right",
      highlightNote:
        "超広角・マクロ・空間写真は公式仕様に記載があるのはiPhone 17のみ",
    },
    {
      label: "フロントカメラ",
      left: "12MP TrueDepth（ƒ/1.9）",
      right:
        "18MPセンターフレームカメラ（ƒ/1.9、タップでズーム・回転、デュアルキャプチャ）",
      highlight: "right",
      highlightNote: "公式仕様の画素数と撮影機能が異なる",
    },
    {
      label: "バッテリー（メーカー公称）",
      left: "ビデオ再生最大26時間／ストリーミング最大21時間。20W以上で30分最大50%",
      right:
        "ビデオ再生最大30時間／ストリーミング最大27時間。40W以上で20分最大50%",
      highlight: null,
      highlightNote:
        "測定アダプタや条件が異なるメーカー公称値。実使用の優劣を示す共通試験ではない",
    },
    {
      label: "本体サイズ・重量",
      left: "146.7×71.5×7.80mm、169g",
      right: "149.6×71.5×7.95mm、177g",
      highlight: "left",
      highlightNote: "iPhone 17eが8g軽く一回り小さい（公式寸法）",
      direction: "lower-is-better",
    },
    {
      label: "SIM",
      left: "デュアルeSIM。物理SIMには非対応",
      right: "デュアルeSIM。物理SIMには非対応",
      highlight: null,
      highlightNote: "日本モデルはどちらもeSIMのみ。契約回線の対応を確認",
    },
    {
      label: "無線・モデム",
      left: "C1Xモデム、Wi-Fi 6、Bluetooth 5.3",
      right: "N1チップ、Wi-Fi 7、Bluetooth 6、Thread、第2世代超広帯域チップ",
      highlight: "right",
      highlightNote: "公式仕様の対応規格が異なる",
    },
    {
      label: "容量・カラー",
      left: "256GB／512GB。ブラック、ホワイト、ソフトピンク",
      right:
        "256GB／512GB。ブラック、ホワイト、ミストブルー、セージ、ラベンダー",
      highlight: null,
      highlightNote: "容量は共通。カラー展開は公式ページの掲載範囲",
    },
  ],
  faqEntries: [
    {
      question: "大きな違いはどこですか？",
      answer:
        "公式仕様では、iPhone 17が6.3インチ・ProMotion・常時表示・48MPデュアルカメラ・18MPセンターフレームフロントカメラ、iPhone 17eが6.1インチ・48MP単眼カメラ・12MPフロントカメラ・169gの軽量本体です。本体価格の比較は日本向けの確定価格を公式ページで確認できていないため、販売ページでご確認ください。",
    },
    {
      question: "カメラで選ぶならどちらですか？",
      answer:
        "超広角やマクロ、空間写真が必要なら公式仕様に記載があるiPhone 17が候補です。48MPメインの単眼で足りるかは、2倍望遠やナイトモードなど普段の撮り方で判断してください。倍率の数字だけで画質の優劣は判断できません。",
    },
    {
      question: "画面の見え方は違いますか？",
      answer:
        "公式仕様ではiPhone 17が6.3インチ・2622×1206で最大120HzのProMotionと常時表示、Dynamic Islandに対応し、iPhone 17eは6.1インチ・2532×1170です。最大輝度もiPhone 17が高く案内されています。屋外での見やすさは設定や環境で変わります。",
    },
    {
      question: "電池持ちが長いのはどちらですか？",
      answer:
        "メーカー公称はiPhone 17eがビデオ再生最大26時間、iPhone 17が最大30時間ですが、測定アダプタや条件が異なるため数字だけで実使用の優劣は判断できません。画面設定や通信、撮影の頻度でも変わります。",
    },
    {
      question: "SIMや防水、コネクタは同じですか？",
      answer:
        "どちらもデュアルeSIMで物理SIMには対応しません。USB-Cコネクタ、Face ID、防沫・耐水・防塵はIP68（最大水深6メートルで最大30分間）と案内されています。契約中の通信会社や利用回線の対応は購入前に確認してください。",
    },
  ],
  decisionGuideSteps: [
    "画面の大きさ・明るさ・ProMotion・常時表示の要否で絞る。公式仕様ではiPhone 17が上回る",
    "超広角・マクロ・空間写真・18MPセンターフレームの要否で選ぶ。単眼で足りるかを作例で確かめる",
    "軽さと片手操作（169g対177g、146.7mm対149.6mm）を店頭で確かめる",
    "容量・色の在庫と販売条件を購入時点の販売ページで確認する",
  ],
  officialProse: [
    {
      heading: "Apple iPhone 17e",
      items: [
        "Apple日本公式の仕様ページで256GBと512GBの容量、ブラック・ホワイト・ソフトピンクの仕上げを確認しました。記事では双方の標準容量である256GBを比較します。",
        "6.1インチのSuper Retina XDRディスプレイ（2532×1170、460ppi）を搭載。重量は169g、サイズは146.7×71.5×7.80mmです。",
        "48MP Fusionメインの単眼カメラに、12MPの2倍望遠や最大10倍のデジタルズームを搭載。フロントは12MP TrueDepthカメラです。",
        "A19チップ（6コアCPU、4コアGPU、16コアNeural Engine）とC1Xモデムを搭載。MagSafeとQi2は最大15W、バッテリーはビデオ再生最大26時間と案内されています。",
      ],
    },
    {
      heading: "Apple iPhone 17",
      items: [
        "Apple日本公式の仕様ページで256GBと512GBの容量、ブラック・ホワイト・ミストブルー・セージ・ラベンダーの仕上げを確認しました。記事では双方の標準容量である256GBを比較します。",
        "6.3インチのSuper Retina XDRディスプレイ（2622×1206）にProMotion最大120Hz、常時表示、Dynamic Islandを搭載。重量は177gです。",
        "48MP Dual Fusionカメラ（メイン＋超広角）に、超広角マクロや空間写真、48MPマクロ写真を搭載。フロントは18MPセンターフレームカメラです。",
        "A19チップ（6コアCPU、5コアGPU、16コアNeural Engine）とN1ワイヤレスチップを搭載。MagSafeとQi2は最大25W、バッテリーはビデオ再生最大30時間と案内されています。",
      ],
    },
  ],
  socialProofHasPosts: true,
  socialProofBestMatch: "model",
  socialProofCheckedAt: "2026-10-10",
  socialProofQuery: "iPhone 17e iPhone 17 使用感 レビュー",
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
  sourceLinks: [
    {
      label: "iPhone 17e 技術仕様",
      url: "https://www.apple.com/jp/iphone-17e/specs/",
      date: "2026-10-10",
    },
    {
      label: "iPhone 17 技術仕様",
      url: "https://www.apple.com/jp/iphone-17/specs/",
      date: "2026-10-10",
    },
    {
      label: "iPhone 17e 製品ページ",
      url: "https://www.apple.com/jp/iphone-17e/",
      date: "2026-10-10",
    },
    {
      label: "iPhone 17 製品ページ",
      url: "https://www.apple.com/jp/iphone-17/",
      date: "2026-10-10",
    },
    {
      label: "iPhone 17e 256GB Amazon商品ページ",
      url: "https://www.amazon.co.jp/dp/B0GQVHLG38",
      date: "2026-10-10",
    },
    {
      label: "iPhone 17 256GB Amazon商品ページ",
      url: "https://www.amazon.co.jp/dp/B0FQGJ6H6X",
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
    "仕様は2026年10月10日にメーカー公式ページで確認しました。本体価格は日本向けの確定価格を公式ページで確認できていないため記載しません。カメラの倍率やバッテリー時間はメーカー表記の仕様であり、実際の画質や使用時間を示す共通試験ではありません。価格、在庫、色、販売条件は購入時点の販売ページでご確認ください。SNSの感想は個人の使用感で、比較の根拠ではありません。この記事にはアフィリエイトリンクが含まれます。",
};
