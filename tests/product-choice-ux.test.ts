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
      expect(html.indexOf('id="key-differences"')).toBeLessThan(
        html.indexOf('id="next-step"'),
      );
    });
    it("keeps the follow-up UX improvements present in rendered output", () => {
      const article = parse(
        readFileSync(
          "dist/articles/instax-mini-13-vs-mini-41/index.html",
          "utf8",
        ),
      );
      const top = parse(readFileSync("dist/index.html", "utf8"));

      // #960: short intro first, full background remains available.
      expect(
        article.querySelector(".lead")?.textContent.trim().length,
      ).toBeGreaterThan(0);
      expect(
        article.querySelector("details.article-introduction"),
      ).not.toBeNull();

      // #963: every top price guide carries a checked-at marker and stale-state text.
      const guideCards = top.querySelectorAll(".guide-card");
      expect(guideCards.length).toBeGreaterThan(0);
      for (const card of guideCards) {
        expect(card.querySelector("[data-price-check]")).not.toBeNull();
        expect(card.textContent).toContain(
          "現在の価格は購入先で確認してください",
        );
      }

      // #964: supported instax comparison exposes both consumable guides.
      expect(article.textContent).toContain("使用するフィルムの費用も確認する");
      expect(
        article.querySelector('a[href="/guides/instax-mini-film-price/"]'),
      ).not.toBeNull();
      expect(
        article.querySelector('a[href="/guides/instax-mini-pattern-film-price/"]'),
      ).not.toBeNull();
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
