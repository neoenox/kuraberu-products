import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  DIST_GUARD_PATTERN,
  DIST_REFERENCE_ALLOWLIST,
  DIST_SUITE_FILES,
} from "./dist-suites.mjs";

// dist 依存のテスト群（article-cta-consistency、article-metadata の rendered dist
// ケース等）は dist が無いと skipIf で静かに素通りする。`pnpm test` 単体では
// 無警告で成功に見えるため、このテストが警告を出して可視化する。
// フル検証には `pnpm build && pnpm test:dist`（または `pnpm verify`）を使うこと。
const TEST_DIR = "tests";

function distGuardFiles(): string[] {
  return readdirSync(TEST_DIR)
    .filter((name) => name.endsWith(".test.ts"))
    .filter((name) =>
      DIST_GUARD_PATTERN.test(readFileSync(join(TEST_DIR, name), "utf8")),
    )
    .map((name) => `${TEST_DIR}/${name}`)
    .sort();
}

describe("dist-dependent gates awareness", () => {
  it("warns when dist is absent so skipped suites cannot silently pass", () => {
    const hasDist = existsSync("dist/index.html");
    if (!hasDist) {
      console.warn(
        "dist/ が無いため dist 依存のテスト群が skip されます。" +
          "フル検証には pnpm build && pnpm test:dist または pnpm verify を実行してください。",
      );
    }
    expect(true).toBe(true);
  });

  // 分類（tests/dist-suites.mjs）が唯一の情報源であることを保証する。手書きの
  // 列挙が実態からずれる（新しい dist 依存テストが dist 実行から漏れる）のを防ぐ。
  it("classifies every test file that guards on dist availability", () => {
    const classified = new Set([
      ...DIST_SUITE_FILES,
      ...Object.keys(DIST_REFERENCE_ALLOWLIST),
    ]);
    const unclassified = distGuardFiles().filter(
      (file) => !classified.has(file),
    );
    expect(unclassified).toEqual([]);
  });

  it("keeps the dist suite list existing, unique, and actually dist-guarded", () => {
    expect(new Set(DIST_SUITE_FILES).size).toBe(DIST_SUITE_FILES.length);
    for (const file of DIST_SUITE_FILES) {
      expect(existsSync(file), `${file} が存在しません`).toBe(true);
      expect(
        DIST_GUARD_PATTERN.test(readFileSync(file, "utf8")),
        `${file} は dist ガードを持たないため dist スイートから外せます`,
      ).toBe(true);
    }
  });

  it("documents the reason for every allowlisted non-suite dist reference", () => {
    const allowlisted = Object.entries(DIST_REFERENCE_ALLOWLIST);
    expect(allowlisted.length).toBeGreaterThan(0);
    for (const [file, reason] of allowlisted) {
      expect(existsSync(file), `${file} が存在しません`).toBe(true);
      expect(
        DIST_GUARD_PATTERN.test(readFileSync(file, "utf8")),
        `${file} は dist を参照していないため allowlist から外せます`,
      ).toBe(true);
      expect(reason.trim().length, `${file} の理由が空です`).toBeGreaterThan(0);
    }
  });
});
