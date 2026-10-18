/**
 * 商品マスタ（src/data/products/catalog.json）への型付きアクセス（#1064 Phase 2c）。
 *
 * 「その商品を販売先（Amazon / 楽天）で案内できるか（可否）」を1箇所から引くための
 * 小さな窓口。表示に使う値（表示名・画像・URL）は記事seed側を優先し、この層は
 * **可否判断（state）だけ**を提供する（値をマスタへ寄せるのは Phase 2d 以降）。
 *
 * 記事seedとマスタの食い違いは `scripts/validators/article-product-refs.mjs` の
 * `validateArticleSellerStates` が fail-closed で検出する（CI: `check:product-master`）。
 * 正規の編集対象は catalog.json のみで、ここは型付きの再公開と索引だけを行う。
 */
import catalogJson from "../data/products/catalog.json";

/** 販売先のキー。 */
export type SellerKey = "amazon" | "rakuten";

/** 販売先の可否状態（docs/article-data-schema-plan.md §2.1 AffiliateAvailability）。 */
export type AffiliateState = "verified" | "direct" | "search" | "unavailable";

/** 販売先1件の可否情報。 */
export interface AffiliateAvailability {
  state?: AffiliateState;
  url?: string;
  query?: string;
  checkedAt?: string;
}

/** マスタ上の商品1件（本モジュールが必要とする範囲）。 */
export interface MasterProduct {
  id: string;
  name?: string;
  image?: string;
  sellers?: Partial<Record<SellerKey, AffiliateAvailability>>;
}

const productsById = new Map<string, MasterProduct>(
  (catalogJson.products as unknown as MasterProduct[]).map((product) => [
    product.id,
    product,
  ]),
);

/** マスタ上の商品を引く（未収録・IDなしなら undefined）。 */
export function findMasterProduct(
  productId: string | null | undefined,
): MasterProduct | undefined {
  return typeof productId === "string" && productId
    ? productsById.get(productId)
    : undefined;
}

/** 販売先の状態（商品が未収録・販売先の記載なしなら null）。 */
export function masterSellerState(
  productId: string | null | undefined,
  seller: SellerKey,
): AffiliateState | null {
  return findMasterProduct(productId)?.sellers?.[seller]?.state ?? null;
}

/**
 * マスタがその販売先を「対象外（unavailable）」と判定しているか。
 *
 * 記事が独自に確認したURL（`{side}RakutenUrl`）を持っていても、マスタが対象外と
 * 判定した商品では CTA を出さない。可否判断が seed とマスタで二重基準にならない
 * ようにするための入口（Phase 2c）。マスタに記載が無い場合は false を返し、
 * 従来どおり seed 側の判断に委ねる。
 */
export function isSellerUnavailable(
  productId: string | null | undefined,
  seller: SellerKey,
): boolean {
  return masterSellerState(productId, seller) === "unavailable";
}
