/**
 * scripts/check-product-master.mjs
 *
 * 商品マスタ（src/data/products/catalog.json）のスキーマ検証CLI（#1064 Phase 1）。
 * fail-closed: 不正データなら exit 1。判定は scripts/validators/product-master.mjs と
 * 共有し、tests/product-master.test.ts と同じ純粋関数を使う。
 *
 * 使い方:
 *   node scripts/check-product-master.mjs check
 *   node scripts/check-product-master.mjs check --file path/to/catalog.json
 */
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { validateProductMaster } from "./validators/product-master.mjs";

export const DEFAULT_MASTER_PATH = "src/data/products/catalog.json";

/**
 * マスタファイルを読み込んで検証する。
 * @returns {string[]} 問題点（読み込み失敗も文字列で返す）
 */
export function checkProductMaster(file = DEFAULT_MASTER_PATH) {
  if (!fs.existsSync(file)) {
    return [`${file}: not found`];
  }
  let master;
  try {
    master = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    return [`${file}: invalid JSON (${error.message})`];
  }
  return validateProductMaster(master).map((error) => `${file}: ${error}`);
}

function main() {
  const mode = process.argv[2] ?? "check";
  if (mode !== "check") {
    console.error(`ERROR: unknown mode: ${mode}`);
    process.exitCode = 2;
    return;
  }
  const fileIndex = process.argv.indexOf("--file");
  const file =
    fileIndex === -1 ? DEFAULT_MASTER_PATH : process.argv[fileIndex + 1];
  const errors = checkProductMaster(file);
  if (errors.length > 0) {
    console.error(`product-master check failed: ${errors.length} problem(s)`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(`product-master check passed: ${file}`);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main();
}
