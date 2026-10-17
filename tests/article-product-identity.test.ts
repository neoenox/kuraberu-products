import { describe, expect, it } from "vitest";
import { commercialArticleSeeds } from "../src/content/articles/commercial";
import { CUSTOM_ARTICLE_PAGE_SLUGS } from "../config/article-template-policy.mjs";
import {
  findCommercialSeedRegistryDrift,
  loadRegistryEntries,
} from "../scripts/check-purchase-link-consistency.mjs";

type Seed = (typeof commercialArticleSeeds)[number];

/** Amazon 商品URL から ASIN を抽出する（見つからなければ null）。 */
function asinOf(url: string | null | undefined): string | null {
  if (!url) return null;
  return /(B[0-9A-Z]{9})/.exec(url)?.[1] ?? null;
}

/** 記事側で実際に使われる Amazon 販売先状態（商品ごとの指定が販売先全体の指定に優先）。 */
function effectiveAmazonStatus(seed: Seed, side: "left" | "right") {
  const perSide =
    side === "left" ? seed.leftAmazonLinkStatus : seed.rightAmazonLinkStatus;
  return perSide ?? seed.amazonLinkStatus ?? null;
}

/**
 * 商品の同一性レコード（同一 ASIN が複数記事に出るケース）を集める。
 * 商品マスタ（#1064 Phase 2）導入までの暫定ガード（Phase 1）。
 */
function amazonOccurrences() {
  const occurrences: {
    id: string;
    side: "left" | "right";
    asin: string;
    status: ReturnType<typeof effectiveAmazonStatus>;
  }[] = [];
  for (const seed of commercialArticleSeeds) {
    for (const side of ["left", "right"] as const) {
      const asin = asinOf(
        side === "left" ? seed.leftAmazonUrl : seed.rightAmazonUrl,
      );
      if (!asin) continue;
      occurrences.push({
        id: seed.id,
        side,
        asin,
        status: effectiveAmazonStatus(seed, side),
      });
    }
  }
  return occurrences;
}

describe("同一商品が複数記事に出る場合の Amazon 販売先状態", () => {
  it("同じ ASIN は記事をまたいで同じ状態で扱われる", () => {
    const byAsin = new Map<string, ReturnType<typeof amazonOccurrences>>();
    for (const occurrence of amazonOccurrences()) {
      const list = byAsin.get(occurrence.asin) ?? [];
      list.push(occurrence);
      byAsin.set(occurrence.asin, list);
    }
    const shared = [...byAsin.entries()].filter(
      ([, list]) => new Set(list.map((item) => item.id)).size > 1,
    );
    // 共有商品が0件になったら検査が空振りするため、対象の存在自体を固定する。
    expect(shared.length).toBeGreaterThan(0);
    for (const [asin, list] of shared) {
      const detail = list
        .map((item) => `${item.id}:${item.side}=${item.status}`)
        .join(", ");
      expect(
        new Set(list.map((item) => item.status)).size,
        `ASIN ${asin} の Amazon 状態が記事間で不一致: ${detail}`,
      ).toBe(1);
    }
  });
});

describe("購入URLレジストリの孤児検出", () => {
  const seedIds = new Set(commercialArticleSeeds.map((seed) => seed.id));
  const registryIds = [
    ...new Set(
      [...loadRegistryEntries("src").keys()].map((key) => key.split(":")[0]),
    ),
  ];

  it("レジストリの全項目が記事シードか専用ページに対応している", () => {
    // 検査対象が消えたら空振りするため、レジストリが空でないことを固定する。
    expect(registryIds.length).toBeGreaterThan(0);
    for (const id of registryIds) {
      const covered = seedIds.has(id) || CUSTOM_ARTICLE_PAGE_SLUGS.has(id);
      expect(
        covered,
        `${id}: 対応する記事シードも専用ページ（CUSTOM_ARTICLE_PAGE_SLUGS）も無い。記事を作るかレジストリから削除する`,
      ).toBe(true);
    }
  });
});

describe("商用記事の seed 楽天URL と registry の一致", () => {
  it("公開中の商用記事では registry が seed に一致している", () => {
    expect(findCommercialSeedRegistryDrift()).toEqual([]);
  });
});
