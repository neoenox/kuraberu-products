import { describe, expect, it } from "vitest";
import { ARTICLE_LAYOUT } from "../config/article-layout.mjs";
import { articleMetadata } from "../src/content/articles";
import {
  findUnusedBrandTags,
  scoreArticleRelevance,
  selectRelatedArticles,
  type RelatedSelectionOptions,
} from "../src/lib/related-articles";

// 各テストで意図した信号だけが一致するよう、base はどの記事とも重ならない値にする。
const base = {
  path: "/articles/a/",
  category: "育児用品",
  tags: ["タグA"],
  audiences: ["対象者A"],
  uses: ["用途A"],
  publishedAt: "2026-08-01",
} as const;

const options: RelatedSelectionOptions = {
  limit: 4,
  othersLimit: 3,
  minScore: 1,
  weights: { tag: 3, use: 2, audience: 2, category: 1 },
  brandTagWeight: 1,
  brandTags: ["パナソニック"],
};

describe("scoreArticleRelevance", () => {
  // 両引数で一致させたい信号だけが重なるよう、各テストで明示的に排他値を渡す。
  const other = {
    tags: ["タグB"],
    audiences: ["対象者B"],
    uses: ["用途B"],
  };

  it("scores a shared product-type tag highest", () => {
    expect(
      scoreArticleRelevance(
        { ...base, tags: ["紙おむつ"] },
        { ...base, ...other, tags: ["紙おむつ", "メリーズ"] },
        options,
      ),
    ).toBe(4); // tag 3 + category 1
  });

  it("treats a brand tag as a weak signal", () => {
    expect(
      scoreArticleRelevance(
        { ...base, tags: ["パナソニック"] },
        { ...base, ...other, tags: ["パナソニック"] },
        options,
      ),
    ).toBe(2); // brandTag 1 + category 1
  });

  it("scores shared uses and audiences", () => {
    expect(
      scoreArticleRelevance(
        { ...base, uses: ["毎日使う"], audiences: ["新生児の保護者"] },
        {
          ...base,
          ...other,
          uses: ["毎日使う"],
          audiences: ["新生児の保護者"],
        },
        options,
      ),
    ).toBe(5); // use 2 + audience 2 + category 1
  });

  it("scores only the same category", () => {
    expect(
      scoreArticleRelevance({ ...base }, { ...base, ...other }, options),
    ).toBe(1);
  });

  it("scores zero with no overlap", () => {
    expect(
      scoreArticleRelevance(
        { ...base },
        { ...base, category: "美容家電", ...other },
        options,
      ),
    ).toBe(0);
  });
});

describe("selectRelatedArticles", () => {
  const articles = [
    { ...base, path: "/articles/a/" },
    {
      ...base,
      path: "/articles/b/",
      tags: ["紙おむつ", "メリーズ"],
    },
    {
      ...base,
      path: "/articles/c/",
      tags: ["ドライヤー"],
      category: "美容家電",
    },
    { ...base, path: "/articles/d/", tags: ["水筒"], category: "生活雑貨" },
  ];

  it("excludes the current article and orders by score", () => {
    const { related, others } = selectRelatedArticles(
      articles,
      "/articles/a/",
      "育児用品",
      options,
    );
    expect(related.map((article) => article.path)).toEqual([
      "/articles/b/", // tag 3 + category 1 = 4
      "/articles/c/", // category 1
      "/articles/d/", // category 1
    ]);
    expect(others).toEqual([]);
    expect(related.some((article) => article.path === "/articles/a/")).toBe(
      false,
    );
  });

  it("caps related and others by the configured limits", () => {
    const many = Array.from({ length: 10 }, (_, index) => ({
      ...base,
      path: `/articles/x${index}/`,
      tags: ["紙おむつ"],
    }));
    const { related, others } = selectRelatedArticles(
      many,
      "/articles/x0/",
      "育児用品",
      options,
    );
    expect(related).toHaveLength(options.limit);
    expect(others).toHaveLength(options.othersLimit);
  });

  it("falls back to category selection when the current page has no metadata", () => {
    const { related, others } = selectRelatedArticles(
      articles,
      "/tools/product-finder/育児用品/",
      "育児用品",
      options,
    );
    // a と b は 育児用品、c/d は他カテゴリ
    expect(related.map((article) => article.path)).toEqual([
      "/articles/a/",
      "/articles/b/",
    ]);
    expect(others.map((article) => article.path)).toEqual([
      "/articles/c/",
      "/articles/d/",
    ]);
  });

  it("prefers a product-type match over a brand-only match", () => {
    const current = {
      ...base,
      path: "/articles/kx/",
      tags: ["ベビーモニター"],
    };
    const productType = {
      ...base,
      path: "/articles/bed/",
      tags: ["ベビーベッド"],
    };
    const brandOnly = {
      ...base,
      path: "/articles/dryer/",
      tags: ["パナソニック"],
      category: "美容家電",
    };
    const { related } = selectRelatedArticles(
      [current, productType, brandOnly],
      current.path,
      "育児用品",
      options,
    );
    // ベビーベッド: tag 3 + category 1 = 4 > パナソニック: brand 1
    expect(related[0].path).toBe("/articles/bed/");
  });

  it("breaks ties by preferring the same category over a brand-only match", () => {
    const current = {
      ...base,
      path: "/articles/kx/",
      tags: ["ベビーモニター"],
    };
    const sameCategory = {
      ...base,
      path: "/articles/diaper/",
      tags: ["紙おむつ"],
      publishedAt: "2026-07-01", // 古いが同カテゴリ
    };
    const brandOnly = {
      ...base,
      path: "/articles/dryer/",
      tags: ["パナソニック"],
      category: "美容家電",
      publishedAt: "2026-08-17", // 新しいが他カテゴリ
    };
    const { related } = selectRelatedArticles(
      [current, sameCategory, brandOnly],
      current.path,
      "育児用品",
      options,
    );
    // 両方 score=1 のとき、同カテゴリ（紙おむつ）がブランド一致（パナソニック）より先
    expect(related[0].path).toBe("/articles/diaper/");
  });
});

describe("real article data", () => {
  it("keeps every article within the configured limits", () => {
    for (const current of articleMetadata) {
      const { related, others } = selectRelatedArticles(
        articleMetadata,
        current.path,
        current.category,
      );
      expect(related.length, current.path).toBeLessThanOrEqual(
        ARTICLE_LAYOUT.relatedSelection.limit,
      );
      expect(others.length, current.path).toBeLessThanOrEqual(
        ARTICLE_LAYOUT.relatedSelection.othersLimit,
      );
      const paths = new Set([
        ...related.map((article) => article.path),
        ...others.map((article) => article.path),
      ]);
      expect(paths.has(current.path), current.path).toBe(false);
    }
  });

  it("keeps the brandTags list in sync with the articles", () => {
    expect(findUnusedBrandTags(articleMetadata)).toEqual([]);
  });

  it("ranks a brand-tag-only match below any same-category article (no brand-only noise)", () => {
    // ブランド名タグだけの一致（弱信号）は、同カテゴリの記事より上に来ない。
    // 現行の記事群では、育児用品はベビーモニター1本だけなので、実データでは
    // 同カテゴリの関連記事が存在しない。そのため合成データで規則そのものを確かめる。
    const current = {
      path: "/articles/current/",
      category: "育児用品",
      tags: ["パナソニック", "見守り"],
      audiences: ["保護者"],
      uses: ["見守り"],
      publishedAt: "2026-08-01",
    };
    const sameCategory = {
      path: "/articles/same-category/",
      category: "育児用品",
      tags: ["その他"],
      audiences: ["その他"],
      uses: ["その他"],
      publishedAt: "2026-07-01",
    };
    const brandOnly = {
      path: "/articles/brand-only/",
      category: "生活家電",
      tags: ["パナソニック"],
      audiences: ["その他2"],
      uses: ["その他2"],
      publishedAt: "2026-09-01",
    };
    const { related } = selectRelatedArticles(
      [current, brandOnly, sameCategory],
      current.path,
      current.category,
    );
    const paths = related.map((article) => article.path);
    expect(paths.indexOf(sameCategory.path)).toBeLessThan(
      paths.indexOf(brandOnly.path),
    );
  });
});
