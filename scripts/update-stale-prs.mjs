/**
 * scripts/update-stale-prs.mjs
 *
 * main に取り残された（behind した）PR を定期整備する。
 *
 * 「1 日以上取り残された behind PR」の定義:
 *   - open な PR で、main にあって PR head にないコミットが 1 件以上
 *   - かつ PR head の最終コミット（pushProxy に使用）が 24 時間より前
 *     （= 24 時間以上新規 push がなく behind し続けている）
 *
 * 条件に合致した PR には:
 *   1. `gh pr update-branch` で main をマージして behind を解消
 *   2. 成功した場合のみ、告知コメントを 1 件投稿（コンフリクト等で失敗した
 *      場合はコメントしない = スパムにならず、次回 run で再試行）
 *
 * mergeable=CONFLICTING の PR は更新せずスキップする（GitHub UI が
 * コンフリクトを表示するため、ここで毎日コメントするとノイズになる）。
 *
 * 使い方:
 *   node scripts/update-stale-prs.mjs [--dry-run]
 *
 * 必要な環境変数: GH_TOKEN（Actions では github.token）、GITHUB_REPOSITORY。
 */

import { execFileSync } from "node:child_process";

export const STALE_AFTER_MS = 24 * 60 * 60 * 1000;
export const COMMENT_MARKER = "<!-- stale-pr-updater -->";

/** gh api に渡す REST endpoint は常に 1 引数の文字列として生成する。 */
export function apiEndpoints(repo, headSha, prNumber) {
  return {
    pulls: `repos/${repo}/pulls?state=open&per_page=100&sort=updated&direction=desc`,
    compare: `repos/${repo}/compare/main...${headSha}`,
    commit: `repos/${repo}/commits/${headSha}`,
    pull: `repos/${repo}/pulls/${prNumber}`,
  };
}

/**
 * PR 一覧から「更新対象」を選別する（純粋関数・テスト対象）。
 * @param {Array<{number:number, behindBy:number, headAgeMs:number, mergeable:string, isDraft:boolean}>} prs
 * @param {number} nowMs
 */
export function selectStalePrs(prs, nowMs = Date.now()) {
  return prs.filter(
    (pr) =>
      pr.behindBy > 0 &&
      nowMs - pr.headAgeMs > STALE_AFTER_MS &&
      pr.mergeable === "MERGEABLE" &&
      pr.isDraft !== true,
  );
}

/** 更新告知コメントの本文。 */
export function buildComment(behindBy, headSha) {
  return [
    COMMENT_MARKER,
    `この PR は main に \`${behindBy}\` コミット遅れていたため、ブランチを main で更新しました（head: \`${headSha}\`）。`,
    "",
    "CI が再実行されます。コンフリクトが発生した場合は手動で解消してください。",
  ].join("\n");
}

function ghJson(args) {
  return JSON.parse(execFileSync("gh", ["api", ...args], { encoding: "utf8" }));
}

function ghText(args) {
  return execFileSync("gh", args, { encoding: "utf8" }).trim();
}

/** open PR の behind 数と head の年齢を収集する（API アクセスを伴う）。 */
export async function collectOpenPrs(repo) {
  const pulls = ghJson([apiEndpoints(repo, "", 0).pulls]);
  const prs = [];
  for (const pr of pulls) {
    const endpoints = apiEndpoints(repo, pr.head.sha, pr.number);
    const compare = ghJson([endpoints.compare]);
    const headCommit = ghJson([endpoints.commit]);
    const committerDate = headCommit.commit?.committer?.date;
    prs.push({
      number: pr.number,
      title: pr.title,
      behindBy: compare.behind_by ?? 0,
      headAgeMs: committerDate ? Date.parse(committerDate) : Date.now(),
      mergeable: compare.mergeable ?? pr.mergeable ?? "UNKNOWN",
      isDraft: pr.draft === true,
    });
  }
  return prs;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const repo = process.env.GITHUB_REPOSITORY ?? "kaenozu/kuraberu-products";
  const prs = await collectOpenPrs(repo);
  const stale = selectStalePrs(prs);

  if (prs.length === 0) {
    console.log("open PR なし — 何もしません。");
    return;
  }
  console.log(
    `open PR: ${prs.length} 件 / 更新対象: ${stale.length} 件${dryRun ? " (dry-run)" : ""}`,
  );

  for (const pr of stale) {
    const ageHours = Math.round((Date.now() - pr.headAgeMs) / 3600000);
    console.log(
      `#${pr.number} ${pr.title}: behind=${pr.behindBy}, head age=${ageHours}h`,
    );
    if (dryRun) {
      console.log(
        `  [dry-run] gh pr update-branch ${pr.number} を実行する箇所`,
      );
      continue;
    }
    try {
      ghText(["pr", "update-branch", String(pr.number), "--repo", repo]);
    } catch (error) {
      console.error(
        `  update-branch 失敗（コメントせず次回再試行）: ${error?.message ?? error}`,
      );
      continue;
    }
    const head =
      ghJson([apiEndpoints(repo, "", pr.number).pull]).head.sha ?? "";
    const comment = buildComment(pr.behindBy, head.slice(0, 7));
    const bodyPath = `${process.env.RUNNER_TEMP ?? process.env.TMPDIR ?? "."}/stale-pr-${pr.number}.md`;
    const { writeFileSync } = await import("node:fs");
    writeFileSync(bodyPath, comment, "utf8");
    ghText([
      "pr",
      "comment",
      String(pr.number),
      "--repo",
      repo,
      "--body-file",
      bodyPath,
    ]);
    console.log(`  updated + commented`);
  }
}

if (process.argv[1] && process.argv[1].endsWith("update-stale-prs.mjs")) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
