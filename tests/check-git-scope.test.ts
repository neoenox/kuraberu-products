import { describe, expect, it } from "vitest";
import {
  checkScope,
  findDuplicateCheckouts,
  parseWorktreePorcelain,
} from "../scripts/check-git-scope.mjs";

const PORCELAIN = [
  "worktree C:/repo",
  "HEAD abc123",
  "branch refs/heads/main",
  "",
  "worktree C:/wt-a",
  "HEAD def456",
  "branch refs/heads/agent/foo",
  "",
].join("\n");

describe("check-git-scope", () => {
  it("parses worktree porcelain output", () => {
    expect(parseWorktreePorcelain(PORCELAIN)).toEqual([
      { path: "C:/repo", branch: "refs/heads/main", head: "abc123" },
      { path: "C:/wt-a", branch: "refs/heads/agent/foo", head: "def456" },
    ]);
  });

  it("passes when branch and remote match expectations", () => {
    const { ok, errors } = checkScope({
      insideRepo: true,
      currentBranch: "agent/foo",
      originUrl: "https://github.com/neoenox/kuraberu-products",
      worktrees: parseWorktreePorcelain(PORCELAIN),
      expectBranch: "agent/foo",
      expectRemote: "neoenox/kuraberu-products",
    });
    expect(ok).toBe(true);
    expect(errors).toEqual([]);
  });

  it("stops on branch mismatch (prevents operating on another session's branch)", () => {
    const { ok, errors } = checkScope({
      insideRepo: true,
      currentBranch: "article/other-task",
      originUrl: "https://github.com/neoenox/kuraberu-products",
      worktrees: [],
      expectBranch: "agent/foo",
    });
    expect(ok).toBe(false);
    expect(errors.join("\n")).toContain("branch不一致");
  });

  it("stops on remote mismatch", () => {
    const { ok, errors } = checkScope({
      insideRepo: true,
      currentBranch: "agent/foo",
      originUrl: "https://github.com/someone/elsewhere",
      worktrees: [],
      expectRemote: "neoenox/kuraberu-products",
    });
    expect(ok).toBe(false);
    expect(errors.join("\n")).toContain("remote不一致");
  });

  it("detects the same branch checked out in multiple worktrees", () => {
    const dups = findDuplicateCheckouts([
      { path: "C:/a", branch: "refs/heads/agent/foo", head: "1" },
      { path: "C:/b", branch: "refs/heads/agent/foo", head: "1" },
      { path: "C:/c", branch: "refs/heads/main", head: "2" },
    ]);
    expect(dups).toEqual([
      { branch: "refs/heads/agent/foo", paths: ["C:/a", "C:/b"] },
    ]);
    const { ok, errors } = checkScope({
      insideRepo: true,
      currentBranch: "agent/foo",
      originUrl: "https://github.com/neoenox/kuraberu-products",
      worktrees: [
        { path: "C:/a", branch: "refs/heads/agent/foo", head: "1" },
        { path: "C:/b", branch: "refs/heads/agent/foo", head: "1" },
      ],
    });
    expect(ok).toBe(false);
    expect(errors.join("\n")).toContain("branch重複checkout");
  });

  it("fails outside a git repository", () => {
    expect(checkScope({ insideRepo: false }).ok).toBe(false);
  });

  it("stops when HEAD moved since it was last observed", () => {
    const base = {
      insideRepo: true,
      currentBranch: "agent/foo",
      head: "abc1234567890",
      originUrl: "https://github.com/neoenox/kuraberu-products",
      worktrees: [],
    };
    expect(checkScope({ ...base, expectHead: "abc1234" }).ok).toBe(true);
    const moved = checkScope({ ...base, expectHead: "def5678" });
    expect(moved.ok).toBe(false);
    expect(moved.errors.join("\n")).toContain("HEAD不一致");
  });

  it("passes when no expectations are set", () => {
    const { ok } = checkScope({
      insideRepo: true,
      currentBranch: "agent/foo",
      head: "abc1234",
      originUrl: "https://github.com/neoenox/kuraberu-products",
      worktrees: [],
    });
    expect(ok).toBe(true);
  });
});
