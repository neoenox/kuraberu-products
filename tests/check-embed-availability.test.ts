import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  checkEmbedAvailability,
  checkRedditEmbed,
  checkXEmbed,
  checkYouTubeEmbed,
  collectEmbedRecords,
  extractEmbedBlocks,
  parseEmbedRecords,
  parseRedditId,
  toLinkOutcome,
} from "../scripts/check-embed-availability.mjs";

function mockFetch(
  status: number,
  body: unknown = null,
  { ok = status >= 200 && status < 300 }: { ok?: boolean } = {},
) {
  return async () => ({
    ok,
    status,
    url: "https://example.invalid/probe",
    json: async () => {
      if (body === null) throw new Error("no json");
      return body;
    },
  });
}

function abortingFetch() {
  return async () => {
    const error = new Error("aborted");
    error.name = "AbortError";
    throw error;
  };
}

describe("parseRedditId", () => {
  it("extracts the submission id from permalinks", () => {
    expect(
      parseRedditId(
        "https://www.reddit.com/r/SonyHeadphones/comments/1ta8tf2/wf1000xm6_3_months_later_the_good_the_bad_and_the/",
      ),
    ).toBe("1ta8tf2");
    expect(
      parseRedditId("https://www.reddit.com/r/TpLink/comments/1wa0emz"),
    ).toBe("1wa0emz");
  });

  it("returns null for non-comment URLs", () => {
    expect(parseRedditId("https://www.reddit.com/r/news/")).toBeNull();
    expect(parseRedditId("not a url")).toBeNull();
  });
});

describe("collectEmbedRecords", () => {
  it("parses inline embeds blocks", () => {
    const blocks = extractEmbedBlocks(`
      embeds: [
        {
          provider: "reddit",
          url: "https://www.reddit.com/r/x/comments/abc123/t/",
          title: "t",
          author: "someone",
        },
      ],
      other: [1, 2],
    `);
    expect(blocks).toHaveLength(1);
    expect(parseEmbedRecords(blocks[0])).toEqual([
      {
        provider: "reddit",
        url: "https://www.reddit.com/r/x/comments/abc123/t/",
        author: "someone",
        title: "t",
      },
    ]);
  });

  it("collects records from real seeds with provider and url", () => {
    const records = collectEmbedRecords();
    expect(records.length).toBeGreaterThan(0);
    for (const record of records) {
      expect(record.provider).toMatch(/^(youtube|reddit|x)$/);
      expect(record.url).toMatch(/^https:\/\//);
      expect(record.file).toMatch(/\.ts$/);
    }
    const urls = new Set(records.map((record) => record.url));
    expect(
      urls.has(
        "https://www.reddit.com/r/SonyHeadphones/comments/1ta8tf2/wf1000xm6_3_months_later_the_good_the_bad_and_the/",
      ),
    ).toBe(true);
  });
});

describe("checkYouTubeEmbed", () => {
  const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

  it("marks oEmbed 200 with html as available", async () => {
    const result = await checkYouTubeEmbed(url, {
      fetchImpl: mockFetch(200, { html: "<iframe></iframe>" }) as never,
    });
    expect(result).toMatchObject({ url, outcome: "available" });
  });

  it.each([400, 401, 404])("marks oEmbed %i as unavailable", async (status) => {
    const result = await checkYouTubeEmbed(url, {
      fetchImpl: mockFetch(status, {}) as never,
    });
    expect(result.outcome).toBe("unavailable");
  });

  it("marks rate-limit and timeout as inconclusive", async () => {
    expect(
      (
        await checkYouTubeEmbed(url, {
          fetchImpl: mockFetch(429, {}) as never,
        })
      ).outcome,
    ).toBe("inconclusive");
    expect(
      (await checkYouTubeEmbed(url, { fetchImpl: abortingFetch() as never }))
        .outcome,
    ).toBe("inconclusive");
  });
});

describe("checkRedditEmbed", () => {
  const url =
    "https://www.reddit.com/r/SonyHeadphones/comments/1ta8tf2/wf1000xm6_3_months_later_the_good_the_bad_and_the/";
  const post = (overrides: Record<string, unknown> = {}) => ({
    id: "1ta8tf2",
    author: "TurboLagGalore",
    removed_by: null,
    ...overrides,
  });

  it("marks a matching indexed post as available", async () => {
    const result = await checkRedditEmbed(url, "TurboLagGalore", {
      fetchImpl: mockFetch(200, { data: [post()] }) as never,
    });
    expect(result).toMatchObject({ url, outcome: "available" });
  });

  it("marks removed posts as unavailable", async () => {
    const result = await checkRedditEmbed(url, "TurboLagGalore", {
      fetchImpl: mockFetch(200, {
        data: [post({ removed_by: "moderator" })],
      }) as never,
    });
    expect(result).toMatchObject({ outcome: "unavailable", reason: "removed" });
  });

  it("marks author mismatch as unavailable", async () => {
    const result = await checkRedditEmbed(url, "TurboLagGalore", {
      fetchImpl: mockFetch(200, {
        data: [post({ author: "someone_else" })],
      }) as never,
    });
    expect(result.outcome).toBe("unavailable");
    expect(result.reason).toContain("author-mismatch");
  });

  it("treats deleted accounts and index gaps as inconclusive", async () => {
    const deleted = await checkRedditEmbed(url, "TurboLagGalore", {
      fetchImpl: mockFetch(200, {
        data: [post({ author: "[deleted]" })],
      }) as never,
    });
    expect(deleted).toMatchObject({
      outcome: "inconclusive",
      reason: "author-deleted",
    });
    const gap = await checkRedditEmbed(url, "TurboLagGalore", {
      fetchImpl: mockFetch(200, { data: [] }) as never,
    });
    expect(gap).toMatchObject({
      outcome: "inconclusive",
      reason: "not-indexed",
    });
    const down = await checkRedditEmbed(url, "TurboLagGalore", {
      fetchImpl: abortingFetch() as never,
    });
    expect(down.outcome).toBe("inconclusive");
  });
});

describe("checkXEmbed", () => {
  const url = "https://x.com/example_user/status/1234567890";

  it("marks oEmbed 200 with author as available", async () => {
    const result = await checkXEmbed(url, {
      fetchImpl: mockFetch(200, { author_name: "someone" }) as never,
    });
    expect(result).toMatchObject({ url, outcome: "available" });
  });

  it("marks oEmbed 404 as unavailable", async () => {
    const result = await checkXEmbed(url, {
      fetchImpl: mockFetch(404, {}) as never,
    });
    expect(result).toMatchObject({ outcome: "unavailable" });
  });

  it("marks login-wall and network errors as inconclusive", async () => {
    expect(
      (await checkXEmbed(url, { fetchImpl: mockFetch(403, {}) as never }))
        .outcome,
    ).toBe("inconclusive");
    expect(
      (await checkXEmbed(url, { fetchImpl: abortingFetch() as never })).outcome,
    ).toBe("inconclusive");
  });
});

describe("toLinkOutcome", () => {
  it("maps embed outcomes onto link-state outcomes", () => {
    expect(toLinkOutcome("available")).toBe("reachable");
    expect(toLinkOutcome("unavailable")).toBe("broken");
    expect(toLinkOutcome("inconclusive")).toBe("inconclusive");
  });
});

describe("checkEmbedAvailability", () => {
  function fixtureSeeds(dir: string): string {
    const seedDir = path.join(dir, "seeds");
    mkdirSync(seedDir, { recursive: true });
    writeFileSync(
      path.join(seedDir, "a-vs-b.ts"),
      [
        "export const seed = {",
        "  embeds: [",
        '    { provider: "youtube", url: "https://www.youtube.com/watch?v=ok000000001", title: "t" },',
        '    { provider: "reddit", url: "https://www.reddit.com/r/x/comments/abc1234/t/", author: "someone", title: "t" },',
        "  ],",
        "};",
      ].join("\n"),
    );
    return seedDir;
  }

  function okFetch(url: string) {
    if (url.includes("youtube.com")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({ html: "<iframe></iframe>" }),
      };
    }
    return {
      ok: true,
      status: 200,
      json: async () => ({
        data: [{ id: "abc1234", author: "someone", removed_by: null }],
      }),
    };
  }

  it("saves state and reports every URL as available", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "embed-avail-"));
    const seedDir = fixtureSeeds(dir);
    const statePath = path.join(dir, "state.json");
    const summary = await checkEmbedAvailability({
      seedDir,
      fetchImpl: okFetch as never,
      statePath,
    });
    expect(summary.total).toBe(2);
    const saved = JSON.parse(readFileSync(statePath, "utf8"));
    expect(
      saved.urls["https://www.youtube.com/watch?v=ok000000001"],
    ).toMatchObject({ lastOutcome: "reachable" });
    expect(
      saved.urls["https://www.reddit.com/r/x/comments/abc1234/t/"],
    ).toMatchObject({ lastOutcome: "reachable" });
  });

  it("fails immediately when any embed is confirmed gone", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "embed-avail-"));
    const seedDir = fixtureSeeds(dir);
    const badFetch = async (url: string) =>
      url.includes("youtube.com")
        ? { ok: false, status: 404, json: async () => ({}) }
        : {
            ok: true,
            status: 200,
            json: async () => ({
              data: [{ id: "abc1234", author: "someone", removed_by: null }],
            }),
          };
    await expect(
      checkEmbedAvailability({
        seedDir,
        fetchImpl: badFetch as never,
        statePath: path.join(dir, "state.json"),
      }),
    ).rejects.toThrow(/unavailable embeds/);
  });

  it("keeps a YouTube 200-without-html as inconclusive, not broken", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "embed-avail-"));
    const seedDir = fixtureSeeds(dir);
    const inconclusiveFetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({}),
    });
    const summary = await checkEmbedAvailability({
      seedDir,
      fetchImpl: inconclusiveFetch as never,
      statePath: path.join(dir, "state.json"),
    });
    expect(summary.total).toBe(2);
  });
});
