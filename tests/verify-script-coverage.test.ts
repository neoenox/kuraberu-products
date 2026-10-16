import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * check:* / validate:* スクリプトが verify 系に取り込まれていることを保証する（Refs #1062）。
 * 追加したチェックが verify:lint / verify:build（= CI の verify.yml）から漏れるのを防ぐ。
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scripts: Record<string, string> = JSON.parse(
  readFileSync(path.join(root, "package.json"), "utf8"),
).scripts;

/** verify に含めない理由が明確なもの。 */
const EXEMPT: Record<string, string> = {
  "check:external-link-reachability":
    "ネットワーク依存のため .github/workflows/check-external-links.yml で定期実行する",
  "check:embed-availability":
    "ネットワーク依存のため .github/workflows/check-embed-availability.yml で定期実行する",
  "check:git-scope":
    "作業者のcheckoutを検証するエージェント用ガードのためCIゲートに組み込まない",
  "check:embed-liveness":
    "外部サービス依存のため手動・定期実行とし、CIゲートに組み込まない",
};

const scriptFile = (command: string) =>
  command.match(/scripts\/[\w.-]+\.mjs/)?.[0];

describe("verify script coverage", () => {
  const verified = `${scripts["verify:lint"]} ${scripts["verify:build"]}`;

  it("includes every check:* / validate:* script in verify:lint or verify:build", () => {
    const missing = Object.entries(scripts)
      .filter(([name]) => /^(check|validate):/.test(name))
      .filter(([name]) => !(name in EXEMPT))
      .filter(([, command]) => {
        const file = scriptFile(command);
        return !file || !verified.includes(file);
      })
      .map(([name]) => name);
    expect(missing).toEqual([]);
  });

  it("keeps exemptions limited to scripts that exist", () => {
    for (const name of Object.keys(EXEMPT)) {
      expect(scripts[name], `${name} no longer exists`).toBeDefined();
    }
  });

  it("keeps every verify:fast step inside verify:lint", () => {
    const lint = scripts["verify:lint"];
    const steps = scripts["verify:fast"].split(" && ");
    expect(steps.filter((step) => !lint.includes(step))).toEqual([]);
  });
});
