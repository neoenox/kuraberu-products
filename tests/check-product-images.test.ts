import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  checkProductImages,
  collectDistRefs,
  collectSourceRefs,
  findMissingFiles,
  normalizeProductRef,
  parseImageMap,
  parseSeedImages,
} from "../scripts/check-product-images.mjs";

function fixtureTree(files: Record<string, string>): string {
  const dir = mkdtempSync(path.join(tmpdir(), "product-images-"));
  for (const [name, content] of Object.entries(files)) {
    const full = path.join(dir, name);
    mkdirSync(path.dirname(full), { recursive: true });
    writeFileSync(full, content);
  }
  return dir;
}

describe("normalizeProductRef", () => {
  it("resolves local refs and strips query/hash", () => {
    expect(normalizeProductRef("/products/a.png")).toBe("a.png");
    expect(normalizeProductRef("/products/a.png?v=2#x")).toBe("a.png");
    expect(normalizeProductRef("/products/%E3%81%82.png")).toBe("あ.png");
  });

  it("ignores external, data and traversal refs", () => {
    expect(normalizeProductRef("https://example.com/a.png")).toBeNull();
    expect(normalizeProductRef("data:image/png;base64,xx")).toBeNull();
    expect(normalizeProductRef("/other/a.png")).toBeNull();
    expect(normalizeProductRef("/products/../secret.txt")).toBeNull();
    expect(normalizeProductRef("/products/a/b.png")).toBeNull();
  });
});

describe("parseImageMap", () => {
  it("maps ids to left/right", () => {
    const map = parseImageMap(
      'export const m = {\n"a-vs-b": {\nleft: "/products/a.png",\nright: "/products/b.png",\n},\n};',
    );
    expect(map.get("a-vs-b")).toEqual({
      left: "/products/a.png",
      right: "/products/b.png",
    });
  });
});

describe("checkProductImages", () => {
  const seedDir = (...parts: string[]) => path.join(...parts);

  it("follows create.ts precedence (map left wins)", () => {
    const dir = fixtureTree({
      "src/content/articles/commercial/images.ts":
        'export const m = {\n"a-vs-b": {\nleft: "/products/map-left.png",\nright: "/products/map-right.png",\n},\n};',
      "src/content/articles/commercial/a-vs-b.ts":
        'export const seed = {\nid: "a-vs-b",\nproductInfoCheckedAt: "2026-01-01",\nleftImage: "/products/seed-left.png",\n};',
      "public/products/map-left.png": "x",
    });
    const refs = collectSourceRefs(seedDir(dir, "src"), {
      isPublished: () => true,
    });
    expect(refs.map((ref) => ref.name)).toEqual(["map-left.png"]);
    expect(() =>
      checkProductImages({
        srcDir: seedDir(dir, "src"),
        publicDir: path.join(dir, "public", "products"),
        distDir: path.join(dir, "dist"),
        isPublished: () => true,
      }),
    ).not.toThrow();
  });

  it("falls back to seed images", () => {
    const dir = fixtureTree({
      "src/content/articles/commercial/images.ts": "export const m = {};",
      "src/content/articles/commercial/a-vs-b.ts":
        'export const seed = {\nid: "a-vs-b",\nproductInfoCheckedAt: "2026-01-01",\nrightImage: "/products/seed-right.png",\n};',
      "public/products/seed-right.png": "x",
    });
    const refs = collectSourceRefs(seedDir(dir, "src"), {
      isPublished: () => true,
    });
    expect(refs.map((ref) => ref.name).sort()).toEqual(["seed-right.png"]);
  });

  it("ignores guide articles (fail-closed resolver covers them)", () => {
    const dir = fixtureTree({
      "src/content/articles/commercial/images.ts": "export const m = {};",
      "src/content/articles/guide.ts":
        'export const g = {\nimagePath: "/products/guide.png",\n};',
      "public/products/guide.png": "x",
    });
    const refs = collectSourceRefs(seedDir(dir, "src"), {
      isPublished: () => true,
    });
    expect(refs).toEqual([]);
  });

  it("fails listing the missing file (negative control)", () => {
    const dir = fixtureTree({
      "src/content/articles/commercial/images.ts": "export const m = {};",
      "src/content/articles/commercial/a-vs-b.ts":
        'export const seed = {\nid: "a-vs-b",\nproductInfoCheckedAt: "2026-01-01",\nleftImage: "/products/gone.png",\n};',
      "public/products/ok.png": "fake-png",
    });
    expect(() =>
      checkProductImages({
        srcDir: seedDir(dir, "src"),
        publicDir: path.join(dir, "public", "products"),
        distDir: path.join(dir, "dist"),
        isPublished: () => true,
      }),
    ).toThrow(/gone\.png/);
  });

  it("dist scan covers img tags but ignores meta", () => {
    const dir = fixtureTree({
      "src/content/articles/commercial/images.ts": "export const m = {};",
      "dist/i.html":
        '<img src="/products/ok.png">' +
        '<meta property="og:image" content="/products/meta-only.png">',
      "dist/products/ok.png": "x",
    });
    expect(
      collectDistRefs(path.join(dir, "dist"))?.map((ref) => ref.name),
    ).toEqual(["ok.png"]);
  });

  it("skips the dist layer when dist is absent", () => {
    const dir = fixtureTree({
      "src/content/articles/commercial/images.ts": "export const m = {};",
    });
    expect(collectDistRefs(path.join(dir, "dist"))).toBeNull();
  });

  it("skips unpublished seeds (never rendered)", () => {
    const dir = fixtureTree({
      "src/content/articles/commercial/images.ts": "export const m = {};",
      "src/content/articles/commercial/draft-vs-x.ts":
        'export const seed = {\nid: "draft-vs-x",\nleftImage: "/products/draft-missing.png",\n};',
      "src/content/articles/commercial/pub-vs-x.ts":
        'export const seed = {\nid: "pub-vs-x",\nleftImage: "/products/pub.png",\n};',
      "public/products/pub.png": "x",
    });
    const onlyPub = (p) => p === "/articles/pub-vs-x/";
    const refs = collectSourceRefs(seedDir(dir, "src"), {
      isPublished: onlyPub,
    });
    expect(refs.map((ref) => ref.name)).toEqual(["pub.png"]);
  });

  it("findMissingFiles reports only absent names", () => {
    const dir = fixtureTree({ "public/products/ok.png": "x" });
    expect(
      findMissingFiles(
        [
          { file: "a", name: "ok.png" },
          { file: "b", name: "gone.png" },
        ],
        path.join(dir, "public", "products"),
      ).map((entry) => entry.name),
    ).toEqual(["gone.png"]);
  });

  it("collects refs from real sources", () => {
    const refs = collectSourceRefs();
    expect(refs.length).toBeGreaterThan(0);
    expect(refs.map((ref) => ref.name)).toContain(
      "logicool-pro-x-superlight-2-dex.png",
    );
  });

  it("parses seed fields", () => {
    expect(
      parseSeedImages(
        'export const seed = {\nid: "a",\nleftImage: "/x.png",\n};',
      ),
    ).toMatchObject({ id: "a", leftImage: "/x.png" });
  });
});
