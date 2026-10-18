import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { PUBLISHED_ARTICLE_PAGE_SLUGS } from "../config/article-template-policy.mjs";
import { commercialArticleSeeds } from "../src/content/articles/commercial";
import {
  buildProductMaster,
  deriveBrandLine,
  serializeMaster,
} from "../scripts/build-product-master.mjs";
import { checkProductMaster } from "../scripts/check-product-master.mjs";
import { validateProductMaster } from "../scripts/validators/product-master.mjs";

/**
 * 商品マスタ（#1064 Phase 1）の検証。
 * - catalog.json がスキーマ（docs/article-data-schema-plan.md §2.1）に一致する
 * - 生成スクリプトの出力がコミット済み catalog.json と一致する（再現可能）
 * - 公開53の全商品がマスタに存在し、Amazonの状態・URLが seed と突合できる
 * - 同一商品（4組）が1エントリに集約される
 * - 検証は fail-closed（不正データで必ずエラー、CLIは exit 1）
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(root, "src/data/products/catalog.json");
const catalogText = fs.readFileSync(catalogPath, "utf8");
const catalog = JSON.parse(catalogText);

const seedsById = new Map(
  commercialArticleSeeds.map((seed) => [seed.id, seed]),
);
const publishedSeeds = [...PUBLISHED_ARTICLE_PAGE_SLUGS].map((slug) => {
  const seed = seedsById.get(slug);
  if (!seed) throw new Error(`published seed not found: ${slug}`);
  return seed;
});

/** handoff台帳から products.left/right.model を引く（model は seed に無い）。 */
function loadHandoffs() {
  const dir = path.join(root, "docs/article-handoffs");
  const byArticle = new Map();
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
    if (data.articleId) byArticle.set(data.articleId, data);
  }
  return byArticle;
}
const handoffs = loadHandoffs();

const asinOf = (url: string | null | undefined) =>
  url ? (/(B[0-9A-Z]{9})/.exec(url)?.[1] ?? null) : null;

/** 商品マスタを ASIN / model / name で引ける索引にする。 */
function productIndex(products: (typeof catalog.products)[number][]) {
  const byAsin = new Map<string, (typeof catalog.products)[number]>();
  const byModel = new Map<string, (typeof catalog.products)[number]>();
  const byName = new Map<string, (typeof catalog.products)[number]>();
  for (const product of products) {
    if (product.id.startsWith("amazon-"))
      byAsin.set(product.id.slice(7).toUpperCase(), product);
    if (product.model) byModel.set(product.model, product);
    byName.set(product.name, product);
  }
  return { byAsin, byModel, byName };
}

const index = productIndex(catalog.products);

type Seed = (typeof publishedSeeds)[number];

/** seed の side に対応するマスタ商品を ASIN > model > name の優先で解決する。 */
function resolveSeedSide(seed: Seed, side: "left" | "right") {
  const url = side === "left" ? seed.leftAmazonUrl : seed.rightAmazonUrl;
  const name = side === "left" ? seed.leftProduct : seed.rightProduct;
  const model = handoffs.get(seed.id)?.products?.[side]?.model ?? null;
  const asin = asinOf(url);
  return (
    (asin ? index.byAsin.get(asin) : undefined) ??
    (model ? index.byModel.get(model) : undefined) ??
    index.byName.get(name) ??
    null
  );
}

function expectedAmazonStatus(seed: Seed, side: "left" | "right") {
  const perSide =
    side === "left" ? seed.leftAmazonLinkStatus : seed.rightAmazonLinkStatus;
  return perSide ?? seed.amazonLinkStatus ?? seed.purchaseLinkStatus ?? null;
}

describe("product master schema (#1064 Phase 1)", () => {
  it("catalog.json はスキーマ検証を通る", () => {
    expect(validateProductMaster(catalog)).toEqual([]);
    expect(catalog.products.length).toBeGreaterThan(0);
  });

  it("生成スクリプトの出力はコミット済み catalog.json と一致する（再現可能）", () => {
    const { master, errors } = buildProductMaster({ root });
    expect(errors).toEqual([]);
    expect(serializeMaster(master)).toBe(catalogText);
  });

  it("公開53の全商品がマスタに存在し、Amazonの状態・URLが seed と一致する", () => {
    let matched = 0;
    for (const seed of publishedSeeds) {
      for (const side of ["left", "right"] as const) {
        const product = resolveSeedSide(seed, side);
        expect(
          product,
          `${seed.id}:${side} is not covered by the master`,
        ).not.toBeNull();
        const expected = expectedAmazonStatus(seed, side);
        const actual = product!.sellers.amazon;
        expect(actual?.state, `${seed.id}:${side} amazon state`).toBe(
          expected === "unverified" ? "unavailable" : expected,
        );
        if (expected === "verified" || expected === "direct") {
          const url =
            side === "left" ? seed.leftAmazonUrl : seed.rightAmazonUrl;
          expect(actual, `${seed.id}:${side} amazon seller`).toMatchObject({
            state: expected,
            url,
          });
        } else if (expected === "search") {
          expect(
            (actual as { query?: string }).query?.trim().length,
          ).toBeGreaterThan(0);
        }
        matched += 1;
      }
    }
    expect(matched).toBe(publishedSeeds.length * 2);
  });

  it("同一商品（4組）が1エントリに集約される", () => {
    const groups: {
      key: string;
      build: (product: (typeof catalog.products)[number]) => boolean;
      articles: string[];
    }[] = [
      {
        key: "B0GV5VHTL6",
        build: (product) => product.id.includes("b0gv5vhtl6"),
        articles: [
          "kindle-paperwhite-vs-colorsoft",
          "kindle-vs-kindle-paperwhite",
        ],
      },
      {
        key: "B0DZ7WF87P",
        build: (product) => product.id.includes("b0dz7wf87p"),
        articles: ["ipad-a16-vs-ipad-air-m4", "ipad-mini-a17-pro-vs-ipad-a16"],
      },
      {
        key: "B0HGF5B9D8",
        build: (product) => product.id.includes("b0hgf5b9d8"),
        articles: [
          "zojirushi-ee-dg35-vs-ee-dg50",
          "zojirushi-ee-dg50-vs-ee-rv50",
        ],
      },
      {
        key: "WF-C710N (B0F3XFNHCW)",
        build: (product) => product.model === "WF-C710N",
        articles: [
          "sony-wf-c710n-vs-linkbuds-fit",
          "sony-wf-c710n-vs-soundcore-liberty-5",
        ],
      },
    ];
    for (const group of groups) {
      const matches = catalog.products.filter(group.build);
      expect(matches.length, `${group.key} should collapse to one entry`).toBe(
        1,
      );
      const resolved = group.articles.map((articleId) => {
        const seed = seedsById.get(articleId)!;
        const products = ["left", "right"]
          .map((side) => resolveSeedSide(seed, side as "left" | "right"))
          .filter((product) => product !== null);
        const match = products.find((product) => product!.id === matches[0].id);
        return match?.id ?? `${articleId}:unresolved`;
      });
      expect(
        new Set(resolved).size,
        `${group.key} articles should share one product`,
      ).toBe(1);
      expect(resolved[0]).toBe(matches[0].id);
    }
    expect(catalog.products.length).toBeLessThan(publishedSeeds.length * 2);
  });

  it("全商品で brand / line が導出できる", () => {
    for (const product of catalog.products) {
      expect(product.brand, `${product.id} brand`).toBeTruthy();
      expect(product.line, `${product.id} line`).toBeTruthy();
      expect(deriveBrandLine(product.name)).not.toBeNull();
    }
  });
});

describe("deriveBrandLine", () => {
  it("英字ブランドと日本語ブランドを既存UIの表記に合わせて解決する", () => {
    expect(deriveBrandLine("Apple iPhone 18 Pro 256GB")).toEqual({
      brand: "Apple",
      line: "iPhone 18 Pro 256GB",
    });
    expect(deriveBrandLine("11インチ iPad（A16） Wi-Fi 128GB")).toEqual({
      brand: "Apple",
      line: "iPad（A16） Wi-Fi 128GB",
    });
    expect(
      deriveBrandLine("Amazon Kindle Scribe 64GB グラファイト")?.brand,
    ).toBe("Amazon");
    expect(
      deriveBrandLine("Kindle Paperwhite 16GB 最新モデル（グラファイト）")
        ?.brand,
    ).toBe("Amazon");
    expect(
      deriveBrandLine("象印 スチーム式加湿器 EE-DG50 ホワイト（EE-DG50-WA）"),
    ).toEqual({
      brand: "象印",
      line: "スチーム式加湿器 EE-DG50 ホワイト（EE-DG50-WA）",
    });
    expect(deriveBrandLine("サードパーティ製の謎商品")).toBeNull();
  });
});

describe("validateProductMaster (fail-closed)", () => {
  const base = {
    version: 1,
    products: [
      {
        id: "amazon-b0hgf5b9d8",
        brand: "象印",
        line: "スチーム式加湿器 EE-DG50",
        name: "象印 スチーム式加湿器 EE-DG50",
        model: "EE-DG50",
        sellers: {
          amazon: {
            state: "verified",
            url: "https://www.amazon.co.jp/dp/B0HGF5B9D8",
            checkedAt: "2026-10-05",
          },
        },
        checkedAt: "2026-10-05",
      },
    ],
  };
  const clone = () => JSON.parse(JSON.stringify(base));
  const errorsOf = (mutate: (master: typeof base) => void) => {
    const master = clone();
    mutate(master);
    return validateProductMaster(master);
  };

  it("正常なマスタではエラーを返さない", () => {
    expect(validateProductMaster(base)).toEqual([]);
  });

  it("構造・id・重複・販売先状態の不正を検出する", () => {
    expect(validateProductMaster(null).length).toBeGreaterThan(0);
    expect(
      validateProductMaster({ version: 1, products: [] }).length,
    ).toBeGreaterThan(0);
    expect(
      errorsOf((m) => (m.products[0].id = "bad id")).length,
    ).toBeGreaterThan(0);
    expect(
      errorsOf((m) => m.products.push({ ...m.products[0] })).length,
    ).toBeGreaterThan(0);
    expect(
      errorsOf((m) => delete (m.products[0] as { id?: unknown }).id).length,
    ).toBeGreaterThan(0);
  });

  it("販売先の状態と必須項目の不整合を検出する", () => {
    expect(
      errorsOf((m) => {
        m.products[0].sellers.amazon = { state: "verified" } as never;
      }).length,
    ).toBeGreaterThan(0);
    expect(
      errorsOf((m) => {
        m.products[0].sellers.amazon = {
          state: "verified",
          url: "https://www.amazon.co.jp/dp/B0HGF5B9D8",
          checkedAt: "2026/10/05",
        } as never;
      }).length,
    ).toBeGreaterThan(0);
    expect(
      errorsOf((m) => {
        m.products[0].sellers.amazon = { state: "search", query: "" } as never;
      }).length,
    ).toBeGreaterThan(0);
    expect(
      errorsOf((m) => {
        m.products[0].sellers.amazon = { state: "unknown" } as never;
      }).length,
    ).toBeGreaterThan(0);
    expect(
      errorsOf((m) => {
        m.products[0].sellers = {} as never;
      }).length,
    ).toBeGreaterThan(0);
    expect(
      errorsOf((m) => {
        m.products[0].sellers = {
          amazon: { state: "unavailable" },
          ebay: { state: "unavailable" },
        } as never;
      }).length,
    ).toBeGreaterThan(0);
  });
});

describe("check:product-master CLI", () => {
  it("コミット済み catalog.json では exit 0", () => {
    expect(() => checkProductMaster(catalogPath)).not.toThrow();
    expect(checkProductMaster(catalogPath)).toEqual([]);
  });

  it("不正データでは exit 1 になる（fail-closed）", () => {
    const tmp = path.join(
      os.tmpdir(),
      `product-master-bad-${process.pid}.json`,
    );
    fs.writeFileSync(
      tmp,
      JSON.stringify({ version: 1, products: [{ id: "bad" }] }),
      "utf8",
    );
    try {
      expect(() =>
        execFileSync(
          process.execPath,
          ["scripts/check-product-master.mjs", "check", "--file", tmp],
          { cwd: root, stdio: "pipe" },
        ),
      ).toThrow();
    } finally {
      fs.rmSync(tmp, { force: true });
    }
  });
});
