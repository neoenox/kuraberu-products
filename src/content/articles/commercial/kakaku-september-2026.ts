import type { CommercialArticleSeed } from "./types";

const ranking = "https://kakaku.com/ranking/kaden/";
const date = "2026-09-16";
const rows = (left: string, right: string) => [
  { label: "比較ポイント", left, right },
];
const faq = (left: string, right: string) => [
  {
    question: `${left}と${right}はどちらが安い？`,
    answer: "価格と在庫は変動するため、販売先の最新表示をご確認ください。",
  },
  {
    question: "価格.comの売れ筋をどう参考にした？",
    answer:
      "価格.com家電ランキングの2026年9月上旬集計を商品選定の参考にし、仕様の根拠は各メーカー公式情報に分けています。",
  },
];
const make = (
  id: string,
  category: string,
  brand: string,
  left: string,
  right: string,
  leftPoint: string,
  rightPoint: string,
  official: string,
  embeds?: CommercialArticleSeed["embeds"],
): CommercialArticleSeed => ({
  id,
  publishedAt: date,
  modifiedAt: date,
  productInfoCheckedAt: "",
  purchaseLinksCheckedAt: date,
  purchaseLinkStatus:
    id === "hitachi-pv-bl1c4-vs-dyson-sv46-ff" ? "unavailable" : "unverified",
  title: `${brand} ${left}と${right}、どっち？｜くらべる商品メモ`,
  headline: `${brand} ${left}と${right}を比較。価格.com売れ筋を参考に選び方を整理`,
  description: `${left}と${right}を、メーカー公式情報と価格.com売れ筋ランキングを分けて確認します。`,
  category,
  tags: [category, "価格.com売れ筋", "公式仕様"],
  audiences: [
    `${category}の購入候補を比べたい人`,
    "価格.comの売れ筋から候補を探したい人",
  ],
  uses: ["購入前の比較", "仕様確認", "選び方の整理"],
  summary: `${left}と${right}について、公式ページで確認できる項目を比較し、価格.comランキングを候補選びの参考として整理します。`,
  leftProduct: left,
  rightProduct: right,
  leftPoint,
  rightPoint,
  verifiedRows:
    id === "hitachi-pv-bl1c4-vs-dyson-sv46-ff"
      ? [
          { label: "標準質量", left: "1.1kg", right: "2.2kg" },
          { label: "集じん容積", left: "0.15L", right: "0.35L" },
          { label: "充電時間", left: "約2時間", right: "3.5時間" },
          {
            label: "公称運転時間",
            left: "強：約8分／標準：約30分",
            right: "最大60分※",
          },
          {
            label: "主なヘッド",
            left: "自走コンパクトヘッド D-DP34",
            right: "Fluffy Opticクリーナーヘッド",
          },
          {
            label: "収納",
            left: "スティックスタンド",
            right: "壁付け式ブラケット",
          },
        ]
      : rows(leftPoint, rightPoint),
  faqEntries: faq(left, right),
  officialProse:
    id === "hitachi-pv-bl1c4-vs-dyson-sv46-ff"
      ? [
          {
            heading: "日立 PV-BL1C4",
            items: [
              "日立公式取扱説明書で標準質量1.1kg、集じん容積0.15L、約2時間充電を確認。",
              "標準モードはパワーヘッド使用時約30分、ヘッドなし約45分。",
              "自走コンパクトヘッド D-DP34、ファブリックヘッド、スティックスタンドが付属。",
            ],
          },
          {
            heading: "Dyson V12 Detect Slim Fluffy SV46 FF",
            items: [
              "Dyson公式ページで質量2.2kg、集じん容積0.35L、充電3.5時間を確認。",
              "Fluffy Optic、ピエゾセンサー、吸引力自動調整、液晶表示を搭載。",
              "最大60分はエコモードかつモーター駆動のないツール使用時。公式では販売終了モデル。",
            ],
          },
        ]
      : undefined,
  socialProofHasPosts: Boolean(embeds?.length),
  socialProofBestMatch: embeds?.length ? "model" : undefined,
  embeds,
  officialSources: [
    { label: `${brand}公式サイト`, url: official as `https://${string}` },
  ],
  sourceLinks: [
    {
      label: "価格.com 家電カテゴリランキング（2026年9月上旬集計）",
      url: ranking,
      date,
    },
  ],
});

export const kakakuSeptember2026Seeds: readonly CommercialArticleSeed[] = [
  make(
    "toshiba-tw-127xm5l-vs-panasonic-na-lx127el",
    "洗濯機",
    "東芝・パナソニック",
    "ZABOON TW-127XM5L",
    "NA-LX127EL-W",
    "洗濯容量・乾燥方式を確認",
    "洗濯容量・乾燥方式を確認",
    "https://www.toshiba-lifestyle.com/jp/laundries/",
  ),
  make(
    "airpods-pro-3-vs-sony-wf-1000xm6",
    "イヤホン・ヘッドホン",
    "Apple・SONY",
    "AirPods Pro 3 MFHP4J/A",
    "WF-1000XM6",
    "連携機能と装着感を確認",
    "ノイズキャンセリングと再生時間を確認",
    "https://www.apple.com/jp/airpods-pro/",
  ),
  make(
    "regza-32v35s-vs-regza-43m550m",
    "テレビ",
    "TVS REGZA",
    "REGZA 32V35S",
    "REGZA 43M550M",
    "設置場所に合う画面サイズを確認",
    "設置場所に合う画面サイズを確認",
    "https://www.regza.com/",
  ),
  make(
    "hitachi-pv-bl1c4-vs-dyson-sv46-ff",
    "掃除機",
    "日立・ダイソン",
    "ラクかるスティック PV-BL1C4",
    "Dyson V12 Detect Slim Fluffy SV46 FF",
    "1.1kg・自走ヘッド・約2時間充電",
    "2.2kg・ホコリ可視化・最大60分",
    "https://kadenfan.hitachi.co.jp/clean/",
    [
      {
        provider: "x",
        url: "https://x.com/Chiloly/status/1893934469226156409",
        title: "Dyson V12 Detect Slim Fluffy (SV46 FF) 開封投稿",
        match: "model",
        purpose:
          "対象型番を実際に開封した個人ユーザーの公開投稿です。性能比較の根拠には使用しません。",
        tone: "good",
        autoload: true,
        compact: true,
      },
    ],
  ),
  make(
    "toshiba-er-d3000b-vs-aladdin-agt-g13b",
    "電子レンジ・オーブンレンジ",
    "東芝・日本エー・アイ・シー",
    "石窯ドーム ER-D3000B",
    "Aladdin グラファイト グリル&トースター 4枚焼き",
    "庫内サイズとオーブン機能を確認",
    "トースト枚数と加熱方式を確認",
    "https://www.toshiba-lifestyle.com/jp/microwave/",
  ),
  make(
    "zojirushi-nx-ab10-vs-nw-wd10",
    "炊飯器",
    "象印",
    "炎舞炊き NX-AB10",
    "豪熱大火力 NW-WD10",
    "炊飯方式と炊き分けを確認",
    "炊飯方式と炊き分けを確認",
    "https://www.zojirushi.co.jp/syohin/ricecooker/",
  ),
  make(
    "hitachi-ras-aj2226s-vs-daikin-s406atep",
    "エアコン・クーラー",
    "日立・ダイキン",
    "白くまくん RAS-AJ2226S",
    "S406ATEP-W",
    "適用畳数と設置条件を確認",
    "適用畳数と設置条件を確認",
    "https://kadenfan.hitachi.co.jp/ra/",
  ),
  make(
    "sony-wh-1000xm6-vs-airpods-max",
    "イヤホン・ヘッドホン",
    "SONY・Apple",
    "WH-1000XM6",
    "AirPods Max",
    "ノイズキャンセリングと接続先を確認",
    "Apple製品との連携と装着感を確認",
    "https://www.sony.jp/headphone/",
  ),
  make(
    "switch-2-vs-switch-2-zelda",
    "ゲーム機本体",
    "任天堂",
    "Nintendo Switch 2 BEE-S-KB6CA",
    "Nintendo Switch 2 ゼルダの伝説 40周年 BEE-S-KL6CC",
    "本体仕様と付属品を確認",
    "本体仕様と限定同梱物を確認",
    "https://www.nintendo.com/jp/hardware/switch2/",
  ),
  make(
    "panasonic-eh-na0k-vs-panasonic-eh-na9m",
    "ヘアドライヤー",
    "パナソニック",
    "ナノケア EH-NA0K",
    "ナノケア EH-NA9M",
    "ケア機能と風量を確認",
    "ケア機能と風量を確認",
    "https://panasonic.jp/hair/",
  ),
];
