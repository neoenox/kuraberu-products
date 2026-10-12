#!/usr/bin/env node
/**
 * scripts/check-embed-liveness.mjs — SNS埋め込みURLの有効性検査 (warn-first)
 *
 * 記事seedの embeds[] から投稿URLを集め、無認証で叩ける公式エンドポイントで
 * 存在・埋め込み可否を確認する。
 * - YouTube: oEmbed (200 + embed HTMLあり = alive、4xx = removed)
 * - X: publish.twitter.com oEmbed (200 = alive、404 = removed)
 * - Reddit: redditmedia embed (200 = alive、4xx = removed)
 * - TikTok / Pinterest: 未配線のため SKIP
 *
 * 判定は3値で、ネットワーク障害・タイムアウトは inconclusive (WARN) とし、
 * 既存記事の削除理由にしない。FAIL (removed確定) がある場合のみ exit 1。
 * 外部依存のため verify ゲートには組み込まず、手動・定期実行用とする。
 * 使い方: node scripts/check-embed-liveness.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const REQUEST_TIMEOUT_MS = 10_000;

function canonicalize(provider, rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const host = url.hostname.toLowerCase();
  if (provider === "youtube") {
    let videoId = null;
    if (host === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] ?? null;
    } else if (
      ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(host)
    ) {
      if (url.pathname === "/watch") videoId = url.searchParams.get("v");
      else
        videoId =
          url.pathname.match(
            /^\/(?:shorts|embed)\/([A-Za-z0-9_-]{11})(?:\/|$)/,
          )?.[1] ?? null;
    }
    if (!videoId || !/^[A-Za-z0-9_-]{11}$/.test(videoId)) return null;
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
  if (provider === "x") {
    if (
      !["x.com", "www.x.com", "twitter.com", "www.twitter.com"].includes(host)
    )
      return null;
    const match = url.pathname.match(
      /^\/([A-Za-z0-9_]{1,15})\/status\/(\d+)(?:\/|$)/,
    );
    if (!match) return null;
    return `https://x.com/${match[1]}/status/${match[2]}`;
  }
  if (provider === "reddit") {
    if (!["reddit.com", "www.reddit.com"].includes(host)) return null;
    const match = url.pathname.match(
      /^\/r\/([A-Za-z0-9_]+)\/comments\/([A-Za-z0-9]+)(?:\/[^/]+)?(?:\/|$)/,
    );
    if (!match) return null;
    return `https://www.reddit.com/r/${match[1]}/comments/${match[2]}/`;
  }
  return null;
}

/** プロバイダごとの有効性プローブ先。未配線は null (SKIP)。 */
export function buildProbeRequest(provider, canonicalUrl) {
  if (provider === "youtube") {
    return {
      url: `https://www.youtube.com/oembed?url=${encodeURIComponent(canonicalUrl)}&format=json`,
      expectEmbedMarker: "/embed/",
    };
  }
  if (provider === "x") {
    return {
      url: `https://publish.twitter.com/oembed?url=${encodeURIComponent(canonicalUrl)}`,
      expectEmbedMarker: "platform.x.com/widgets.js",
    };
  }
  if (provider === "reddit") {
    const path = new URL(canonicalUrl).pathname.replace(/\/$/, "");
    return {
      url: `https://www.redditmedia.com${path}/?embed=true`,
      expectEmbedMarker: "Posted by",
    };
  }
  return null;
}

/**
 * プローブ結果の分類。removed確定の場合のみ 'removed' を返す。
 * 通信障害・タイムアウト・想定外応答は 'inconclusive' とし、削除理由にしない。
 * @param {{ status: number | null, body?: string, error?: unknown }} result
 */
export function classifyProbeResult({ status, error }) {
  if (error) return "inconclusive";
  if (typeof status !== "number") return "inconclusive";
  if (status >= 200 && status < 300) {
    return "alive";
  }
  if (status === 400 || status === 401 || status === 403 || status === 404) {
    return "removed";
  }
  return "inconclusive";
}

/** oEmbed応答はスラッシュをエスケープするため正規化してから照合する。 */
export function hasEmbedMarker(body, marker) {
  return body.replaceAll("\\/", "/").includes(marker);
}

export function collectEmbedsFromSources(files) {
  const found = [];
  for (const { file, source } of files) {
    for (const block of source.matchAll(/embeds:\s*\[([\s\S]*?)\n\s*\],/g)) {
      const body = block[1];
      const providers = [...body.matchAll(/provider:\s*["']([^"']+)["']/g)].map(
        (m) => m[1],
      );
      const urls = [...body.matchAll(/url:\s*["']([^"']+)["']/g)].map(
        (m) => m[1],
      );
      providers.forEach((provider, index) => {
        if (urls[index]) found.push({ file, provider, url: urls[index] });
      });
    }
  }
  return found;
}

async function probe(request) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(request.url, {
      signal: controller.signal,
      headers: { "User-Agent": "kuraberu-products-embed-check/1.0" },
    });
    const body = await response.text().catch(() => "");
    return { status: response.status, body };
  } catch (error) {
    return { status: null, body: "", error: String(error) };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const root = process.cwd();
  const articlesDir = path.join(
    root,
    "src",
    "content",
    "articles",
    "commercial",
  );
  const files = fs
    .readdirSync(articlesDir)
    .filter(
      (name) =>
        name.endsWith(".ts") &&
        ![
          "types.ts",
          "create.ts",
          "seeds.ts",
          "images.ts",
          "index.ts",
        ].includes(name),
    )
    .map((name) => ({
      file: name,
      source: fs.readFileSync(path.join(articlesDir, name), "utf8"),
    }));
  const embeds = collectEmbedsFromSources(files);
  const seen = new Set();
  const verdicts = [];
  for (const { file, provider, url } of embeds) {
    const canonical = canonicalize(provider, url);
    if (!canonical) {
      verdicts.push({ url, status: "SKIP", detail: `${file}: URL形式不正` });
      continue;
    }
    const key = `${provider}:${canonical}`;
    if (seen.has(key)) {
      verdicts.push({ url: canonical, status: "SKIP", detail: "重複" });
      continue;
    }
    seen.add(key);
    const request = buildProbeRequest(provider, canonical);
    if (!request) {
      verdicts.push({
        url: canonical,
        status: "SKIP",
        detail: `${provider}は未配線`,
      });
      continue;
    }
    const result = await probe(request);
    const verdict = classifyProbeResult(result);
    const markerOk =
      verdict === "alive" &&
      request.expectEmbedMarker &&
      !hasEmbedMarker(result.body, request.expectEmbedMarker);
    verdicts.push({
      url: canonical,
      status: verdict === "alive" && markerOk ? "WARN" : verdict.toUpperCase(),
      detail:
        verdict === "alive" && markerOk
          ? "到達するが埋め込みマーカーなし"
          : (result.error ?? `HTTP ${result.status}`),
    });
  }
  let removed = 0;
  for (const v of verdicts) {
    console.log(`${v.status} ${v.url} (${v.detail})`);
    if (v.status === "REMOVED") removed += 1;
  }
  console.log(
    `embed liveness: ${verdicts.length} URLs, ${removed} removed, ` +
      `${verdicts.filter((v) => v.status === "WARN").length} inconclusive, ` +
      `${verdicts.filter((v) => v.status === "SKIP").length} skipped`,
  );
  if (removed > 0) {
    console.error("Removed embeds found. Inspect before touching articles.");
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
