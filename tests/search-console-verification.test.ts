import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const VERIFICATION_FILE = /^google[0-9a-f]{16}\.html$/;

describe("Search Console ownership verification file", () => {
  const files = readdirSync("public").filter((name) =>
    VERIFICATION_FILE.test(name),
  );

  it("keeps the exact one-line content Google issued", () => {
    expect(files.length).toBeGreaterThan(0);
    for (const name of files) {
      expect(readFileSync(`public/${name}`, "utf8")).toBe(
        `google-site-verification: ${name}`,
      );
    }
  });

  it("is excluded from the page gates but only for that exact filename shape", () => {
    for (const script of [
      "scripts/check-rendered-html.mjs",
      "scripts/check-deployment-html.mjs",
    ]) {
      const source = readFileSync(script, "utf8");
      expect(source).toContain(
        "const OWNERSHIP_VERIFICATION_FILE = /^google[0-9a-f]{16}\\.html$/;",
      );
      expect(source).toContain("!OWNERSHIP_VERIFICATION_FILE.test(entry.name)");
    }
    // 他の名前の HTML は、これまでどおり検査される
    expect(VERIFICATION_FILE.test("google.html")).toBe(false);
    expect(VERIFICATION_FILE.test("index.html")).toBe(false);
    expect(VERIFICATION_FILE.test("google00e5beae234c6ef4.html.bak")).toBe(
      false,
    );
  });

  it("is not listed in the sitemap", () => {
    const sitemap = readFileSync("src/pages/sitemap.xml.ts", "utf8");
    expect(sitemap).not.toMatch(/google[0-9a-f]{16}/);
  });
});
