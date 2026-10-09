import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { publishedArticleMetadata } from "../src/content/articles";
import { daysSinceCheck, isContentStale } from "../src/lib/content-freshness";

const echoDotArticle = publishedArticleMetadata.find(
  (article) => article.id === "amazon-echo-dot-max-vs-echo-dot-5th",
)!;

describe("content freshness", () => {
  it("uses calendar dates without negative ages", () => {
    expect(daysSinceCheck("2026-07-31", "2026-08-05")).toBe(5);
    expect(daysSinceCheck("2026-08-05", "2026-07-31")).toBe(0);
  });

  it("treats missing and old checks as stale", () => {
    expect(isContentStale(undefined, "2026-08-05")).toBe(true);
    expect(isContentStale("2026-01-01", "2026-08-05", 180)).toBe(true);
    expect(isContentStale("2026-07-31", "2026-08-05", 180)).toBe(false);
  });

  it("keeps product-info and purchase-link check dates separate", () => {
    expect(echoDotArticle.productInfoCheckedAt).toBe("2026-10-08");
    expect(echoDotArticle.purchaseLinkStatus).toBe("verified");
    expect(echoDotArticle.purchaseLinksCheckedAt).toBe("2026-10-08");
  });
});

// 実ビルド（astro build）後の dist を検証する。dist が無い環境では
// 理由をログに出して明示的にスキップする。
const hasDist = existsSync("dist");
if (!hasDist) {
  console.warn(
    "skip: dist/ が存在しないため content freshness の実ビルド整合テストをスキップしました（astro build 後に再実行してください）",
  );
}

describe.skipIf(!hasDist)("content freshness (rendered dist)", () => {
  it("renders factual check dates and update history", () => {
    const html = readFileSync(
      "dist/articles/amazon-echo-dot-max-vs-echo-dot-5th/index.html",
      "utf8",
    );
    // v3 短縮で verification-summary（商品情報確認日）は廃止。
    // 確認日は冒頭の TrustLine（✓ 公式確認済み（日付）・広告を含みます）と
    // 情報源一覧で表示する。
    expect(html).toContain("✓ 公式確認済み（2026-10-08）");
    expect(html).toContain('datetime="2026-10-08"');
    expect(html).toContain("2026-10-08確認");
    expect(html).not.toContain("最終確認日は未記録");
    expect(html).not.toContain("購入リンク：未確認");
    expect(html).toContain("更新履歴");
    expect(html).toContain("公式仕様の比較表を更新");
    expect(html).toContain("価格・在庫は変動するため");
  });

  it("does not leak bottle-only specs into other article pages", () => {
    const articlesDir = "dist/articles";
    const articleDirs = readdirSync(articlesDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .filter((entry) => !"page category".includes(entry.name))
      .map((entry) => entry.name);
    const bottleOnlyTerms = ["容量0.5L", "保温効力68℃以上"];

    for (const slug of articleDirs) {
      const html = readFileSync(join(articlesDir, slug, "index.html"), "utf8");
      for (const term of bottleOnlyTerms) {
        expect(html, `${slug} contains ${term}`).not.toContain(term);
      }
    }
  });
});
