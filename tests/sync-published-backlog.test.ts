import { describe, expect, it } from "vitest";
import {
  publishedTable,
  updatePublishedBacklog,
} from "../scripts/sync-published-backlog.mjs";

const tick = String.fromCharCode(96);
const fixture = [
  "## 現在の公開済み（1本）",
  "",
  "公開表はこの範囲だけ自動更新。",
  "",
  "| slug | 状態     |",
  "| ---- | -------- |",
  "| " + tick + "old" + tick + " | 公開済み |",
  "",
  "## 公開されていない記事（0本）",
  "",
  "非公開の説明は絶対に変更しない。",
  "",
].join("\n");

describe("published backlog table (#1068)", () => {
  it("deduplicates and sorts slugs before rendering", () => {
    const table = publishedTable(["b", "a", "b"]);
    expect(table.split("\n")).toHaveLength(4);
    expect(table.indexOf(tick + "a" + tick)).toBeLessThan(
      table.indexOf(tick + "b" + tick),
    );
  });

  it("updates only the published count and table, preserving other sections", () => {
    const updated = updatePublishedBacklog(fixture, ["new", "also-new"]);
    expect(updated).toContain("## 現在の公開済み（2本）");
    expect(updated).toContain(tick + "new" + tick);
    expect(updated).toContain(tick + "also-new" + tick);
    expect(updated).not.toContain(tick + "old" + tick);
    expect(updated).toContain("## 公開されていない記事（0本）");
    expect(updated).toContain("非公開の説明は絶対に変更しない。");
    expect(updatePublishedBacklog(updated, ["new", "also-new"])).toBe(updated);
  });

  it("fails closed if the publication table format is missing", () => {
    expect(() => updatePublishedBacklog("## unrelated", ["a"])).toThrow(
      "section boundaries",
    );
  });
});
