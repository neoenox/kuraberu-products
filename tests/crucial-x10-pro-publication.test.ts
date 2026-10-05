import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PUBLISHED_ARTICLE_PAGE_SLUGS } from "../config/article-template-policy.mjs";
import {
  publicArticleMetadata,
  publishedArticleMetadata,
} from "../src/content/articles";
import { commercialArticleSeeds } from "../src/content/articles/commercial";

const articleId = "crucial-x10-pro-vs-kingston-xs2000";

describe("Crucial X10 Pro vs Kingston XS2000 publication", () => {
  it("is published only after article readiness and verified purchase destinations", () => {
    const seed = commercialArticleSeeds.find((item) => item.id === articleId);
    const manifest = JSON.parse(
      readFileSync(
        "docs/article-handoffs/crucial-x10-pro-vs-kingston-xs2000-2026-09-27.json",
        "utf8",
      ),
    );

    expect(seed?.draft).not.toBe(true);
    expect(manifest.articleReady).toBe(true);
    expect(manifest.social.status).toBe("none");
    expect(manifest.amazon.statusBySide.left).toBe("search");
    expect(seed?.leftAmazonLinkStatus).toBe("search");
    expect(manifest.amazon.statusBySide.right).toBe("verified");
    // 2026-10-04: Kingston XS2000 は楽天の出品がすべて在庫切れのため楽天CTAだけを外した。
    expect(manifest.rakuten.statusBySide).toEqual({
      left: "verified",
      right: "unavailable",
    });
    expect(seed?.rightRakutenUrl).toBeNull();
    expect(seed?.rightAmazonUrl).toMatch(/^https:\/\/www\.amazon\.co\.jp\//);
    expect(
      publicArticleMetadata.find((article) => article.id === articleId)
        ?.rakutenUnavailableSides,
    ).toEqual(["right"]);
    expect(PUBLISHED_ARTICLE_PAGE_SLUGS.has(articleId)).toBe(true);
    expect(
      publicArticleMetadata.some((article) => article.id === articleId),
    ).toBe(true);
    expect(
      publishedArticleMetadata.some((article) => article.id === articleId),
    ).toBe(true);
  });

  it("allows both official image CDNs in production img-src policy", () => {
    const headers = readFileSync("public/_headers", "utf8");
    const imgSrc = headers.match(/img-src[^;]*/)?.[0] ?? "";

    expect(imgSrc).toContain("https://assets.micron.com");
    expect(imgSrc).toContain("https://media.kingston.com");
  });
});
