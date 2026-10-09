import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { DEFAULT_THRESHOLD_DAYS as priceDays } from "../scripts/check-price-freshness.mjs";
import { DEFAULT_THRESHOLD_DAYS as specDays } from "../scripts/spec-claims.mjs";

/** docs/freshness-policy.md と実装・ワークフローのずれを防ぐ（Refs #1065）。 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative: string) =>
  readFileSync(path.join(root, relative), "utf8");
const policy = read("docs/freshness-policy.md");

describe("freshness policy", () => {
  it("documents the implemented thresholds", () => {
    expect(priceDays).toBe(30);
    expect(specDays).toBe(180);
    expect(policy).toMatch(new RegExp(`${priceDays}日`));
    expect(policy).toMatch(new RegExp(`${specDays}日`));
  });

  it.each([
    ["price-freshness.yml", "scripts/check-price-freshness.mjs"],
    ["spec-claims-freshness.yml", "scripts/spec-claims.mjs freshness"],
  ])(
    "%s notifies via issue, auto-closes, and never hides content",
    (workflow, command) => {
      const yml = read(`.github/workflows/${workflow}`);
      expect(yml).toContain(command);
      expect(yml).toContain("gh issue create");
      expect(yml).toContain("gh issue edit");
      expect(yml).toContain("gh issue close");
      expect(yml).toContain("exit 1"); // 通知失敗時は失敗させる
      expect(yml).not.toMatch(/git (commit|push)/);
      expect(policy).toContain(workflow);
    },
  );
});
