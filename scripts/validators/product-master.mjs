/**
 * 商品マスタ（#1064 Phase 1）の純粋検証関数。
 *
 * `scripts/check-product-master.mjs` と `tests/product-master.test.ts` の両方から
 * 使い、同じ fail-closed 判定を共有する。スキーマは
 * `docs/article-data-schema-plan.md` §2.1（ProductMaster）に一致させる。
 *
 * 例外は投げず、見つかった問題を文字列配列で返す（呼び出し側が exit code を決める）。
 */

/** 商品IDの形式。`amazon-<asin>` / `model-<slug>` / `name-<hash>` のいずれか。 */
export const PRODUCT_ID_PATTERN = /^(?:amazon|model|name)-[a-z0-9][a-z0-9.-]*$/;

/** 商品IDの接頭辞 → 識別キーの種類。 */
export const PRODUCT_ID_KINDS = ["amazon", "model", "name"];

/** 販売先の可否状態（スキーマ §2.1 AffiliateAvailability）。 */
export const AFFILIATE_STATES = ["verified", "direct", "search", "unavailable"];

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const HTTPS_PATTERN = /^https:\/\//;
const LOCAL_OR_HTTPS_IMAGE_PATTERN = /^(?:\/|https:\/\/)/;

/**
 * `AffiliateAvailability` 1件を検証する。
 * @returns {string[]} 問題点（空なら正常）
 */
export function validateAffiliateAvailability(label, value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [`${label}: must be an object`];
  }
  const errors = [];
  const { state } = value;
  if (!AFFILIATE_STATES.includes(state)) {
    return [
      `${label}: state must be one of ${AFFILIATE_STATES.join("|")}, got ${JSON.stringify(state)}`,
    ];
  }
  if (state === "verified" || state === "direct") {
    if (
      !value.url ||
      typeof value.url !== "string" ||
      !HTTPS_PATTERN.test(value.url)
    ) {
      errors.push(`${label}: state "${state}" requires an https url`);
    }
    if (!value.checkedAt || !DATE_PATTERN.test(value.checkedAt)) {
      errors.push(`${label}: state "${state}" requires checkedAt (YYYY-MM-DD)`);
    }
  } else if (state === "search") {
    if (
      !value.query ||
      typeof value.query !== "string" ||
      !value.query.trim()
    ) {
      errors.push(`${label}: state "search" requires a non-empty query`);
    }
    if (value.checkedAt !== undefined && !DATE_PATTERN.test(value.checkedAt)) {
      errors.push(`${label}: checkedAt must be YYYY-MM-DD when present`);
    }
  } else if (state === "unavailable") {
    if (value.note !== undefined && typeof value.note !== "string") {
      errors.push(`${label}: note must be a string when present`);
    }
  }
  return errors;
}

/**
 * 商品1件を検証する。スキーマ §2.1 の Product。
 * @returns {string[]}
 */
export function validateProduct(product, index) {
  const label = `products[${index}]`;
  if (!product || typeof product !== "object" || Array.isArray(product)) {
    return [`${label}: must be an object`];
  }
  const id = product.id;
  const name =
    typeof product.id === "string" ? `products[${product.id}]` : label;
  const errors = [];

  if (!id || typeof id !== "string") {
    errors.push(`${label}: id is required`);
  } else if (!PRODUCT_ID_PATTERN.test(id)) {
    errors.push(
      `${label}: id ${JSON.stringify(id)} must match ${PRODUCT_ID_PATTERN}`,
    );
  }
  for (const field of ["brand", "line", "name"]) {
    const value = product[field];
    if (typeof value !== "string" || !value.trim()) {
      errors.push(`${name}: ${field} must be a non-empty string`);
    }
  }
  if (
    product.model !== undefined &&
    (typeof product.model !== "string" || !product.model.trim())
  ) {
    errors.push(`${name}: model must be a non-empty string when present`);
  }
  if (
    product.image !== undefined &&
    (typeof product.image !== "string" ||
      !LOCAL_OR_HTTPS_IMAGE_PATTERN.test(product.image))
  ) {
    errors.push(`${name}: image must be an absolute /path or https URL`);
  }
  if (
    product.officialUrl !== undefined &&
    (typeof product.officialUrl !== "string" ||
      !HTTPS_PATTERN.test(product.officialUrl))
  ) {
    errors.push(`${name}: officialUrl must be an https URL`);
  }
  if (!product.checkedAt || !DATE_PATTERN.test(product.checkedAt)) {
    errors.push(`${name}: checkedAt must be YYYY-MM-DD`);
  }

  const sellers = product.sellers;
  if (!sellers || typeof sellers !== "object" || Array.isArray(sellers)) {
    errors.push(`${name}: sellers must be an object`);
  } else {
    const present = ["amazon", "rakuten"].filter(
      (key) => sellers[key] !== undefined,
    );
    if (present.length === 0) {
      errors.push(
        `${name}: sellers must contain at least one of amazon|rakuten`,
      );
    }
    for (const key of present) {
      errors.push(
        ...validateAffiliateAvailability(
          `${name}.sellers.${key}`,
          sellers[key],
        ),
      );
    }
    for (const key of Object.keys(sellers)) {
      if (!["amazon", "rakuten"].includes(key)) {
        errors.push(`${name}: unknown seller key ${JSON.stringify(key)}`);
      }
    }
  }
  return errors;
}

/**
 * 商品マスタ全体を検証する。fail-closed（構造が想定外なら必ず非空の errors を返す）。
 * @returns {string[]}
 */
export function validateProductMaster(master) {
  if (!master || typeof master !== "object" || Array.isArray(master)) {
    return ["master must be an object"];
  }
  const errors = [];
  if (!Number.isInteger(master.version) || master.version < 1) {
    errors.push("version must be a positive integer");
  }
  if (!Array.isArray(master.products)) {
    return [...errors, "products must be an array"];
  }
  if (master.products.length === 0) {
    errors.push("products must not be empty");
  }
  const seen = new Set();
  master.products.forEach((product, index) => {
    errors.push(...validateProduct(product, index));
    const id = product?.id;
    if (typeof id === "string") {
      if (seen.has(id)) {
        errors.push(`products[${index}]: duplicate id ${JSON.stringify(id)}`);
      }
      seen.add(id);
    }
  });
  return errors;
}
