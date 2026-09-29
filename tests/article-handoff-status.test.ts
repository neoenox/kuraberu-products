import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

function check(
  seedStatus: string,
  manifestStatus: string | undefined,
  ready = true,
) {
  const root = mkdtempSync(path.join(tmpdir(), "handoff-status-"));
  try {
    mkdirSync(path.join(root, "src/content/articles/commercial"), {
      recursive: true,
    });
    mkdirSync(path.join(root, "docs/article-handoffs"), { recursive: true });
    const amazon = "https://www.amazon.co.jp/dp/B012345678";
    const rakuten =
      "https://hb.afl.rakuten.co.jp/ichiba/example/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fshop%2Fitem%2F";
    writeFileSync(
      path.join(root, "src/content/articles/commercial/fixture.ts"),
      `export const seed = {
      id: "fixture", handoffManifestId: "fixture", publishedAt: "2026-09-29",
      purchaseLinkStatus: "verified", amazonLinkStatus: "${seedStatus}",
      leftProduct: "Example Model123", rightProduct: "Example Model123",
      ${manifestStatus === "search" ? "" : `leftAmazonUrl: "${amazon}", rightAmazonUrl: "${amazon}",`}
      leftRakutenUrl: "${rakuten}", rightRakutenUrl: "${rakuten}"
    };`,
    );
    writeFileSync(
      path.join(root, "docs/article-handoffs/fixture.json"),
      JSON.stringify({
        id: "fixture",
        articleId: "fixture",
        articleReady: ready,
        products: {
          left: { name: "Example Model123", model: "Model123" },
          right: { name: "Example Model123", model: "Model123" },
        },
        amazon: {
          status: manifestStatus,
          ...(manifestStatus === "search"
            ? {}
            : { left: amazon, right: amazon }),
        },
        rakuten: { status: "verified", left: rakuten, right: rakuten },
      }),
    );
    const result = spawnSync(
      process.execPath,
      [path.resolve("scripts/check-article-handoff.mjs")],
      { cwd: root, encoding: "utf8" },
    );
    return { status: result.status, errors: result.stderr };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

describe("handoff Amazon publication gate", () => {
  it("rejects publication with unverified Amazon even when Rakuten is verified", () => {
    const result = check("unverified", "unverified");
    expect(result.status).toBe(1);
    expect(result.errors).toContain("explicit resolved Amazon status");
  });
  it("rejects an omitted Amazon status on a ready article", () => {
    expect(check("verified", undefined).status).toBe(1);
  });
  it.each(["unverified", "verified", "direct"])(
    "rejects seed-only unavailable with a %s handoff",
    (status) => {
      const result = check("unavailable", status);
      expect(result.status).toBe(1);
      expect(result.errors).toContain("must match the effective seed status");
    },
  );
  it("still requires unavailable evidence when both states agree", () => {
    expect(check("unavailable", "unavailable").errors).toContain(
      "direct item-level evidence",
    );
  });
  it("allows an unverified draft", () => {
    expect(check("unverified", "unverified", false).status).toBe(0);
  });
  it.each(["verified", "direct", "search"])(
    "allows matching %s status with a verified purchase destination",
    (status) => {
      expect(check(status, status).status).toBe(0);
    },
  );
});
