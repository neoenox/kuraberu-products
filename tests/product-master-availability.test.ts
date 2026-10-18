import { describe, expect, it } from "vitest";
import catalog from "../src/data/products/catalog.json";
import {
  findMasterProduct,
  isSellerUnavailable,
  masterSellerState,
} from "../src/lib/product-master";

/**
 * 商品マスタの可否アクセサ（#1064 Phase 2c）の検証。
 * 表示（CommercialArticlePage）が使う「CTAを出せるか」の入口を固定する。
 */
type Product = {
  id: string;
  sellers?: { amazon?: { state?: string }; rakuten?: { state?: string } };
};
const products = catalog.products as Product[];

describe("product master availability (#1064 Phase 2c)", () => {
  it("id で商品と販売先の状態を引ける", () => {
    const verified = products.find(
      (product) => product.sellers?.rakuten?.state === "verified",
    )!;
    expect(findMasterProduct(verified.id)?.id).toBe(verified.id);
    expect(masterSellerState(verified.id, "rakuten")).toBe("verified");
    expect(isSellerUnavailable(verified.id, "rakuten")).toBe(false);
  });

  it("未収録のID・IDなしは null / false（seed側の判断に委ねる）", () => {
    for (const productId of ["model-missing", "", null, undefined]) {
      expect(findMasterProduct(productId)).toBeUndefined();
      expect(masterSellerState(productId, "rakuten")).toBeNull();
      expect(isSellerUnavailable(productId, "rakuten")).toBe(false);
    }
  });

  it("isSellerUnavailable は state === unavailable の商品だけで true", () => {
    for (const product of products) {
      expect(isSellerUnavailable(product.id, "rakuten")).toBe(
        product.sellers?.rakuten?.state === "unavailable",
      );
      expect(isSellerUnavailable(product.id, "amazon")).toBe(
        product.sellers?.amazon?.state === "unavailable",
      );
    }
  });

  it("販売先の記載が無い商品は null（可否を主張しない）", () => {
    const noRakuten = products.find(
      (product) => product.sellers?.rakuten === undefined,
    )!;
    expect(masterSellerState(noRakuten.id, "rakuten")).toBeNull();
    expect(isSellerUnavailable(noRakuten.id, "rakuten")).toBe(false);
  });
});
