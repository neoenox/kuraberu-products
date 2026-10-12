import { describe, expect, it } from "vitest";
import {
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

  it.each([401, 404])("marks oEmbed %i as unavailable", async (status) => {
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
