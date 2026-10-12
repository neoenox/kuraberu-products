import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import {
  INCONCLUSIVE_FAIL_THRESHOLD,
  INCONCLUSIVE_WARN_THRESHOLD,
  loadLinkState,
  saveLinkState,
  updateLinkEntry,
} from "./check-external-link-reachability.mjs";

// Embed availability (existence) checking for adopted social proof posts.
// Complements URL-shape validation (external-embeds) and generic anchor
// reachability (check-external-link-reachability): this script verifies that
// the cited post/video itself still exists and stays embeddable.
//
// Outcome model mirrors the reachability checker on purpose:
// - "available": post exists (and author matches the seed record, if any)
// - "unavailable": confirmed gone (deleted/private/removed) or integrity
//   mismatch. Fails the run immediately.
// - "inconclusive": network error, timeout, bot-defense status, or index gap.
//   Never fails alone; escalates via consecutive-run thresholds in state.
export const EMBED_STATE_FILE = "data/embed-availability-state.json";
export const EMBED_STATE_ARTIFACT_NAME = "embed-availability-state";
export const EMBED_TIMEOUT_MS = 10_000;
export const YOUTUBE_OEMBED_ENDPOINT = "https://www.youtube.com/oembed";
export const X_OEMBED_ENDPOINT = "https://publish.x.com/oembed";
export const ARCTIC_SUBMISSION_ENDPOINT =
  "https://api.pullpush.io/reddit/search/submission/";

/**
 * Find `embeds: [...]` array spans in a seed source file.
 */
export function extractEmbedBlocks(source) {
  const blocks = [];
  let index = 0;
  while (true) {
    const key = source.indexOf("embeds:", index);
    if (key === -1) break;
    const open = source.indexOf("[", key);
    if (open === -1) break;
    let depth = 0;
    let end = -1;
    for (let i = open; i < source.length; i++) {
      if (source[i] === "[") depth++;
      else if (source[i] === "]") {
        depth--;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }
    if (end === -1) break;
    blocks.push(source.slice(open + 1, end));
    index = end + 1;
  }
  return blocks;
}

function readField(recordText, name) {
  const match = recordText.match(new RegExp(`${name}:\\s*"([^"]*)"`, ""));
  return match ? match[1] : undefined;
}

/**
 * Parse flat `{ provider, url, ... }` records inside one embeds block.
 */
export function parseEmbedRecords(block) {
  const records = [];
  // Records are flat objects; split on top-level `{ ... }` groups.
  const groups = block.match(/\{[^{}]*\}/g) ?? [];
  for (const group of groups) {
    const provider = readField(group, "provider");
    const url = readField(group, "url");
    if (!provider || !url) continue;
    records.push({
      provider,
      url,
      author: readField(group, "author"),
      title: readField(group, "title"),
    });
  }
  return records;
}

/**
 * Collect embed records from commercial seeds. Returns
 * [{ file, provider, url, author?, title? }].
 */
export function collectEmbedRecords(
  seedDir = "src/content/articles/commercial",
) {
  const records = [];
  for (const file of fs
    .readdirSync(seedDir)
    .filter((name) => name.endsWith(".ts"))
    .sort()) {
    const source = fs.readFileSync(path.join(seedDir, file), "utf8");
    for (const block of extractEmbedBlocks(source)) {
      for (const record of parseEmbedRecords(block)) {
        records.push({ file, ...record });
      }
    }
  }
  return records;
}

/**
 * Extract a Reddit submission id from a /comments/<id>/ permalink.
 */
export function parseRedditId(url) {
  const match = url.match(/\/comments\/([a-z0-9]+)(?:\/|[?#]|$)/i);
  return match ? match[1] : null;
}

async function fetchJson(url, { fetchImpl, timeoutMs }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "kuraberu-products-embed-check/1.0" },
    });
    if (!response.ok) {
      return { status: response.status, json: null };
    }
    try {
      return { status: response.status, json: await response.json() };
    } catch {
      return { status: response.status, json: null, reason: "invalid-json" };
    }
  } catch (error) {
    return {
      status: null,
      json: null,
      reason:
        error instanceof Error && error.name === "AbortError"
          ? "timeout"
          : "network-error",
    };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * YouTube: oEmbed 200 (+html) means the video exists and stays embeddable.
 * 401/404 mean private/deleted. Anything else is inconclusive (bot defense
 * and transient errors must not fail the run on their own).
 */
export async function checkYouTubeEmbed(
  url,
  { fetchImpl = fetch, timeoutMs = EMBED_TIMEOUT_MS } = {},
) {
  const endpoint = `${YOUTUBE_OEMBED_ENDPOINT}?url=${encodeURIComponent(url)}&format=json`;
  const { status, json, reason } = await fetchJson(endpoint, {
    fetchImpl,
    timeoutMs,
  });
  if (status === 200 && json && typeof json.html === "string") {
    return { url, outcome: "available" };
  }
  if (status === 400 || status === 401 || status === 404) {
    return { url, outcome: "unavailable", reason: `oembed-http-${status}` };
  }
  return {
    url,
    outcome: "inconclusive",
    reason: reason ?? `oembed-http-${status}`,
  };
}

/**
 * Reddit: Arctic Shift public index lookup by full submission id.
 * Missing-from-index is inconclusive (index gaps exist), removed_by set is
 * unavailable, author mismatch against the seed record is unavailable
 * (deterministic integrity signal once data is fetched).
 */
export async function checkRedditEmbed(
  url,
  expectedAuthor,
  { fetchImpl = fetch, timeoutMs = EMBED_TIMEOUT_MS } = {},
) {
  const id = parseRedditId(url);
  if (!id) {
    return { url, outcome: "inconclusive", reason: "unparseable-id" };
  }
  const endpoint = `${ARCTIC_SUBMISSION_ENDPOINT}?ids=${encodeURIComponent(id)}`;
  const { status, json, reason } = await fetchJson(endpoint, {
    fetchImpl,
    timeoutMs,
  });
  if (status !== 200 || !json || !Array.isArray(json.data)) {
    return {
      url,
      outcome: "inconclusive",
      reason: reason ?? `index-http-${status}`,
    };
  }
  const post = json.data.find((item) => item && item.id === id);
  if (!post) {
    return { url, outcome: "inconclusive", reason: "not-indexed" };
  }
  if (post.removed_by) {
    return { url, outcome: "unavailable", reason: "removed" };
  }
  if (
    expectedAuthor &&
    post.author !== expectedAuthor &&
    post.author !== "[deleted]"
  ) {
    return {
      url,
      outcome: "unavailable",
      reason: `author-mismatch(expected=${expectedAuthor},actual=${post.author})`,
    };
  }
  if (expectedAuthor && post.author === "[deleted]") {
    return { url, outcome: "inconclusive", reason: "author-deleted" };
  }
  return { url, outcome: "available" };
}

/**
 * X: official oEmbed. 200 means the post exists and stays embeddable,
 * 404 means deleted/protected. 401/403 stay inconclusive (login-wall and
 * bot-defense responses are ambiguous).
 */
export async function checkXEmbed(
  url,
  { fetchImpl = fetch, timeoutMs = EMBED_TIMEOUT_MS } = {},
) {
  const endpoint = `${X_OEMBED_ENDPOINT}?url=${encodeURIComponent(url)}`;
  const { status, json, reason } = await fetchJson(endpoint, {
    fetchImpl,
    timeoutMs,
  });
  if (status === 200 && json && typeof json.author_name === "string") {
    return { url, outcome: "available" };
  }
  if (status === 404) {
    return { url, outcome: "unavailable", reason: "oembed-http-404" };
  }
  return {
    url,
    outcome: "inconclusive",
    reason: reason ?? `oembed-http-${status}`,
  };
}

export function toLinkOutcome(embedOutcome) {
  if (embedOutcome === "available") return "reachable";
  if (embedOutcome === "unavailable") return "broken";
  return "inconclusive";
}

export async function checkEmbedAvailability({
  seedDir = "src/content/articles/commercial",
  fetchImpl = fetch,
  timeoutMs = EMBED_TIMEOUT_MS,
  statePath = EMBED_STATE_FILE,
} = {}) {
  const records = collectEmbedRecords(seedDir).filter((record) =>
    ["youtube", "reddit", "x"].includes(record.provider),
  );
  const seen = new Map();
  for (const record of records) {
    if (!seen.has(record.url)) seen.set(record.url, []);
    seen.get(record.url).push(record);
  }
  const state = loadLinkState(statePath);
  const warnings = [];
  const errors = [];
  const unavailable = [];

  for (const [url, holders] of seen) {
    const provider = holders[0].provider;
    const expectedAuthor =
      holders.find((holder) => holder.author)?.author ?? undefined;
    let result;
    if (provider === "youtube") {
      result = await checkYouTubeEmbed(url, { fetchImpl, timeoutMs });
    } else if (provider === "reddit") {
      result = await checkRedditEmbed(url, expectedAuthor, {
        fetchImpl,
        timeoutMs,
      });
    } else {
      result = await checkXEmbed(url, { fetchImpl, timeoutMs });
    }

    const prev = state.urls[url];
    state.urls[url] = updateLinkEntry(
      prev,
      toLinkOutcome(result.outcome),
      result.reason,
    );
    const entry = state.urls[url];
    const consecutive = entry.consecutiveInconclusive || 0;
    if (consecutive >= INCONCLUSIVE_FAIL_THRESHOLD) {
      errors.push(
        `${url}: ${consecutive} consecutive inconclusive results (last: ${entry.lastReason ?? "unknown"}) — needs human review`,
      );
    } else if (consecutive >= INCONCLUSIVE_WARN_THRESHOLD) {
      warnings.push(
        `${url}: ${consecutive} consecutive inconclusive results (last: ${entry.lastReason ?? "unknown"})`,
      );
    }
    if (result.outcome === "unavailable") {
      const files = [...new Set(holders.map((holder) => holder.file))].join(
        ", ",
      );
      unavailable.push(`${url} (${result.reason}; used in ${files})`);
    }
    const detail = result.reason ?? result.outcome;
    console.log(`${result.outcome}: ${url} (${detail})`);
  }

  const currentUrls = new Set(seen.keys());
  for (const url of Object.keys(state.urls)) {
    if (!currentUrls.has(url)) delete state.urls[url];
  }
  saveLinkState(state, statePath);

  if (warnings.length) {
    for (const warning of warnings) console.warn(`⚠ ${warning}`);
  }
  if (errors.length) {
    throw new Error(
      `Embeds with persistent inconclusive status (>=${INCONCLUSIVE_FAIL_THRESHOLD} consecutive runs):\n${errors.join("\n")}`,
    );
  }
  if (unavailable.length) {
    throw new Error(`unavailable embeds:\n${unavailable.join("\n")}`);
  }
  console.log(`embed availability ok: ${seen.size} URLs`);
  return { total: seen.size, warnings };
}

export function restoreEmbedStateArtifact({
  repository = process.env.GITHUB_REPOSITORY,
  defaultBranch = process.env.DEFAULT_BRANCH,
  runId = process.env.GITHUB_RUN_ID,
  statePath = EMBED_STATE_FILE,
  artifactName = EMBED_STATE_ARTIFACT_NAME,
  runGh = (args) =>
    execFileSync("gh", args, {
      encoding: "utf8",
      timeout: 120_000,
      maxBuffer: 16 * 1024 * 1024,
    }),
} = {}) {
  if (!repository || !defaultBranch || !runId) {
    throw new Error(
      "Artifact restore requires repository, default branch and run ID",
    );
  }
  const api = (endpoint, ...args) =>
    JSON.parse(runGh(["api", endpoint, ...args]));
  const currentRun = api(`repos/${repository}/actions/runs/${runId}`);
  const pages = api(
    `repos/${repository}/actions/artifacts?name=${artifactName}&per_page=100`,
    "--paginate",
    "--slurp",
  );
  const artifacts = pages
    .flatMap((page) => page.artifacts)
    .filter(
      (artifact) =>
        artifact.name === artifactName &&
        artifact.workflow_run?.head_branch === defaultBranch,
    )
    .sort((a, b) => b.created_at.localeCompare(a.created_at) || b.id - a.id);

  for (const artifact of artifacts) {
    const run = api(
      `repos/${repository}/actions/runs/${artifact.workflow_run.id}`,
    );
    if (
      run.workflow_id !== currentRun.workflow_id ||
      run.head_branch !== defaultBranch ||
      run.head_repository?.full_name !== repository
    )
      continue;
    if (artifact.expired)
      throw new Error(
        `Latest embed availability state artifact ${artifact.id} has expired`,
      );
    const directory = fs.mkdtempSync(
      path.join(tmpdir(), "embed-availability-"),
    );
    try {
      runGh([
        "run",
        "download",
        String(artifact.workflow_run.id),
        "--repo",
        repository,
        "--name",
        artifactName,
        "--dir",
        directory,
      ]);
      const downloadedPath = path.join(directory, path.basename(statePath));
      if (!fs.existsSync(downloadedPath))
        throw new Error(
          "Downloaded artifact is missing embed-availability-state.json",
        );
      saveLinkState(loadLinkState(downloadedPath), statePath);
      console.log(
        `Restored embed availability state from run ${artifact.workflow_run.id}`,
      );
      return;
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  }
  console.log(
    "No prior embed availability state artifact found; starting first-run state",
  );
}

const invokedPath = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href
  : undefined;
if (invokedPath === import.meta.url) {
  if (process.argv.includes("--restore-state")) restoreEmbedStateArtifact();
  else await checkEmbedAvailability();
}
