import { manualArticleSeeds } from "./manual-seeds";

/**
 * manual-seeds.ts is generated legacy content. Keep crawl-discovered corrections here
 * so regenerating the seed file cannot silently restore stale FAQ/prose values.
 */
const bouncer = manualArticleSeeds.find((seed) => seed.id === "babybjorn-bouncer");
if (bouncer) {
  Object.assign(bouncer, {
    faqEntries: bouncer.faqEntries?.map((entry) => {
      if (entry.question === "Blissとバランスソフトの価格はいくら？") {
        return {
          ...entry,
          answer:
            "2026-09-09確認時点の公式ショップ価格は、Bliss・バランスソフトとも29,700円〜（カラー・素材により変動）です。価格・在庫・キャンペーンは変動するため、購入時点の販売ページで確認してください。",
        };
      }
      if (entry.question === "Blissとバランスソフトの保証は？") {
        return {
          ...entry,
          answer:
            "2026-09-09に公式情報を再確認した時点では、両モデルとも10年保証（正規保証1年＋ユーザー登録9年）です。保証条件は変更される可能性があるため、購入時点の公式案内も確認してください。",
        };
      }
      return entry;
    }),
    officialProse: bouncer.officialProse?.map((section) => ({
      ...section,
      items: section.items.map((item) =>
        item.includes("2年保証（公式楽天市場店の案内）")
          ? item.replace(
              "2年保証（公式楽天市場店の案内）",
              "10年保証（正規保証1年＋ユーザー登録9年、2026-09-09確認）",
            )
          : item,
      ),
    })),
    disclaimer:
      "この記事の価格・保証は2026年9月9日に公式情報を再確認した内容へ統一しています。価格・在庫・カラー・保証条件は変更される可能性があるため、購入時点の公式ページと販売ページを確認してください。",
  });
}

const cradle = manualArticleSeeds.find((seed) => seed.id === "babybjorn-cradle");
if (cradle) {
  Object.assign(cradle, {
    faqEntries: cradle.faqEntries?.map((entry) =>
      entry.question === "クレードルとココネルエアーの価格はいくら？"
        ? {
            ...entry,
            answer:
              "2026-09-09確認時点の公式ショップ価格は、ベビービョルン クレードルが49,500円（送料無料）、アップリカ ココネルエアー ABが29,700円です。価格・在庫・キャンペーンは変動するため、購入時点の販売ページで確認してください。",
          }
        : entry,
    ),
    officialProse: cradle.officialProse?.map((section) => ({
      ...section,
      items: section.items.map((item) =>
        item === "2026-08-10時点の公式楽天市場店の表示価格は49,500円（送料無料）。"
          ? "2026-09-09確認時点の公式ショップ価格は49,500円（送料無料）。"
          : item === "2026-08-10時点のアップリカ公式楽天市場店の表示価格は29,700円。"
            ? "2026-09-09確認時点の公式ショップ価格は29,700円。"
            : item,
      ),
    })),
    disclaimer:
      "この記事の価格は2026年9月9日に公式ショップで再確認した内容へ統一しています。価格・在庫・送料・セット内容は変更される可能性があるため、購入時点の販売ページを確認してください。ベビーベッドの安全性と正しい使用方法は各メーカーの公式ページ・使用説明書で確認してください。",
  });
}
