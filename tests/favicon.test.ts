import { readFileSync, existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * favicon.ico の回帰テスト。
 * ブラウザは /favicon.svg のlink宣言があっても /favicon.ico を自動取得するため、
 * 存在しないと全ページでコンソール404が出る。ICOマジックと最低1エントリを検証する。
 */
describe("favicon", () => {
  it("provides a valid favicon.ico", () => {
    const file = "public/favicon.ico";
    expect(existsSync(file), "public/favicon.ico が必要").toBe(true);
    const buf = readFileSync(file);
    expect(buf.subarray(0, 4).toString("hex")).toBe("00000100");
    expect(buf.readUInt16LE(4)).toBeGreaterThanOrEqual(1);
  });

  it("keeps the SVG icon reference in the base layout", () => {
    const layout = readFileSync("src/layouts/BaseLayout.astro", "utf8");
    expect(layout).toContain('href="/favicon.svg"');
  });
});
