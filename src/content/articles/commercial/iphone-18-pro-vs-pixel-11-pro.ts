import type { CommercialArticleSeed } from "./types";

export const iphone18ProVsPixel11ProSeed: CommercialArticleSeed = {
  id: "iphone-18-pro-vs-pixel-11-pro",
  draft: false,
  publishedAt: "2026-10-03",
  modifiedAt: "2026-10-03",
  productInfoCheckedAt: "2026-10-03",
  handoffManifestId: "iphone-18-pro-vs-pixel-11-pro-2026-09-29",
  purchaseLinksCheckedAt: "2026-10-03",
  purchaseLinkStatus: "verified",
  amazonLinkStatus: "verified",
  // iPhone 18 ProのAmazon本体詳細ページは確認できないため、商品名と容量を指定した検索CTAを表示する。
  leftAmazonLinkStatus: "search",
  rightAmazonLinkStatus: "verified",
  rakutenLinkStatus: "verified",
  title: "iPhone 18 ProとPixel 11 Proを比較｜価格・カメラ・サイズの違い",
  headline: "iPhone 18 ProとPixel 11 Proを比較｜256GB価格・カメラ・SIMの違い",
  description:
    "iPhone 18 ProとGoogle Pixel 11 Proの256GBモデルを比較。公式価格、望遠カメラ、重さ、SIM、アップデート方針を整理し、選び方を紹介します。",
  category: "スマートフォン",
  tags: ["iPhone", "Google Pixel", "スマートフォン", "カメラ", "SIMフリー"],
  audiences: [
    "iPhone 18 ProとGoogle Pixel 11 Proのどちらを買うか迷っている人",
    "256GBモデルの価格とカメラ仕様を比べたい人",
  ],
  uses: [
    "写真や動画の撮影",
    "日常の連絡、決済、地図、アプリ利用",
    "長く使うスマートフォンの買い替え",
  ],
  summary:
    "256GBの公式価格を抑え、5倍光学望遠やnanoSIMも選びたいならPixel 11 Pro。iOSを使い続けたい人や、Appleのカメラ機能・周辺機器との連携を重視する人はiPhone 18 Proが候補です。",
  lead: "iPhone 18 ProとGoogle Pixel 11 Proは、どちらも6.3インチ級の上位スマートフォンで、256GBモデルを選べます。確認した公式価格はPixel 11 Proが174,800円から、iPhone 18 Proが219,800円からで、差は45,000円です。カメラはPixelが5倍光学望遠、iPhoneが4倍望遠と8倍の光学品質ズームを案内。さらにPixelはnanoSIMとeSIMを併用できる一方、iPhone 18 Proは物理SIMに対応しません。スペックの数字だけで撮影結果や電池持ちの優劣は判断できないため、使っているOSと必要な機能を軸に選びましょう。",
  leftProduct: "Apple iPhone 18 Pro 256GB",
  rightProduct: "Google Pixel 11 Pro 256GB",
  leftPoint: "iOSとApple製品との連携、カメラ機能を重視する人向け",
  rightPoint: "価格、5倍光学望遠、nanoSIM対応を重視する人向け",
  leftImage: "/products/iphone-18-pro.png",
  rightImage: "/products/pixel-11-pro.jpg",
  rightAmazonUrl: "https://www.amazon.co.jp/dp/B0HC3B8NG6",
  rightRakutenUrl:
    "https://hb.afl.rakuten.co.jp/ichiba/580220e2.e788e5cf.580220e3.3d0b4bcb/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fbest1mobile%2Fpixel11pro%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtZSI6MSwibmFtcCI6InJpZ2h0IiwiY29tIjoxLCJjb21wIjoiZG93biIsInByaWNlIjoxLCJib3IiOjEsImNvbCI6MSwiYmJ0biI6MSwicHJvZCI6MCwiYW1wIjpmYWxzZX0%3D",
  leftRakutenUrl:
    "https://hb.afl.rakuten.co.jp/ichiba/58021d7e.4983f3fd.58021d7f.1b074964/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frakutenmobile-store%2Fiphone-18-pro%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtZSI6MSwibmFtcCI6InJpZ2h0IiwiY29tIjoxLCJjb21wIjoiZG93biIsInByaWNlIjoxLCJib3IiOjEsImNvbCI6MSwiYmJ0biI6MSwicHJvZCI6MCwiYW1wIjpmYWxzZX0%3D",
  officialSources: [
    {
      label: "iPhone 18 Pro 技術仕様",
      url: "https://www.apple.com/jp/iphone-18-pro/specs/",
    },
    {
      label: "Google Pixel 11 Pro 技術仕様・価格",
      url: "https://store.google.com/jp/product/pixel_11_pro_specs?hl=ja",
    },
    {
      label: "Apple iPhone 18 Pro 発表・価格",
      url: "https://www.apple.com/jp/newsroom/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/",
    },
    {
      label: "Google Pixel 11 シリーズ発表",
      url: "https://blog.google/intl/ja-jp/products/devices-services/google-pixel-11-pro-xl/",
    },
  ],
  verifiedRows: [
    {
      label: "公式価格（税込、256GBモデル）",
      left: "219,800円から",
      right: "174,800円から",
      highlight: "right",
      highlightNote:
        "確認した公式掲載価格ではPixelが45,000円低い。割引や下取りを含まない",
      direction: "lower-is-better",
    },
    {
      label: "ディスプレイ",
      left: "6.3インチ Super Retina XDR、最大120Hz",
      right: "6.3インチ Super Actua LTPO OLED、1～120Hz",
      highlight: null,
      highlightNote:
        "画面サイズは同クラス。パネル仕様の記載方法はメーカー間で異なる",
    },
    {
      label: "本体重量",
      left: "211g",
      right: "204g",
      highlight: "right",
      highlightNote: "Pixel 11 Proが7g軽い",
      direction: "lower-is-better",
    },
    {
      label: "背面カメラの望遠仕様",
      left: "48MP 4倍望遠、8倍光学品質ズーム、デジタル最大40倍",
      right: "48MP 5倍光学望遠、超解像ズーム Pro 最大120倍",
      highlight: null,
      highlightNote:
        "倍率・処理方式の仕様比較。画質の優劣や各倍率での撮影結果を示すものではない",
    },
    {
      label: "標準ストレージ",
      left: "256GB",
      right: "256GB / 12GB RAM",
      highlight: null,
      highlightNote: "同容量を基準に価格を比較",
    },
    {
      label: "SIM",
      left: "デュアルeSIM。物理SIMには非対応",
      right: "nanoSIM＋eSIM、またはeSIM 2回線",
      highlight: null,
      highlightNote: "契約中の通信会社と利用回線の対応状況を確認",
    },
    {
      label: "OS・セキュリティ更新",
      left: "今回参照した仕様ページに提供年数の明記なし",
      right: "OS・セキュリティ・Pixel Dropを7年間提供",
      highlight: null,
      highlightNote:
        "Apple側の更新終了時期を意味する比較ではない。公式ページの記載範囲",
    },
  ],
  faqEntries: [
    {
      question: "価格が安いのはどちらですか？",
      answer:
        "256GBモデルの確認した公式掲載価格はPixel 11 Proが174,800円から、iPhone 18 Proが219,800円からです。差は45,000円ですが、販売店の価格、キャンペーン、下取りで実際の支払額は変わります。",
    },
    {
      question: "カメラはどちらが優れていますか？",
      answer:
        "公式仕様ではPixel 11 Proは5倍光学望遠、iPhone 18 Proは4倍望遠と8倍の光学品質ズームを案内しています。Pixelの最大120倍は超解像ズーム Pro、iPhoneの最大40倍はデジタルズームで、数値だけで写真の画質や使いやすさを判定できません。作例や店頭での操作感も確認してください。",
    },
    {
      question: "物理SIMを使えますか？",
      answer:
        "Pixel 11 ProはnanoSIM 1枚とeSIM 1回線、またはeSIM 2回線に対応します。iPhone 18 ProはデュアルeSIMで、物理SIMカードには対応しません。契約中の通信会社や海外利用の条件も購入前に確認してください。",
    },
    {
      question: "電池持ちが長いのはどちらですか？",
      answer:
        "メーカーの電池持ちの表記は試験条件や評価方法が異なるため、公式の時間・容量の数字だけで単純比較できません。画面設定、通信状態、撮影やゲームの頻度でも実際の持続時間は変わります。",
    },
    {
      question: "長く使うならどちらを選べばよいですか？",
      answer:
        "Pixel 11 ProはGoogleがOS・セキュリティ・Pixel Dropの更新を7年間提供すると案内しています。iPhone 18 Proについて今回確認したApple仕様ページでは提供年数の明記を確認できませんでした。Apple側がその期間で更新を終了するという意味ではありません。利用中のOSや必要なアプリ、移行のしやすさも含めて選んでください。",
    },
  ],
  decisionGuideSteps: [
    "256GBの確認済み公式価格を基準に予算を決める。Pixelの掲載価格は45,000円低い",
    "望遠撮影で必要なのがPixelの5倍光学望遠か、iPhoneの4倍望遠と8倍光学品質ズームかを作例で確かめる",
    "nanoSIMを残す必要があるなら、物理SIMに対応するPixelの仕様と通信会社の対応を確認する",
    "普段使うOS、周辺機器、写真・メッセージの移行方法と、容量・色の在庫を購入先で確認する",
  ],
  officialProse: [
    {
      heading: "Apple iPhone 18 Pro",
      items: [
        "Appleは256GB、512GB、1TB、2TBの容量を掲載し、iPhone 18 Proの価格を219,800円（税込）からと案内しています。記事では双方の標準容量である256GBを比較します。",
        "6.3インチのSuper Retina XDRディスプレイを搭載。重量は211gです。",
        "可変絞り対応の48MPメイン、48MP超広角、48MP 4倍望遠を搭載。8倍は「光学品質ズーム」と表現され、デジタルズームは最大40倍です。",
        "デュアルeSIMに対応し、物理SIMカードには対応しません。",
      ],
    },
    {
      heading: "Google Pixel 11 Pro",
      items: [
        "Google Storeの掲載価格は174,800円から。標準構成は256GBストレージと12GB RAMです。",
        "6.3インチのSuper Actuaディスプレイ、204gの本体に、50MP広角・48MP超広角・48MP 5倍望遠の背面カメラを搭載します。",
        "最大120倍の超解像ズーム Proを案内しています。光学望遠と画像処理によるズームを同じ画質として扱うことはできません。",
        "nanoSIMとeSIMの組み合わせ、またはeSIM 2回線に対応。OS、セキュリティ、Pixel Dropのアップデートは7年間と案内されています。",
      ],
    },
  ],
  sourceLinks: [
    {
      label: "Apple iPhone 18 Pro 技術仕様",
      url: "https://www.apple.com/jp/iphone-18-pro/specs/",
      date: "2026-10-03",
    },
    {
      label: "Apple iPhone 18 Pro 発表・価格・発売日",
      url: "https://www.apple.com/jp/newsroom/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/",
      date: "2026-09-29",
    },
    {
      label: "Google Pixel 11 Pro 技術仕様・公式掲載価格",
      url: "https://store.google.com/jp/product/pixel_11_pro_specs?hl=ja",
      date: "2026-10-03",
    },
    {
      label: "Google Pixel 11 シリーズ発表",
      url: "https://blog.google/intl/ja-jp/products/devices-services/google-pixel-11-pro-xl/",
      date: "2026-09-29",
    },
    {
      label: "iPhone 18 Pro 楽天市場商品ページ（楽天モバイル公式ショップ）",
      url: "https://item.rakuten.co.jp/rakutenmobile-store/iphone-18-pro/",
      date: "2026-10-03",
    },
    {
      label: "Pixel 11 Pro 楽天市場商品ページ",
      url: "https://item.rakuten.co.jp/best1mobile/pixel11pro/",
      date: "2026-10-03",
    },
    {
      label: "Pixel 11 Pro 256GB Amazon商品ページ",
      url: "https://www.amazon.co.jp/dp/B0HC3B8NG6",
      date: "2026-10-03",
    },
  ],
  disclaimer:
    "仕様と価格は2026年10月3日にメーカー公式ページで確認しました。価格は確認時点の公式掲載価格で、割引・下取り・販売店価格を含みません。カメラの倍率はメーカー表記の仕様であり、実際の画質を示す共通試験ではありません。電池持ちは使用条件で変わります。価格、在庫、色、販売条件は購入時点の販売ページでご確認ください。この記事にはアフィリエイトリンクが含まれます。",
};
