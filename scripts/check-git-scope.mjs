#!/usr/bin/env node
/**
 * scripts/check-git-scope.mjs — Git操作前の作業対象の自動検証
 *
 * 並行セッションが別branch・別worktreeで動く運用で、操作対象の取り違え
 * （別担当のworktree・branchへのcommit/push/merge）を仕組みで防ぐ。
 * - 現在のworktreeパス・branch・HEAD・origin URLを表示する
 * - --expect-branch / --expect-remote と不一致なら exit 1 で停止する
 * - 同一branchが複数worktreeでcheckoutされていたら exit 1 で停止する
 *   （並行セッションの競合リスクを検出する）
 *
 * CIゲートには組み込まない（ detached HEAD のCI checkout では意味がない）。
 * エージェントが破壊的操作（commit/push/merge/worktree操作）の直前に実行する。
 * 使い方:
 *   node scripts/check-git-scope.mjs --expect-branch agent/foo
 *   node scripts/check-git-scope.mjs --expect-branch agent/foo --expect-remote neoenox/kuraberu-products
 */
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export function parseWorktreePorcelain(text) {
  const worktrees = [];
  let current = null;
  for (const line of text.split("\n")) {
    if (line.startsWith("worktree ")) {
      current = {
        path: line.slice("worktree ".length),
        branch: null,
        head: null,
      };
      worktrees.push(current);
    } else if (line.startsWith("branch ") && current) {
      current.branch = line.slice("branch ".length);
    } else if (line.startsWith("HEAD ") && current) {
      current.head = line.slice("HEAD ".length);
    }
  }
  return worktrees;
}

export function findDuplicateCheckouts(worktrees) {
  const byBranch = new Map();
  for (const wt of worktrees) {
    if (!wt.branch || wt.branch.endsWith("/HEAD")) continue;
    if (!byBranch.has(wt.branch)) byBranch.set(wt.branch, []);
    byBranch.get(wt.branch).push(wt.path);
  }
  return [...byBranch.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([branch, paths]) => ({ branch, paths }));
}

export function checkScope(state) {
  const errors = [];
  if (!state.insideRepo) {
    return { ok: false, errors: ["gitリポジトリ内で実行してください"] };
  }
  if (state.expectBranch && state.currentBranch !== state.expectBranch) {
    errors.push(
      `branch不一致: 期待=${state.expectBranch} 実際=${state.currentBranch ?? "(detached)"}。操作を停止します`,
    );
  }
  if (
    state.expectRemote &&
    !(state.originUrl ?? "").includes(state.expectRemote)
  ) {
    errors.push(
      `remote不一致: 期待に${state.expectRemote}を含むこと 実際=${state.originUrl ?? "(なし)"}。操作を停止します`,
    );
  }
  for (const dup of findDuplicateCheckouts(state.worktrees)) {
    errors.push(
      `branch重複checkout: ${dup.branch} が ${dup.paths.join(" / ")} で開かれています。並行セッションと競合するため操作を停止します`,
    );
  }
  return { ok: errors.length === 0, errors };
}

function runGit(args, cwd) {
  try {
    return execFileSync("git", args, {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch {
    return null;
  }
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--expect-branch") out.expectBranch = argv[++i];
    else if (argv[i] === "--expect-remote") out.expectRemote = argv[++i];
  }
  return out;
}

function collectState(cwd, opts) {
  const toplevel = runGit(["rev-parse", "--show-toplevel"], cwd);
  if (!toplevel) return { insideRepo: false };
  const branchOut = runGit(["branch", "--show-current"], cwd);
  return {
    insideRepo: true,
    cwd,
    toplevel,
    currentBranch: branchOut === "" ? null : branchOut,
    head: runGit(["rev-parse", "HEAD"], cwd),
    originUrl: runGit(["remote", "get-url", "origin"], cwd),
    worktrees: parseWorktreePorcelain(
      runGit(["worktree", "list", "--porcelain"], cwd) ?? "",
    ),
    expectBranch: opts.expectBranch,
    expectRemote: opts.expectRemote,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const state = collectState(process.cwd(), parseArgs(process.argv.slice(2)));
  if (state.insideRepo) {
    console.log(
      `worktree=${state.toplevel} branch=${state.currentBranch ?? "(detached)"} head=${state.head?.slice(0, 7)} origin=${state.originUrl}`,
    );
  }
  const { ok, errors } = checkScope(state);
  for (const error of errors) console.error(`error: ${error}`);
  if (!ok) process.exit(1);
  console.log("git scope ok");
}
