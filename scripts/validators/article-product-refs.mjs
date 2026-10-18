/**
 * 記事seedの商品参照（#1064 Phase 2a）の純粋検証関数。
 *
 * 記事が商品マスタ（`src/data/products/catalog.json`）の商品を一意に参照できるかを
 * fail-closed に検証する。`scripts/check-product-master.mjs`（= `check:product-master`。
 * `verify:fast` / `verify:lint` / CI で実行される）と
 * `tests/product-master-resolution.test.ts` の両方から使い、同じ判定を共有する。
 *
 * 解決順は生成スクリプトと同じ **ASIN > model > name**（`scripts/build-product-master.mjs`）。
 * seed の `{side}ProductId` は任意で、書かれている場合はそれを正とし、導出結果と一致することを要求する
 * （片方だけ更新してマスタと食い違う状態を fail-closed で止めるため）。
 *
 * 検証対象は**公開スコープの記事**。マスタ自体が公開53スラッグを変換元にしているため、
 * 未公開seedが参照する商品は含まれない（未公開分の拡充は Phase 2 以降の対象）。
 *
 * 例外は投げず、見つかった問題を文字列配列で返す（呼び出し側が exit code を決める）。
 */
import { asinOf } from "../build-product-master.mjs";
import { PRODUCT_ID_PATTERN } from "./product-master.mjs";

export { PRODUCT_ID_PATTERN };

/** 解決の出所。`productId` は seed の明示指定、他はマスタからの導出。 */
export const RESOLUTION_SOURCES = ["productId", "amazon", "model", "name"];

/**
 * マスタの商品1件（`docs/article-data-schema-plan.md` §2.1 Product）。
 * @typedef {{
 *   id: string,
 *   brand?: string,
 *   line?: string,
 *   model?: string,
 *   name?: string,
 *   image?: string,
 *   officialUrl?: string,
 *   sellers?: {
 *     amazon?: { state?: string, url?: string, query?: string, checkedAt?: string },
 *     rakuten?: { state?: string, url?: string, query?: string, checkedAt?: string },
 *   },
 *   checkedAt?: string,
 * }} Product
 */

/**
 * 記事seedの片側（商品スロット）。`collectSlots()` が返す形と対応する。
 * @typedef {{
 *   articleId: string,
 *   side: "left" | "right",
 *   productId?: string | null,
 *   amazonUrl?: string | null,
 *   model?: string | null,
 *   name?: string | null,
 * }} ProductRef
 */

/**
 * マスタの索引。
 * @typedef {{
 *   byId: Map<string, Product>,
 *   byAsin: Map<string, Product>,
 *   byModel: Map<string, Product>,
 *   byName: Map<string, Product>,
 *   errors: string[],
 * }} MasterIndex
 */

/**
 * マスタを id / ASIN / model / 表示名 で引ける索引にする。
 *
 * 同じキーが別々の商品に付いている場合は `errors` に積む。どちらが引かれるかが
 * 索引の作り方（＝実行環境）に依存する状態を作らないため。
 *
 * @param {{ products?: Product[] } | null | undefined} master
 * @returns {MasterIndex}
 */
export function buildMasterIndex(master) {
  /** @type {MasterIndex} */
  const index = {
    byId: new Map(),
    byAsin: new Map(),
    byModel: new Map(),
    byName: new Map(),
    errors: [],
  };
  /**
   * @param {Map<string, Product>} map
   * @param {string} key
   * @param {Product} product
   */
  const add = (map, key, product) => {
    const existing = map.get(key);
    if (existing && existing.id !== product.id) {
      index.errors.push(
        `master: key ${JSON.stringify(key)} is ambiguous between ${existing.id} and ${product.id}`,
      );
      return;
    }
    map.set(key, product);
  };
  for (const product of master?.products ?? []) {
    if (typeof product?.id !== "string") continue;
    index.byId.set(product.id, product);
    if (product.id.startsWith("amazon-")) {
      add(
        index.byAsin,
        product.id.slice("amazon-".length).toUpperCase(),
        product,
      );
    }
    if (product.model) add(index.byModel, product.model, product);
    if (product.name) add(index.byName, product.name, product);
  }
  return index;
}

/**
 * `productId` を除いた導出キー（ASIN > model > name）で解決する。
 * 明示 `productId` との一致検証と併走テストに使う。
 *
 * @param {MasterIndex} index
 * @param {ProductRef} ref
 * @returns {{ product: Product | null, source: string | null }}
 */
export function resolveDerived(index, ref) {
  const asin = asinOf(ref.amazonUrl);
  if (asin) {
    const product = index.byAsin.get(asin);
    if (product) return { product, source: "amazon" };
  }
  if (ref.model) {
    const product = index.byModel.get(ref.model);
    if (product) return { product, source: "model" };
  }
  if (ref.name) {
    const product = index.byName.get(ref.name);
    if (product) return { product, source: "name" };
  }
  return { product: null, source: null };
}

/**
 * スロット1件を解決する。seed に `productId` があればそれを正とする。
 *
 * @param {MasterIndex} index
 * @param {ProductRef} ref
 * @returns {{ product: Product | null, source: string | null }}
 */
export function resolveProductRef(index, ref) {
  const declared = ref?.productId;
  if (typeof declared === "string" && declared) {
    return { product: index.byId.get(declared) ?? null, source: "productId" };
  }
  return resolveDerived(index, ref);
}

/**
 * 参照のラベル（`記事ID:side`）。エラー文の識別子。
 * @param {ProductRef} ref
 * @returns {string}
 */
export function refLabel(ref) {
  return `${ref.articleId}:${ref.side}`;
}

/**
 * 記事の商品参照を検証する（fail-closed）。
 *
 * 規則:
 * 1. `productId` を書いた場合、形式が正しくマスタに実在すること。
 * 2. `productId` は導出結果（ASIN > model > name）と同じ商品を指すこと。
 * 3. 公開スコープの全スロットがマスタの商品へ解決できること。
 * 4. 同じ記事で同じ商品が左右に重複しないこと。
 *
 * @param {ProductRef[]} refs
 * @param {{ products?: Product[] } | null | undefined} master
 * @returns {string[]} 問題点（空なら正常）
 */
export function validateArticleProductRefs(refs, master) {
  const index = buildMasterIndex(master);
  const errors = [...index.errors];
  /** `${articleId}:${productId}` → 先に見た side（同一記事内の重複検出） @type {Map<string, string>} */
  const seen = new Map();

  for (const ref of refs ?? []) {
    const label = refLabel(ref);
    const declared = ref?.productId;

    if (declared !== undefined && declared !== null) {
      if (typeof declared !== "string" || !PRODUCT_ID_PATTERN.test(declared)) {
        errors.push(
          `${label}: productId ${JSON.stringify(declared)} must match ${PRODUCT_ID_PATTERN}`,
        );
        continue;
      }
      if (!index.byId.has(declared)) {
        errors.push(
          `${label}: productId ${JSON.stringify(declared)} is not in the master`,
        );
        continue;
      }
      const derived = resolveDerived(index, ref);
      if (derived.product && derived.product.id !== declared) {
        errors.push(
          `${label}: productId ${declared} does not match ${derived.source} lookup (${derived.product.id})`,
        );
      }
    }

    const { product } = resolveProductRef(index, ref);
    if (!product) {
      errors.push(
        `${label}: could not resolve a master product (ASIN > model > name)`,
      );
      continue;
    }
    const key = `${ref.articleId}:${product.id}`;
    const previous = seen.get(key);
    if (previous && previous !== ref.side) {
      errors.push(
        `${label}: ${product.id} is already referenced by ${previous} in the same article`,
      );
    }
    seen.set(key, ref.side);
  }
  return errors;
}
