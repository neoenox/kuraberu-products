import { describe, expect, it } from "vitest";
import {
  COMMENT_MARKER,
  STALE_AFTER_MS,
  apiEndpoints,
  buildComment,
  selectStalePrs,
} from "../scripts/update-stale-prs.mjs";

const NOW = Date.parse("2026-09-06T12:00:00Z");

function pr(overrides = {}) {
  return {
    number: 1,
    title: "sample",
    behindBy: 1,
    headAgeMs: NOW - STALE_AFTER_MS - 60_000, // just over 24h old
    mergeable: "MERGEABLE",
    isDraft: false,
    ...overrides,
  };
}

describe("apiEndpoints", () => {
  it("builds each gh api endpoint as one argument", () => {
    expect(apiEndpoints("neoenox/kuraberu-products", "abc123", 42)).toEqual({
      pulls:
        "repos/neoenox/kuraberu-products/pulls?state=open&per_page=100&sort=updated&direction=desc",
      compare: "repos/neoenox/kuraberu-products/compare/main...abc123",
      commit: "repos/neoenox/kuraberu-products/commits/abc123",
      pull: "repos/neoenox/kuraberu-products/pulls/42",
    });
  });
});

describe("selectStalePrs", () => {
  it("selects a non-draft MERGEABLE PR behind main with a head older than 24h", () => {
    expect(selectStalePrs([pr()], NOW)).toEqual([pr()]);
  });

  it("selects nothing when the PR is not behind main", () => {
    expect(selectStalePrs([pr({ behindBy: 0 })], NOW)).toEqual([]);
  });

  it("selects nothing when the head is younger than 24h (fresh activity)", () => {
    const fresh = pr({ headAgeMs: NOW - STALE_AFTER_MS + 60_000 });
    expect(selectStalePrs([fresh], NOW)).toEqual([]);
  });

  it("selects a PR exactly at the 24h boundary only strictly past it", () => {
    const exactly = pr({ headAgeMs: NOW - STALE_AFTER_MS });
    expect(selectStalePrs([exactly], NOW)).toEqual([]);
    const past = pr({ headAgeMs: NOW - STALE_AFTER_MS - 1 });
    expect(selectStalePrs([past], NOW)).toEqual([past]);
  });

  it("skips conflicting and unknown-mergeable PRs (no comment spam on conflicts)", () => {
    expect(
      selectStalePrs(
        [pr({ mergeable: "CONFLICTING" }), pr({ mergeable: "UNKNOWN" })],
        NOW,
      ),
    ).toEqual([]);
  });

  it("skips drafts", () => {
    expect(selectStalePrs([pr({ isDraft: true })], NOW)).toEqual([]);
  });

  it("keeps selection order stable and reports several candidates", () => {
    const many = [pr({ number: 10 }), pr({ number: 2 }), pr({ number: 7 })];
    expect(selectStalePrs(many, NOW).map((p) => p.number)).toEqual([10, 2, 7]);
  });
});

describe("buildComment", () => {
  it("carries the marker, the behind count, and the merged head", () => {
    const comment = buildComment(5, "abc1234");
    expect(comment).toContain(COMMENT_MARKER);
    expect(comment).toContain("`5`");
    expect(comment).toContain("`abc1234`");
    expect(comment).toContain("CI が再実行されます");
  });

  it("is idempotent-friendly: same inputs produce the same body", () => {
    expect(buildComment(3, "deadbee")).toBe(buildComment(3, "deadbee"));
  });
});
