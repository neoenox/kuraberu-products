import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Article HTML must revalidate rather than be cached for days. Unpublished
// articles are pruned from the build (#1088); a long-lived edge cache entry for
// a removed URL keeps serving stale HTML after it should 404. This pins the
// policy in public/_headers.
const headers = readFileSync("public/_headers", "utf8");

function headerBlock(pathPattern: string): string {
  const lines = headers.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === pathPattern);
  if (start === -1) return "";
  const collected: string[] = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.trim() === "" || !/^\s/.test(line)) break;
    collected.push(line.trim());
  }
  return collected.join("\n");
}

describe("article HTML cache policy (#1088)", () => {
  it("declares a /articles/* header block", () => {
    expect(headerBlock("/articles/*")).not.toBe("");
  });

  it("revalidates article HTML instead of long-caching it", () => {
    expect(headerBlock("/articles/*")).toContain(
      "Cache-Control: public, max-age=0, must-revalidate",
    );
  });

  it("does not set a positive shared max-age for article HTML", () => {
    expect(headerBlock("/articles/*")).not.toMatch(/s-maxage=\s*[1-9]/);
  });
});
