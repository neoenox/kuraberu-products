import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  BUILD_CHECKS,
  LINT_CHECKS,
  STATIC_CHECKS,
  VERIFY_COMBINED,
  VERIFY_SCRIPTS,
  buildCommand,
} from "../config/verification-manifest.mjs";
import {
  DOC_FILES,
  compareVerifyScripts,
  missingScriptFiles,
  unknownDocScripts,
} from "../scripts/check-verification-manifest.mjs";

/**
 * 検証チェック一覧の単一マニフェスト（Refs #1062）。
 * package.json の verify:* / CI / docs がマニフェストとずれたら失敗させる。
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const read = (file: string) => readFileSync(path.join(root, file), "utf8");

describe("verification manifest (#1062)", () => {
  it("matches the package.json verify:* commands exactly", () => {
    expect(compareVerifyScripts(pkg.scripts)).toEqual([]);
    for (const [name, steps] of Object.entries(VERIFY_SCRIPTS)) {
      expect(pkg.scripts[name], name).toBe(buildCommand(steps));
    }
    expect(pkg.scripts.verify).toBe(VERIFY_COMBINED);
  });

  it("composes verify:lint from verify:fast plus extras", () => {
    expect(LINT_CHECKS.slice(0, STATIC_CHECKS.length)).toEqual(STATIC_CHECKS);
    expect(LINT_CHECKS.length).toBeGreaterThan(STATIC_CHECKS.length);
    expect(BUILD_CHECKS[0]).toBe("astro build");
  });

  it("references only script files that exist", () => {
    expect(
      missingScriptFiles([...STATIC_CHECKS, ...LINT_CHECKS, ...BUILD_CHECKS]),
    ).toEqual([]);
  });

  it("runs the manifest-backed scripts in CI", () => {
    const yml = read(".github/workflows/verify.yml");
    expect(yml).toContain("pnpm verify:lint");
    expect(yml).toContain("pnpm verify:build");
    expect(yml).toContain("pnpm test:dist");
  });

  it("keeps documentation references to existing scripts only", () => {
    const texts = DOC_FILES.map(read);
    expect(unknownDocScripts(texts, pkg.scripts)).toEqual([]);
  });

  it("detects drift in package.json and docs", () => {
    expect(
      compareVerifyScripts({ ...pkg.scripts, "verify:fast": "echo drifted" }),
    ).not.toEqual([]);
    expect(
      unknownDocScripts(
        ["run `pnpm not-a-real-script` to do things"],
        pkg.scripts,
      ),
    ).toEqual(["not-a-real-script"]);
  });
});
