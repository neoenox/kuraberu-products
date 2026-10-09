/**
 * scripts/check-image-budget.mjs
 *
 * 商品画像（src/assets/products/ と public/products/）のサイズ予算を検査する CI ゲート。
 * 現状値を上限にしたラチェットで、予算を超える画像・総量の増加を防ぐ。
 * 画像を縮小できたら、上限も下げること（pnpm resize:images を参照）。
 *
 * 使用方法: node scripts/check-image-budget.mjs
 */

import { readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * src/assets はビルド時に最適化される元画像、public はそのまま配信される。
 * 総量の上限は性質ごとに分ける。
 */
export const CATALOGS = [
  {
    dir: new URL("../src/assets/products/", import.meta.url),
    maxTotalBytes: 42_000_000,
  },
  {
    dir: new URL("../public/products/", import.meta.url),
    maxTotalBytes: 16_000_000,
  },
];

/** 1ファイルあたりの上限（バイト）。 */
export const MAX_FILE_BYTES = 2_000_000;

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".gif",
]);

async function listImages(directory) {
  const base = fileURLToPath(directory);
  if (!existsSync(base)) return [];
  const entries = await readdir(base, { withFileTypes: true });
  return entries
    .filter(
      (entry) =>
        entry.isFile() &&
        IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase()),
    )
    .map((entry) => join(base, entry.name));
}

/** 画像サイズ予算の違反を返す。 */
export async function checkImageBudget({
  catalogs = CATALOGS,
  maxFileBytes = MAX_FILE_BYTES,
} = {}) {
  const errors = [];
  let total = 0;
  let count = 0;
  for (const { dir, maxTotalBytes } of catalogs) {
    let dirTotal = 0;
    for (const file of await listImages(dir)) {
      const { size } = await stat(file);
      dirTotal += size;
      count += 1;
      if (size > maxFileBytes) {
        errors.push(
          `${file}: ${size} bytes exceeds per-file budget ${maxFileBytes}`,
        );
      }
    }
    if (dirTotal > maxTotalBytes) {
      errors.push(
        `${fileURLToPath(dir)}: total ${dirTotal} bytes exceeds budget ${maxTotalBytes}`,
      );
    }
    total += dirTotal;
  }
  return { errors, total, count };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { errors, total, count } = await checkImageBudget();
  if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
  console.log(`image budget ok: ${count} files, ${total} bytes`);
}
