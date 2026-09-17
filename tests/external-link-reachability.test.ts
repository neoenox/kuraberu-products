import { describe, expect, it, vi } from "vitest";
import {
  checkExternalLinkReachability,
  restoreLinkStateArtifact,
  classifyExternalStatus,
  decodeHtmlAttribute,
  INCONCLUSIVE_FAIL_THRESHOLD,
  INCONCLUSIVE_WARN_THRESHOLD,
  loadLinkState,
  probeExternalUrl,
  updateLinkEntry,
} from "../scripts/check-external-link-reachability.mjs";
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { parse } from "yaml";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("external link workflow persistence", () => {
  const workflow = parse(
    readFileSync(".github/workflows/check-external-links.yml", "utf8"),
  );

  it("serializes state updates without cancelling running checks", () => {
    expect(workflow.concurrency).toEqual({
      group: "${{ github.workflow }}-${{ github.ref }}",
      "cancel-in-progress": false,
    });
    expect(workflow.permissions).toEqual({ contents: "read", actions: "read" });
  });

  it("restores before checking and uploads failed checks only on the default branch", () => {
    const steps = workflow.jobs.check.steps;
    const restore = steps.findIndex(
      (step: { id?: string }) => step.id === "restore-state",
    );
    const check = steps.findIndex(
      (step: { id?: string }) => step.id === "reachability",
    );
    const upload = steps.findIndex((step: { uses?: string }) =>
      step.uses?.startsWith("actions/upload-artifact@"),
    );
    expect(restore).toBeGreaterThan(-1);
    expect(check).toBeGreaterThan(restore);
    expect(upload).toBeGreaterThan(check);
    expect(steps[restore].if).toBe(
      "github.ref == format('refs/heads/{0}', github.event.repository.default_branch)",
    );
    expect(steps[restore].run).toBe(
      "node scripts/check-external-link-reachability.mjs --restore-state",
    );
    expect(steps[upload].if).toBe(
      "${{ !cancelled() && github.ref == format('refs/heads/{0}', github.event.repository.default_branch) && steps.restore-state.outcome == 'success' && (steps.reachability.outcome == 'success' || steps.reachability.outcome == 'failure') }}",
    );
    expect(steps[upload].uses).toMatch(/@[a-f0-9]{40}$/);
    expect(steps[upload].with).toMatchObject({
      name: "external-link-state",
      path: "data/external-link-state.json",
      "retention-days": 90,
      "if-no-files-found": "error",
      overwrite: true,
    });
    expect(steps[check]["continue-on-error"]).toBeUndefined();
  });
});

describe("external link artifact restore", () => {
  const context = {
    repository: "owner/repo",
    defaultBranch: "main",
    runId: "100",
  };
  const artifact = (
    id: number,
    runId: number,
    branch = "main",
    expired = false,
  ) => ({
    id,
    name: "external-link-state",
    expired,
    created_at: `2026-09-${String(id).padStart(2, "0")}T00:00:00Z`,
    workflow_run: { id: runId, head_branch: branch },
  });

  function fixture(
    artifacts: ReturnType<typeof artifact>[],
    downloadError?: Error,
  ) {
    return vi.fn((args: string[]) => {
      if (args[0] === "run") {
        if (downloadError) throw downloadError;
        const directory = args[args.indexOf("--dir") + 1];
        writeFileSync(
          join(directory, "external-link-state.json"),
          JSON.stringify({
            urls: { "https://example.test/": { consecutiveInconclusive: 6 } },
          }),
        );
        return "";
      }
      if (args[1].includes("/artifacts"))
        return JSON.stringify([{ artifacts }]);
      const id = Number(args[1].split("/").at(-1));
      return JSON.stringify({
        workflow_id: id === 80 ? 2 : 1,
        status: "completed",
        conclusion: "failure",
        head_branch: "main",
        head_repository: { full_name: "owner/repo" },
      });
    });
  }

  it("restores the newest same-workflow default-branch artifact even from a failed run", () => {
    const directory = mkdtempSync(join(tmpdir(), "link-artifact-"));
    try {
      const runGh = fixture([
        artifact(1, 70),
        artifact(4, 90, "feature"),
        artifact(3, 80),
        artifact(2, 75),
      ]);
      const statePath = join(directory, "state.json");
      restoreLinkStateArtifact({ ...context, statePath, runGh });
      expect(runGh).toHaveBeenCalledWith(
        expect.arrayContaining(["run", "download", "75"]),
      );
      expect(
        loadLinkState(statePath).urls["https://example.test/"]
          .consecutiveInconclusive,
      ).toBe(6);
      expect(runGh.mock.calls.some(([args]) => args.includes("success"))).toBe(
        false,
      );
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("allows a first run with no artifact", () => {
    expect(() =>
      restoreLinkStateArtifact({ ...context, runGh: fixture([]) }),
    ).not.toThrow();
  });

  it("propagates listing failures instead of resetting state", () => {
    const runGh = fixture([]);
    expect(() =>
      restoreLinkStateArtifact({
        ...context,
        runGh: (args) => {
          if (args[1].includes("/artifacts"))
            throw new Error("API unavailable");
          return runGh(args);
        },
      }),
    ).toThrow("API unavailable");
  });

  it("searches all artifact pages and can restore a previous attempt of the current run", () => {
    const directory = mkdtempSync(join(tmpdir(), "link-pages-"));
    const runGh = fixture([]);
    try {
      restoreLinkStateArtifact({
        ...context,
        statePath: join(directory, "state.json"),
        runGh: (args) => {
          if (args[1].includes("/artifacts")) {
            expect(args).toContain("--paginate");
            expect(args).toContain("--slurp");
            return JSON.stringify([
              { artifacts: [artifact(4, 90, "feature")] },
              { artifacts: [artifact(2, 100)] },
            ]);
          }
          return runGh(args);
        },
      });
      expect(runGh).toHaveBeenCalledWith(
        expect.arrayContaining(["run", "download", "100"]),
      );
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it.each([undefined, "invalid json"])(
    "rejects missing or corrupt downloaded files without replacing state: %s",
    (content) => {
      const directory = mkdtempSync(join(tmpdir(), "link-download-"));
      const statePath = join(directory, "state.json");
      writeFileSync(statePath, '{"urls":{}}');
      const runGh = fixture([artifact(2, 75)]);
      try {
        expect(() =>
          restoreLinkStateArtifact({
            ...context,
            statePath,
            runGh: (args) => {
              if (args[0] !== "run") return runGh(args);
              if (content !== undefined)
                writeFileSync(
                  join(
                    args[args.indexOf("--dir") + 1],
                    "external-link-state.json",
                  ),
                  content,
                );
              return "";
            },
          }),
        ).toThrow();
        expect(readFileSync(statePath, "utf8")).toBe('{"urls":{}}');
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    },
  );

  it("propagates download failures without falling back to older state", () => {
    const runGh = fixture(
      [artifact(2, 75), artifact(1, 70)],
      new Error("download failed"),
    );
    expect(() => restoreLinkStateArtifact({ ...context, runGh })).toThrow(
      "download failed",
    );
    expect(runGh.mock.calls.filter(([args]) => args[0] === "run")).toHaveLength(
      1,
    );
  });

  it("does not silently reset when the latest state has expired", () => {
    expect(() =>
      restoreLinkStateArtifact({
        ...context,
        runGh: fixture([artifact(2, 75, "main", true), artifact(1, 70)]),
      }),
    ).toThrow(/expired/);
  });

  it.each(["not json", "{}", '{"urls":null}', '{"urls":[]}'])(
    "rejects corrupt restored state: %s",
    (content) => {
      const directory = mkdtempSync(join(tmpdir(), "link-invalid-"));
      try {
        const statePath = join(directory, "state.json");
        writeFileSync(statePath, content);
        expect(() => loadLinkState(statePath)).toThrow();
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    },
  );

  it("persists incremented counters before a threshold failure and resumes them next run", async () => {
    const directory = mkdtempSync(join(tmpdir(), "link-resume-"));
    try {
      const statePath = join(directory, "state.json");
      writeFileSync(
        join(directory, "index.html"),
        '<a href="https://example.test/">link</a>',
      );
      restoreLinkStateArtifact({
        ...context,
        statePath,
        runGh: fixture([artifact(2, 75)]),
      });
      const fetchImpl = vi.fn(async () => new Response(null, { status: 403 }));
      for (const count of [7, 8]) {
        await expect(
          checkExternalLinkReachability({ directory, statePath, fetchImpl }),
        ).rejects.toThrow("persistent inconclusive");
        expect(
          loadLinkState(statePath).urls["https://example.test/"]
            .consecutiveInconclusive,
        ).toBe(count);
      }
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});

describe("external link reachability classification", () => {
  it("decodes generated HTML attribute entities", () => {
    expect(decodeHtmlAttribute("https://example.test/?a=1&amp;b=2")).toBe(
      "https://example.test/?a=1&b=2",
    );
  });

  it("treats success and redirects as reachable", () => {
    expect(classifyExternalStatus(200)).toBe("reachable");
    expect(classifyExternalStatus(301)).toBe("reachable");
  });

  it("treats confirmed missing resources as broken", () => {
    expect(classifyExternalStatus(404)).toBe("broken");
    expect(classifyExternalStatus(410)).toBe("broken");
  });

  it("keeps blocking and transient responses inconclusive", () => {
    expect(classifyExternalStatus(403)).toBe("inconclusive");
    expect(classifyExternalStatus(429)).toBe("inconclusive");
    expect(classifyExternalStatus(503)).toBe("inconclusive");
  });
});

describe("external link probe", () => {
  it("uses HEAD when the provider supports it", async () => {
    const requests: RequestInit[] = [];
    const fetchMock = vi.fn(
      async (_input: RequestInfo | URL, init?: RequestInit) => {
        requests.push(init ?? {});
        return new Response(null, { status: 204 });
      },
    );

    const result = await probeExternalUrl("https://example.test/resource", {
      fetchImpl: fetchMock as unknown as typeof fetch,
      timeoutMs: 100,
    });

    expect(result.outcome).toBe("reachable");
    expect(result.status).toBe(204);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(requests[0]).toMatchObject({ method: "HEAD" });
  });

  it("falls back to a bounded GET when HEAD is unsupported", async () => {
    const requests: RequestInit[] = [];
    let requestCount = 0;
    const fetchMock = vi.fn(
      async (_input: RequestInfo | URL, init?: RequestInit) => {
        requests.push(init ?? {});
        requestCount += 1;
        return requestCount === 1
          ? new Response(null, { status: 405 })
          : new Response("x", { status: 200 });
      },
    );

    const result = await probeExternalUrl("https://example.test/resource", {
      fetchImpl: fetchMock as unknown as typeof fetch,
      timeoutMs: 100,
    });

    expect(result.outcome).toBe("reachable");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(requests[1]).toMatchObject({
      method: "GET",
      headers: expect.objectContaining({ range: "bytes=0-0" }),
    });
  });

  it("returns inconclusive for timeouts without throwing", async () => {
    const fetchMock = vi.fn(
      (_input: RequestInfo | URL, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener(
            "abort",
            () => {
              const error = new Error("aborted");
              error.name = "AbortError";
              reject(error);
            },
            { once: true },
          );
        }),
    );

    await expect(
      probeExternalUrl("https://example.test/resource", {
        fetchImpl: fetchMock as unknown as typeof fetch,
        timeoutMs: 5,
      }),
    ).resolves.toMatchObject({ outcome: "inconclusive", reason: "timeout" });
  });
});

describe("external link state tracking (P2 consecutive failures)", () => {
  it("loadLinkState returns empty state when file is missing", () => {
    const directory = mkdtempSync(join(tmpdir(), "link-state-"));
    try {
      const state = loadLinkState(join(directory, "nonexistent.json"));
      expect(state).toEqual({ urls: {} });
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("loadLinkState loads valid state from disk", () => {
    const directory = mkdtempSync(join(tmpdir(), "link-state-valid-"));
    try {
      const statePath = join(directory, "state.json");
      writeFileSync(
        statePath,
        JSON.stringify({
          urls: {
            "https://example.com": {
              consecutiveInconclusive: 2,
              lastOutcome: "inconclusive",
            },
          },
        }),
      );
      const state = loadLinkState(statePath);
      expect(state.urls["https://example.com"].consecutiveInconclusive).toBe(2);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("updateLinkEntry resets counter on reachable", () => {
    const entry = { consecutiveInconclusive: 5, lastOutcome: "inconclusive" };
    const updated = updateLinkEntry(entry, "reachable", undefined);
    expect(updated.consecutiveInconclusive).toBe(0);
    expect(updated.lastOutcome).toBe("reachable");
  });

  it("updateLinkEntry increments counter on inconclusive", () => {
    const entry = { consecutiveInconclusive: 2, lastOutcome: "inconclusive" };
    const updated = updateLinkEntry(entry, "inconclusive", "timeout");
    expect(updated.consecutiveInconclusive).toBe(3);
    expect(updated.lastReason).toBe("timeout");
  });

  it("updateLinkEntry starts at 1 for first inconclusive", () => {
    const updated = updateLinkEntry(undefined, "inconclusive", "403");
    expect(updated.consecutiveInconclusive).toBe(1);
    expect(updated.lastReason).toBe("403");
  });

  it("updateLinkEntry resets counter on broken (404/410)", () => {
    const entry = { consecutiveInconclusive: 5, lastOutcome: "inconclusive" };
    const updated = updateLinkEntry(entry, "broken", undefined);
    expect(updated.consecutiveInconclusive).toBe(0);
    expect(updated.lastOutcome).toBe("broken");
  });

  it("thresholds are configured correctly", () => {
    expect(INCONCLUSIVE_WARN_THRESHOLD).toBe(3);
    expect(INCONCLUSIVE_FAIL_THRESHOLD).toBe(7);
    expect(INCONCLUSIVE_FAIL_THRESHOLD).toBeGreaterThan(
      INCONCLUSIVE_WARN_THRESHOLD,
    );
  });

  it("updateLinkEntry removes lastReason when outcome is not inconclusive", () => {
    const entry = {
      consecutiveInconclusive: 3,
      lastOutcome: "inconclusive",
      lastReason: "timeout",
    };
    const updated = updateLinkEntry(entry, "reachable", undefined);
    expect(updated.lastReason).toBeUndefined();
  });
});
