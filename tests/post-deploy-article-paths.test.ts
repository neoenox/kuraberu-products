import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PUBLISHED_ARTICLE_PAGE_SLUGS } from "../config/article-template-policy.mjs";

// The post-deploy verifier probes a fixed set of representative article paths.
// Those paths must be served pages: if a slug is not a published article page,
// the production build prunes it (#1088) and the verifier reads a stale/absent
// page, failing an otherwise valid deployment.
const verifierSource = readFileSync(
  "tools/production/Invoke-PostDeployVerification.ps1",
  "utf8",
);

function representativeArticleSlugs(): string[] {
  const block = verifierSource.match(/\$ArticlePaths\s*=\s*@\(([\s\S]*?)\)/);
  if (!block) {
    throw new Error("$ArticlePaths default block not found in verifier");
  }
  return [...block[1].matchAll(/'\/articles\/([^/']+)\/'/g)].map(
    (match) => match[1],
  );
}

describe("post-deploy verifier representative articles (#1088)", () => {
  it("declares at least one representative article path", () => {
    expect(representativeArticleSlugs().length).toBeGreaterThan(0);
  });

  it("only probes slugs that are published article pages", () => {
    const slugs = representativeArticleSlugs();
    const unpublished = slugs.filter(
      (slug) => !PUBLISHED_ARTICLE_PAGE_SLUGS.has(slug),
    );
    expect(unpublished).toEqual([]);
  });
});
