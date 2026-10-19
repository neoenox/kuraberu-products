import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import YAML from "yaml";
import * as prettier from "prettier";
import {
  slugToSeedName,
  validateInput,
  renderSeedTs,
  renderPageAstro,
  applySeedsEdits,
  runArticleAdd,
} from "../scripts/article-add.mjs";

const CHECKED_AT = "2026-09-03";

type ScaffoldSide = {
  brand: string;
  model: string;
  officialUrl: string;
  image: string;
  tagline: string;
  guidePoints: string[];
};

type ScaffoldInput = {
  slug: string;
  category: string;
  productType: string;
  left: ScaffoldSide;
  right: ScaffoldSide;
  differences: {
    label: string;
    left: string;
    right: string;
    highlight?: string;
  }[];
  faq: { question: string; answer: string }[];
  checkedAt: string;
};

function validInput(): ScaffoldInput {
  return {
    slug: "panasonic-ne-ms4c-vs-ne-bs5c",
    category: "キッチン家電",
    productType: "オーブンレンジ",
    left: {
      brand: "パナソニック",
      model: "NE-MS4C",
      officialUrl: "https://panasonic.jp/range/products/NE-MS4C.html",
      image: "/products/panasonic-ne-ms4c.png",
      tagline: "軽さ・シンプル操作なら",
      guidePoints: ["シンプルな操作を重視する人"],
    },
    right: {
      brand: "パナソニック",
      model: "NE-BS5C",
      officialUrl: "https://panasonic.jp/range/products/NE-BS5C.html",
      image: "/products/panasonic-ne-bs5c.png",
      tagline: "表示・グリル機能なら",
      guidePoints: ["機能を重視する人"],
    },
    differences: [
      { label: "本体質量", left: "14.2kg", right: "14.7kg", highlight: "left" },
      { label: "自動メニュー数", left: "51", right: "55", highlight: "right" },
    ],
    faq: [{ question: "どちらが軽い？", answer: "NE-MS4Cが14.2kgです。" }],
    checkedAt: CHECKED_AT,
  };
}

function withTempRoot() {
  const root = mkdtempSync(join(tmpdir(), "article-add-"));
  mkdirSync(join(root, "src", "content", "articles", "commercial"), {
    recursive: true,
  });
  mkdirSync(join(root, "src", "pages", "articles"), { recursive: true });
  mkdirSync(join(root, "public", "products"), { recursive: true });
  return root;
}

describe("slugToSeedName", () => {
  it("derives the seed export name from a slug", () => {
    expect(slugToSeedName("panasonic-ne-ms4c-vs-ne-bs5c")).toBe(
      "panasonicNeMs4cVsNeBs5cSeed",
    );
    expect(slugToSeedName("tiger-jpv-l100-vs-jpv-m100")).toBe(
      "tigerJpvL100VsJpvM100Seed",
    );
  });
});

describe("validateInput", () => {
  it("accepts the documented YAML shape", () => {
    const root = withTempRoot();
    const { errors } = validateInput(validInput(), { root });
    expect(errors).toEqual([]);
  });

  it("accepts YAML parsed from text", () => {
    const root = withTempRoot();
    const text = `
slug: panasonic-ne-ms4c-vs-ne-bs5c
category: キッチン家電
left:
  brand: パナソニック
  model: NE-MS4C
  officialUrl: https://panasonic.jp/range/products/NE-MS4C.html
  image: /products/panasonic-ne-ms4c.png
  tagline: 軽さ・シンプル操作なら
  guidePoints:
    - シンプルな操作を重視する人
right:
  brand: パナソニック
  model: NE-BS5C
  officialUrl: https://panasonic.jp/range/products/NE-BS5C.html
  image: /products/panasonic-ne-bs5c.png
  tagline: 表示・グリル機能なら
  guidePoints:
    - 機能を重視する人
differences:
  - label: 本体質量
    left: 14.2kg
    right: 14.7kg
    highlight: left
  - label: 自動メニュー数
    left: "51"
    right: "55"
    highlight: right
faq:
  - question: どちらが軽い？
    answer: NE-MS4Cが14.2kgです。
checkedAt: ${CHECKED_AT}
`;
    const parsed = YAML.parse(text);
    const { errors } = validateInput(parsed, { root });
    expect(errors).toEqual([]);
  });

  it("rejects bad slugs, non-https URLs, same models, and bad dates", () => {
    const root = withTempRoot();
    const badSlug = { ...validInput(), slug: "Panasonic_BAD" };
    expect(validateInput(badSlug, { root }).errors.length).toBeGreaterThan(0);

    const http = validInput();
    http.left.officialUrl = "http://panasonic.jp/range/products/NE-MS4C.html";
    expect(
      validateInput(http, { root }).errors.some((message) =>
        message.includes("left.officialUrl"),
      ),
    ).toBe(true);

    const same = validInput();
    same.right.model = "NE-MS4C";
    expect(
      validateInput(same, { root }).errors.some((message) =>
        message.includes("must differ"),
      ),
    ).toBe(true);

    const future = validInput();
    future.checkedAt = "2999-01-01";
    expect(
      validateInput(future, { root }).errors.some((message) =>
        message.includes("future"),
      ),
    ).toBe(true);

    const noFaq = validInput();
    noFaq.faq = [];
    expect(
      validateInput(noFaq, { root }).errors.some((message) =>
        message.includes("faq"),
      ),
    ).toBe(true);

    const badHighlight = validInput();
    badHighlight.differences = [
      { label: "本体質量", left: "14.2kg", right: "14.7kg", highlight: "both" },
      { label: "自動メニュー数", left: "51", right: "55" },
    ];
    expect(
      validateInput(badHighlight, { root }).errors.some((message) =>
        message.includes("highlight"),
      ),
    ).toBe(true);
  });

  it("requires two verified comparison rows", () => {
    const root = withTempRoot();
    const oneRow = validInput();
    oneRow.differences = [
      { label: "本体質量", left: "14.2kg", right: "14.7kg" },
    ];
    expect(
      validateInput(oneRow, { root }).errors.some((message) =>
        message.includes("two rows"),
      ),
    ).toBe(true);
  });

  it("reports duplicates against an existing tree", () => {
    const root = withTempRoot();
    mkdirSync(join(root, "src", "pages", "articles", validInput().slug), {
      recursive: true,
    });
    const { errors } = validateInput(validInput(), { root });
    expect(errors.some((message) => message.includes("already exists"))).toBe(
      true,
    );
  });
});

describe("renderers", () => {
  it("renders a seed only from YAML data", () => {
    const ts = renderSeedTs(validInput());
    expect(ts).toContain(
      "export const panasonicNeMs4cVsNeBs5cSeed: CommercialArticleSeed",
    );
    expect(ts).toContain('id: "panasonic-ne-ms4c-vs-ne-bs5c"');
    expect(ts).toContain('leftProduct: "パナソニック NE-MS4C"');
    expect(ts).toContain('rightProduct: "パナソニック NE-BS5C"');
    expect(ts).toContain('leftPoint: "軽さ・シンプル操作なら"');
    expect(ts).toContain('rightPoint: "表示・グリル機能なら"');
    expect(ts).toContain('leftImage: "/products/panasonic-ne-ms4c.png"');
    expect(ts).toContain("verifiedRows");
    expect(ts).toContain("本体質量");
    expect(ts).toContain("どちらが軽い？");
    expect(ts).toContain(CHECKED_AT);
    expect(ts).not.toContain("defineArticleMetadata");
    expect(ts).not.toContain("keyDiffRows");
    expect(ts).not.toContain("leftModel");
  });

  it("renders prettier-clean TypeScript through the pipeline", async () => {
    const { formatTs } = await import("../scripts/article-add.mjs");
    const { source, formatted } = await formatTs(renderSeedTs(validInput()));
    expect(formatted).toBe(true);
    await expect(
      prettier.check(source, { parser: "typescript" }),
    ).resolves.toBe(true);
  });

  it("renders a one-line articleId page", () => {
    const astro = renderPageAstro(validInput());
    expect(astro).toContain(
      '<CommercialArticlePage articleId="panasonic-ne-ms4c-vs-ne-bs5c" />',
    );
  });
});

const SEEDS_FIXTURE = `import { aSeed } from "./a";
import type { CommercialArticleSeed } from "./types";

export const commercialArticleSeeds: readonly CommercialArticleSeed[] = [
  aSeed,
];
`;

describe("seed registry edits", () => {
  it("inserts the import and the array entry", () => {
    const next = applySeedsEdits(SEEDS_FIXTURE, {
      seedName: "panasonicNeMs4cVsNeBs5cSeed",
      slug: "panasonic-ne-ms4c-vs-ne-bs5c",
    });
    expect(next).toContain(
      'import { panasonicNeMs4cVsNeBs5cSeed } from "./panasonic-ne-ms4c-vs-ne-bs5c";',
    );
    expect(next).toContain("  panasonicNeMs4cVsNeBs5cSeed,\n];");
    // import は既存 import 群の直後、配列の先頭は既存 seed の後ろに置く
    expect(next.indexOf("panasonicNeMs4cVsNeBs5cSeed,")).toBeGreaterThan(
      next.indexOf("  aSeed,"),
    );
  });

  it("refuses double registration", () => {
    const once = applySeedsEdits(SEEDS_FIXTURE, {
      seedName: "panasonicNeMs4cVsNeBs5cSeed",
      slug: "panasonic-ne-ms4c-vs-ne-bs5c",
    });
    expect(() =>
      applySeedsEdits(once, {
        seedName: "panasonicNeMs4cVsNeBs5cSeed",
        slug: "panasonic-ne-ms4c-vs-ne-bs5c",
      }),
    ).toThrow(/already registered/);
  });
});

describe("runArticleAdd end to end", () => {
  it("writes the seed, the page, and the registry update into a fixture tree", async () => {
    const root = withTempRoot();
    writeFileSync(
      join(root, "src", "content", "articles", "commercial", "seeds.ts"),
      SEEDS_FIXTURE,
    );
    const yamlPath = join(root, "input.yaml");
    writeFileSync(yamlPath, YAML.stringify(validInput()));

    const result = await runArticleAdd({ root, yamlPath });
    expect(result.seedName).toBe("panasonicNeMs4cVsNeBs5cSeed");

    const seedTs = readFileSync(
      join(
        root,
        "src",
        "content",
        "articles",
        "commercial",
        "panasonic-ne-ms4c-vs-ne-bs5c.ts",
      ),
      "utf-8",
    );
    expect(seedTs).toContain("panasonicNeMs4cVsNeBs5cSeed");

    const page = readFileSync(
      join(
        root,
        "src",
        "pages",
        "articles",
        "panasonic-ne-ms4c-vs-ne-bs5c",
        "index.astro",
      ),
      "utf-8",
    );
    expect(page).toContain('articleId="panasonic-ne-ms4c-vs-ne-bs5c"');

    const seeds = readFileSync(
      join(root, "src", "content", "articles", "commercial", "seeds.ts"),
      "utf-8",
    );
    expect(seeds).toContain(
      'import { panasonicNeMs4cVsNeBs5cSeed } from "./panasonic-ne-ms4c-vs-ne-bs5c";',
    );
    expect(seeds).toContain("  panasonicNeMs4cVsNeBs5cSeed,");

    // second run must fail on duplicates
    await expect(runArticleAdd({ root, yamlPath })).rejects.toThrow(/already/);
  });

  it("supports --check mode without writing", async () => {
    const root = withTempRoot();
    writeFileSync(
      join(root, "src", "content", "articles", "commercial", "seeds.ts"),
      SEEDS_FIXTURE,
    );
    const yamlPath = join(root, "input.yaml");
    writeFileSync(yamlPath, YAML.stringify(validInput()));

    await runArticleAdd({ root, yamlPath, check: true });
    expect(() =>
      readFileSync(
        join(
          root,
          "src",
          "content",
          "articles",
          "commercial",
          "panasonic-ne-ms4c-vs-ne-bs5c.ts",
        ),
      ),
    ).toThrow();
  });
});
