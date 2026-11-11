import { describe, expect, it } from "vitest";
import {
  COMMENT_MARKER,
  STALE_AFTER_MS,
  apiEndpoints,
  buildComment,
  isRetryableGhApiError,
  selectStalePrs,
  withGhApiRetries,
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

describe("GitHub API transient failure retries", () => {
  it("recognizes GitHub 500/503 responses but not permission errors", () => {
    const http500 = new Error("gh: Server Error (HTTP 500)");
    const http403 = new Error("gh: Forbidden (HTTP 403)");
    expect(isRetryableGhApiError(http500)).toBe(true);
    expect(isRetryableGhApiError({ stdout: '{"status":"503"}' })).toBe(true);
    expect(isRetryableGhApiError(http403)).toBe(false);
    expect(isRetryableGhApiError(new Error("invalid JSON"))).toBe(false);
  });

  it("retries transient 5xx errors and returns the successful result", () => {
    let calls = 0;
    const delays: number[] = [];
    const result = withGhApiRetries(
      () => {
        calls++;
        if (calls < 3) throw new Error("Server Error (HTTP 500)");
        return { ok: true };
      },
      (ms) => delays.push(ms),
    );
    expect(result).toEqual({ ok: true });
    expect(calls).toBe(3);
    expect(delays).toEqual([1000, 2000]);
  });

  it("does not retry non-transient errors", () => {
    let calls = 0;
    const operation = () => {
      calls++;
      throw new Error("Forbidden (HTTP 403)");
    };
    const failIfCalled = () => {
      throw new Error("unexpected delay");
    };
    expect(() => withGhApiRetries(operation, failIfCalled)).toThrow("HTTP 403");
    expect(calls).toBe(1);
  });

  it("fails after three transient attempts rather than reporting success", () => {
    let calls = 0;
    const operation = () => {
      calls++;
      throw new Error("Server Error (HTTP 502)");
    };
    expect(() => withGhApiRetries(operation, () => {})).toThrow("HTTP 502");
    expect(calls).toBe(3);
  });
});
