/**
 * scripts/check-product-master.mjs
 *
 * 商品マスタ（src/data/products/catalog.json）の検証CLI（#1064 Phase 1）。
 * 既定ファイルを検証するときは、あわせて記事seedの商品参照（Phase 2a）も検証する。
 * fail-closed: 不正データなら exit 1。判定は scripts/validators/*.mjs と共有し、
 * tests/product-master.test.ts / tests/product-master-resolution.test.ts と同じ純粋関数を使う。
 *
 * 使い方:
 *   node scripts/check-product-master.mjs check
 *   node scripts/check-product-master.mjs check --file path/to/catalog.json  # スキーマ検証のみ
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { collectSlots } from "./build-product-master.mjs";
import { validateArticleProductRefs } from "./validators/article-product-refs.mjs";
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

/**
 * 公開スコープの記事seedが、マスタの商品を一意に参照できるか検証する（#1064 Phase 2a）。
 * 未公開seedはマスタの変換元ではないため対象外（未公開分の拡充は Phase 2 以降）。
 *
 * @returns {{ slots: object[], errors: string[] }} 検証したスロットと問題点
 */
export function checkArticleProductRefs({ root = process.cwd() } = {}) {
  const slots = collectSlots(root);
  const file = path.join(root, DEFAULT_MASTER_PATH);
  if (!fs.existsSync(file)) {
    return { slots, errors: [`${DEFAULT_MASTER_PATH}: not found`] };
  }
  const master = JSON.parse(fs.readFileSync(file, "utf8"));
  return { slots, errors: validateArticleProductRefs(slots, master) };
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
  // 記事seedの商品参照（#1064 Phase 2a）は既定ファイルのときだけ検証する。
  // `--file` はスキーマ検証専用（マスタ単体を差し替えて試す用途を壊さないため）。
  let checkedSlots = 0;
  let explicitSlots = 0;
  if (errors.length === 0 && file === DEFAULT_MASTER_PATH) {
    const refs = checkArticleProductRefs();
    checkedSlots = refs.slots.length;
    explicitSlots = refs.slots.filter(
      (slot) => typeof slot.productId === "string" && slot.productId,
    ).length;
    errors.push(...refs.errors);
  }
  if (errors.length > 0) {
    console.error(`product-master check failed: ${errors.length} problem(s)`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(`product-master check passed: ${file}`);
  if (checkedSlots > 0) {
    console.log(
      `article-product-refs check passed: ${checkedSlots} slots (explicit ${explicitSlots} / derived ${checkedSlots - explicitSlots})`,
    );
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main();
}
