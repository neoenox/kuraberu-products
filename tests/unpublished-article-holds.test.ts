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
 */
const unpublishedIds = commercialArticleSeeds
  .map((seed) => seed.id)
  .filter((id) => !PUBLISHED_ARTICLE_PAGE_SLUGS.has(id));

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
});
