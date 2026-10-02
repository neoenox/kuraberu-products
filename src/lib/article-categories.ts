/** 商品種類と既存URLを保持したまま探索用の大分類を統一する。 */
const groups: Readonly<Record<string, readonly string[]>> = {
  オーディオ: [
    "オーディオ",
    "イヤホン・ヘッドホン",
    "完全ワイヤレスイヤホン",
    "ワイヤレスイヤホン",
    "オープンイヤー完全ワイヤレスイヤホン",
    "スピーカー・オーディオ",
  ],
  カメラ: ["インスタントカメラ", "Vlogカメラ"],
  "PC・デジタル機器": [
    "PC周辺機器",
    "Wi-Fiルーター",
    "ゲーミングマウス",
    "ワイヤレスマウス",
    "デスク用品",
    "ポータブルSSD",
    "電子書籍リーダー",
    "スマート機器",
    "ウェアラブル",
    "ランニングウォッチ",
  ],
  充電用品: ["モバイルバッテリー", "USB急速充電器"],
  "収納・生活用品": [
    "インテリア・収納",
    "キッチン・ごみ箱収納",
    "キッチン収納",
    "キッチン用品",
    "ランドリー用品",
    "収納用品",
    "寝具",
    "掃除・収納",
    "日用品",
    "生活雑貨",
    "衣類ケア",
  ],
  "美容・健康": ["美容・健康", "美容家電", "健康家電"],
  "趣味・お出かけ": ["バッグ", "ホビー・手芸", "旅行用品", "楽器", "自転車"],
  育児用品: ["育児用品", "チャイルドシート"],
};
export function categoryGroup(category: string): string {
  return (
    Object.entries(groups).find(([, members]) =>
      members.includes(category),
    )?.[0] ?? category
  );
}
export function categoryMembers(
  group: string,
  categories: readonly string[],
): string[] {
  return categories.filter((category) => categoryGroup(category) === group);
}
