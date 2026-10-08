import { existsSync, readFileSync } from "node:fs";
import { parse } from "node-html-parser";
import { describe, expect, it } from "vitest";
import { categoryGroup, categoryMembers } from "../src/lib/article-categories";
import { matchesArticle } from "../src/lib/article-discovery";
import { publishedArticleMetadata } from "../src/content/articles";

describe("product choice UX", () => {
  it("finds every audio subtype through the shared parent without changing old categories", () => {
    for (const category of [
      "イヤホン・ヘッドホン",
      "完全ワイヤレスイヤホン",
      "ワイヤレスイヤホン",
    ]) {
      expect(categoryGroup(category)).toBe("オーディオ");
    }
    expect(categoryGroup("未分類の新商品")).toBe("未分類の新商品");
    const audio = publishedArticleMetadata.filter(
      (article) => categoryGroup(article.category) === "オーディオ",
    );
    expect(audio.length).toBeGreaterThan(1);
    for (const article of audio) {
      expect(
        matchesArticle(article, { query: "", category: "オーディオ" }),
      ).toBe(true);
      expect(
        matchesArticle(article, { query: "", category: article.category }),
      ).toBe(true);
    }
    expect(
      categoryMembers("オーディオ", ["完全ワイヤレスイヤホン", "キッチン家電"]),
    ).toEqual(["完全ワイヤレスイヤホン"]);
  });
});

describe.skipIf(!existsSync("dist"))(
  "product choice UX (rendered dist)",
  () => {
    it("keeps differences and common specifications accessible before shopping links", () => {
      const html = readFileSync(
        "dist/articles/instax-mini-13-vs-mini-41/index.html",
        "utf8",
      );
      const root = parse(html);
      const comparison = root.querySelector(".key-diffs")!;
      expect(
        comparison
          .querySelector(".key-diffs-list")!
          .querySelectorAll(".key-diff-row"),
      ).toHaveLength(3);
      const details = comparison.querySelector("details")!;
      expect(details.hasAttribute("open")).toBe(false);
      expect(details.textContent).toContain("使用フィルム・写真画面サイズ");
      expect(details.textContent).toContain("62mm×46mm");
      expect(details.querySelectorAll("dt").length).toBeGreaterThan(0);
      expect(html.indexOf('id="decision-guide"')).toBeLessThan(
        html.indexOf('id="key-differences"'),
      );
      // 購入リンクは記事末尾の「購入先」1か所だけ（結論直後の next-step 欄は出さない）。
      expect(html).not.toContain('id="next-step"');
      expect(html.indexOf('id="key-differences"')).toBeLessThan(
        html.indexOf('id="purchase"'),
      );
    });
    it("provides three real exploration links and preserves old category pages", () => {
      const top = parse(readFileSync("dist/index.html", "utf8"));
      expect(
        top
          .querySelectorAll(".top-entry-links a")
          .map((link) => link.getAttribute("href")),
      ).toEqual(["/articles/", "#guides", "/tools/product-finder/"]);
      for (const category of ["オーディオ", "完全ワイヤレスイヤホン"]) {
        const page = parse(
          readFileSync(`dist/articles/category/${category}/index.html`, "utf8"),
        );
        expect(
          page.querySelectorAll("[data-article-card]").length,
        ).toBeGreaterThan(0);
        expect(
          page
            .querySelector(`option[value="${category}"]`)!
            .hasAttribute("selected"),
        ).toBe(true);
      }
    });
  },
);
