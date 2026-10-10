import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { PUBLISHED_ARTICLE_PAGE_SLUGS } from "../config/article-template-policy.mjs";

/**
 * docs/article-backlog.md の公開済み表と本数が PUBLISHED_ARTICLE_PAGE_SLUGS と一致すること。
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const backlog = readFileSync(
  path.join(root, "docs", "article-backlog.md"),
  "utf8",
);

describe("article backlog sync", () => {
  it("lists exactly the published slugs in the published table", () => {
    const section =
      backlog.split(/^## 現在の公開済み/m)[1]?.split(/^## /m)[0] ?? "";
    const listed = [
      ...section.matchAll(/^\| `([^`]+)`\s*\| 公開済み\s*\|/gm),
    ].map((match) => match[1]);
    expect(new Set(listed).size).toBe(listed.length);
    expect(listed.sort()).toEqual([...PUBLISHED_ARTICLE_PAGE_SLUGS].sort());
  });

  it("states the correct published count in the heading", () => {
    const heading = backlog.match(/^## 現在の公開済み（(\d+)本）/m);
    expect(heading?.[1]).toBe(String(PUBLISHED_ARTICLE_PAGE_SLUGS.size));
  });
});
