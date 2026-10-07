import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  collectPriceGuides,
  collectPricedArticles,
  findStalePricedArticles,
  renderReport,
} from "../scripts/check-price-freshness.mjs";

describe("price freshness", () => {
  it("collects only published, non-draft commercial seeds that mention prices", () => {
    const root = mkdtempSync(join(tmpdir(), "price-freshness-"));
    try {
      const dir = join(root, "src", "content", "articles", "commercial");
      mkdirSync(dir, { recursive: true });
      const seed = (id: string, extra: string, body: string) =>
        `export const s = {\n  id: "${id}",\n  ${extra}\n  handoffManifestId: "${id}-x",\n  productInfoCheckedAt: "2026-09-01",\n  summary: "${body}",\n};\n`;
      writeFileSync(join(dir, "priced.ts"), seed("priced", "", "49,990円"));
      writeFileSync(join(dir, "no-price.ts"), seed("no-price", "", "仕様のみ"));
      writeFileSync(
        join(dir, "draft.ts"),
        seed("draft", "draft: true,", "1,000円"),
      );
      writeFileSync(join(dir, "unlisted.ts"), seed("unlisted", "", "2,000円"));
      writeFileSync(join(dir, "seeds.ts"), 'export const ids = ["priced"];');

      expect(
        collectPricedArticles({
          root,
          isPublished: (path: string) => path !== "/articles/unlisted/",
        }),
      ).toEqual([{ id: "priced", checkedAt: "2026-09-01", priceMentions: 1 }]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("collects price guides from src/data/*-prices.ts with their check dates", () => {
    const root = mkdtempSync(join(tmpdir(), "price-guides-"));
    try {
      const dir = join(root, "src", "data");
      mkdirSync(dir, { recursive: true });
      writeFileSync(
        join(dir, "sd-card-prices.ts"),
        `export const SD_CARD_CHECKED_AT = "2026-09-30";
export const o = [{ price: 1200 }, { price: 3400 }];
`,
      );
      writeFileSync(
        join(dir, "undated-prices.ts"),
        `export const o = [{ price: 500 }];
`,
      );
      writeFileSync(
        join(dir, "other.ts"),
        'export const X_CHECKED_AT = "2026-01-01";',
      );

      expect(collectPriceGuides({ root })).toEqual([
        {
          id: "guide:sd-card-prices",
          checkedAt: "2026-09-30",
          priceMentions: 2,
        },
        { id: "guide:undated-prices", checkedAt: null, priceMentions: 1 },
      ]);
      const stale = findStalePricedArticles(
        collectPriceGuides({ root }),
        "2026-11-05",
        30,
      );
      expect(stale.map((guide: { id: string }) => guide.id)).toEqual([
        "guide:undated-prices",
        "guide:sd-card-prices",
      ]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("reports articles older than the threshold and those without a check date", () => {
    const stale = findStalePricedArticles(
      [
        { id: "fresh", checkedAt: "2026-09-20", priceMentions: 2 },
        { id: "boundary", checkedAt: "2026-09-05", priceMentions: 1 },
        { id: "old", checkedAt: "2026-08-01", priceMentions: 3 },
        { id: "undated", checkedAt: null, priceMentions: 1 },
      ],
      "2026-10-05",
      30,
    );
    // 30日ちょうど（2026-09-05）は対象外。確認日がない記事は最優先で報告する。
    expect(
      stale.map((article: { id: string; ageDays: number | null }) => [
        article.id,
        article.ageDays,
      ]),
    ).toEqual([
      ["undated", null],
      ["old", 65],
    ]);
    const report = renderReport(stale, "2026-10-05", 30);
    expect(report).toContain("| `old` | 2026-08-01 | 65 | 3 |");
    expect(report).toContain("| `undated` | 未記載 | - | 1 |");
  });

  it("renders a no-op report when nothing is stale", () => {
    expect(renderReport([], "2026-10-05", 30)).toContain("対象はありません。");
  });
});
