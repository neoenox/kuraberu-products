import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { afterAll, describe, expect, it } from "vitest";
import { checkImageBudget } from "../scripts/check-image-budget.mjs";

const temporaryDirs: string[] = [];

function makeTemporaryDir(prefix: string) {
  const dir = mkdtempSync(path.join(tmpdir(), prefix));
  temporaryDirs.push(dir);
  return dir;
}

afterAll(() => {
  for (const dir of temporaryDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

function catalog(files: Record<string, number>) {
  const dir = makeTemporaryDir("image-budget-");
  for (const [name, size] of Object.entries(files)) {
    writeFileSync(path.join(dir, name), Buffer.alloc(size));
  }
  return pathToFileURL(`${dir}${path.sep}`);
}

describe("check-image-budget", () => {
  it("passes within budget", async () => {
    const catalogs = [
      { dir: catalog({ "a.png": 10, "b.jpg": 20 }), maxTotalBytes: 100 },
    ];
    const result = await checkImageBudget({ catalogs, maxFileBytes: 100 });
    expect(result.errors).toEqual([]);
    expect(result.count).toBe(2);
  });

  it("flags oversize files and totals, ignoring non-images", async () => {
    const catalogs = [
      {
        dir: catalog({ "big.png": 200, "note.txt": 500, "c.jpg": 60 }),
        maxTotalBytes: 150,
      },
    ];
    const { errors } = await checkImageBudget({ catalogs, maxFileBytes: 100 });
    expect(errors).toHaveLength(2);
    expect(errors[0]).toContain("big.png");
    expect(errors[1]).toContain("total");
  });

  it("checks nested product images but ignores other file types", async () => {
    const dir = makeTemporaryDir("image-budget-nested-");
    const nested = path.join(dir, "brand", "model");
    mkdirSync(nested, { recursive: true });
    writeFileSync(path.join(nested, "oversized.webp"), Buffer.alloc(110));
    writeFileSync(path.join(nested, "notes.txt"), Buffer.alloc(500));
    writeFileSync(path.join(dir, "thumb.png"), Buffer.alloc(20));

    const { count, total, errors } = await checkImageBudget({
      catalogs: [
        { dir: pathToFileURL(`${dir}${path.sep}`), maxTotalBytes: 100 },
      ],
      maxFileBytes: 100,
    });
    expect(count).toBe(2);
    expect(total).toBe(130);
    expect(errors).toHaveLength(2);
    expect(errors[0]).toContain("oversized.webp");
    expect(errors[1]).toContain("total");
  });

  it("passes for the real catalog", async () => {
    const { errors } = await checkImageBudget();
    expect(errors).toEqual([]);
  });
});
