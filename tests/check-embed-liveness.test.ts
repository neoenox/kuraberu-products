import { describe, expect, it } from "vitest";
import {
  buildProbeRequest,
  classifyProbeResult,
  collectEmbedsFromSources,
  hasEmbedMarker,
} from "../scripts/check-embed-liveness.mjs";

describe("check-embed-liveness", () => {
  it("collects provider/url pairs from embeds blocks only", () => {
    const source = `
      leftRakutenUrl: "https://item.rakuten.co.jp/shop/item/",
      embeds: [
        {
          provider: "youtube",
          url: "https://www.youtube.com/watch?v=AN3eWFg2hRM",
        },
        {
          provider: "reddit",
          url: "https://www.reddit.com/r/TpLink/comments/1uxte6j/title/",
        },
      ],
      sourceLinks: [
        { url: "https://www.apple.com/jp/iphone-17e/specs/" },
      ],
    `;
    expect(collectEmbedsFromSources([{ file: "a.ts", source }])).toEqual([
      {
        file: "a.ts",
        provider: "youtube",
        url: "https://www.youtube.com/watch?v=AN3eWFg2hRM",
      },
      {
        file: "a.ts",
        provider: "reddit",
        url: "https://www.reddit.com/r/TpLink/comments/1uxte6j/title/",
      },
    ]);
  });

  it("builds unauthenticated probe requests for supported providers", () => {
    expect(
      buildProbeRequest(
        "youtube",
        "https://www.youtube.com/watch?v=AN3eWFg2hRM",
      )?.url,
    ).toContain("youtube.com/oembed");
    expect(buildProbeRequest("x", "https://x.com/a/status/123")?.url).toContain(
      "publish.twitter.com/oembed",
    );
    expect(
      buildProbeRequest(
        "reddit",
        "https://www.reddit.com/r/TpLink/comments/1uxte6j/",
      )?.url,
    ).toContain("redditmedia.com");
    expect(
      buildProbeRequest("tiktok", "https://www.tiktok.com/@a/video/123"),
    ).toBeNull();
  });

  it("classifies only confirmed removals as removed", () => {
    expect(classifyProbeResult({ status: 200, body: "{}" })).toBe("alive");
    for (const status of [400, 401, 403, 404]) {
      expect(classifyProbeResult({ status, body: "" })).toBe("removed");
    }
    // 通信障害・想定外応答は削除理由にしない
    expect(
      classifyProbeResult({ status: null, body: "", error: "timeout" }),
    ).toBe("inconclusive");
    expect(classifyProbeResult({ status: 500, body: "" })).toBe("inconclusive");
    expect(classifyProbeResult({ status: 429, body: "" })).toBe("inconclusive");
  });

  it("matches embed markers in escaped oEmbed bodies", () => {
    // 回帰: XのoEmbedは https:\/\/ とエスケープされるため、
    // 未正規化だとALIVEがWARNに落ちる
    const escaped =
      '{"html":"<script async src=\\"https:\\/\\/platform.x.com\\/widgets.js\\">"}';
    expect(escaped.includes("platform.x.com/widgets.js")).toBe(false);
    expect(hasEmbedMarker(escaped, "platform.x.com/widgets.js")).toBe(true);
    expect(hasEmbedMarker("no marker here", "platform.x.com/widgets.js")).toBe(
      false,
    );
  });

  it("covers every provider currently used in article seeds", async () => {
    const { readdirSync, readFileSync } = await import("node:fs");
    const { default: path } = await import("node:path");
    const dir = "src/content/articles/commercial";
    const providers = new Set<string>();
    for (const name of readdirSync(dir)) {
      if (!name.endsWith(".ts")) continue;
      const source = readFileSync(path.join(dir, name), "utf8");
      for (const m of source.matchAll(/embeds:\s*\[([\s\S]*?)\n\s*\],/g)) {
        for (const p of m[1].matchAll(/provider:\s*["']([^"']+)["']/g)) {
          providers.add(p[1]);
        }
      }
    }
    // 未配線プロバイダが増えたらテストが落ち、対応漏れを検出する
    for (const provider of providers) {
      expect(
        buildProbeRequest(provider, "https://example.com/"),
        `probe strategy for "${provider}"`,
      ).not.toBeNull();
    }
  });
});
