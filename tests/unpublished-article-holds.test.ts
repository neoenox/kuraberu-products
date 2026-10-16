import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { commercialArticleSeeds } from "../src/content/articles/commercial";
import { PUBLISHED_ARTICLE_PAGE_SLUGS } from "../config/article-template-policy.mjs";
import {
  UNPUBLISHED_HOLD_GROUPS,
  holdGroupFor,
} from "../config/unpublished-article-holds.mjs";

/**
 * 未公開の商業記事シードは必ず保留台帳に載り、見直し期限を過ぎてはならない（Refs #1060）。
 * 期限切れ時は、公開（品質ゲート通過）か削除かを決めて台帳を更新する。
 *
 * 配信契約（方針A, #1088 / #1154）: 未公開の記事URLはビルドから除去されるため、
 * public/_redirects に `/articles/<slug>/* → /404.html 302` が無いと
 * 到達可能なURLが残る（＝配信停止が実効化されない）。
 */
const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const unpublishedIds = commercialArticleSeeds
  .map((seed) => seed.id)
  .filter((id) => !PUBLISHED_ARTICLE_PAGE_SLUGS.has(id));

/** public/_redirects の「/articles/<slug>/* → /404.html 302」からスラグを抽出。 */
function redirectedArticleSlugs(): Set<string> {
  const content = readFileSync(
    path.join(repoRoot, "public", "_redirects"),
    "utf8",
  );
  return new Set(
    [
      ...content.matchAll(
        /^\/articles\/([a-z0-9-]+)\/\*\s+\/404\.html\s+302\s*$/gm,
      ),
    ].map((match) => match[1]),
  );
}

describe("unpublished article holds", () => {
  it("has exactly one default group and complete metadata", () => {
    expect(UNPUBLISHED_HOLD_GROUPS.filter((g) => g.default)).toHaveLength(1);
    for (const group of UNPUBLISHED_HOLD_GROUPS) {
      expect(group.reason.length).toBeGreaterThan(0);
      expect(group.releaseCondition.length).toBeGreaterThan(0);
      expect(group.reviewBy).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("does not list published or unknown slugs as held", () => {
    const known = new Set(commercialArticleSeeds.map((seed) => seed.id));
    for (const group of UNPUBLISHED_HOLD_GROUPS) {
      for (const slug of group.slugs) {
        expect(known.has(slug), `${slug} is not a seed`).toBe(true);
        expect(
          PUBLISHED_ARTICLE_PAGE_SLUGS.has(slug),
          `${slug} is published; remove it from holds`,
        ).toBe(false);
      }
    }
  });

  it("has no slug in more than one group", () => {
    const seen = new Set<string>();
    for (const group of UNPUBLISHED_HOLD_GROUPS) {
      for (const slug of group.slugs) {
        expect(seen.has(slug), `${slug} is in multiple groups`).toBe(false);
        seen.add(slug);
      }
    }
  });

  it("has no unpublished article past its review deadline", () => {
    const today = new Date().toISOString().slice(0, 10);
    const overdue = unpublishedIds
      .map((id) => ({ id, group: holdGroupFor(id) }))
      .filter(({ group }) => group.reviewBy < today)
      .map(
        ({ id, group }) => `${id} (${group.id}, reviewBy ${group.reviewBy})`,
      );
    expect(overdue).toEqual([]);
  });

  it("redirects every unpublished article URL away from the build (#1088)", () => {
    const redirected = redirectedArticleSlugs();
    const undelivered = unpublishedIds.filter((id) => !redirected.has(id));
    expect(undelivered).toEqual([]);
  });

  it("keeps ledger slugs covered by the delivery stop", () => {
    const redirected = redirectedArticleSlugs();
    for (const group of UNPUBLISHED_HOLD_GROUPS) {
      for (const slug of group.slugs) {
        expect(
          PUBLISHED_ARTICLE_PAGE_SLUGS.has(slug),
          `${slug} is published; remove it from holds`,
        ).toBe(false);
        expect(
          redirected.has(slug),
          `${slug} must be redirected (302 -> /404.html)`,
        ).toBe(true);
      }
    }
  });
});
