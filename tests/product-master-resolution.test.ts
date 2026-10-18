import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { collectSlots } from "../scripts/build-product-master.mjs";
import { checkArticleProductRefs } from "../scripts/check-product-master.mjs";
import {
  buildMasterIndex,
  resolveDerived,
  resolveProductRef,
  validateArticleProductRefs,
} from "../scripts/validators/article-product-refs.mjs";

/**
 * 記事→商品マスタ参照（#1064 Phase 2a）の検証。
 * - 公開53の全スロット（106件）がマスタの100商品へ一意に解決する
 * - `productId` が無くても ASIN > model > name で解決できる（併走期間）
 * - 解決結果と seed の値の差分は既知の5点だけ（2b/2c の判断材料として固定する）
 * - 検証は fail-closed（未知の productId・導出との不一致・記事内重複・解決不能で必ずエラー）
 */
type Product = {
  id: string;
  name?: string;
  model?: string;
  image?: string;
  sellers?: {
    amazon?: { url?: string };
    rakuten?: { url?: string };
  };
};
type Slot = {
  articleId: string;
  side: "left" | "right";
  productId?: string | null;
  amazonUrl?: string | null;
  amazonAsin?: string | null;
  rakutenUrl?: string | null;
  image?: string | null;
  model?: string | null;
  name?: string | null;
};

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(root, "src/data/products/catalog.json");
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8")) as {
  products: Product[];
};
const slots = collectSlots(root) as unknown as Slot[];

const label = (slot: { articleId: string; side: string }) =>
  `${slot.articleId}:${slot.side}`;

/** seed値とマスタ値が食い違う項目を集める（併走の差分インベントリ）。 */
function collectDiffs() {
  const index = buildMasterIndex(catalog);
  const diffs: {
    name: { slot: string; seed: string; master: string }[];
    amazonUrl: string[];
    image: string[];
    rakutenUrl: string[];
    unresolved: string[];
  } = { name: [], amazonUrl: [], image: [], rakutenUrl: [], unresolved: [] };
  for (const slot of slots) {
    const product = resolveProductRef(index, slot).product;
    if (!product) {
      diffs.unresolved.push(label(slot));
      continue;
    }
    if ((slot.name ?? "") !== (product.name ?? "")) {
      diffs.name.push({
        slot: label(slot),
        seed: slot.name ?? "",
        master: product.name ?? "",
      });
    }
    const amazonUrl = product.sellers?.amazon?.url;
    if (slot.amazonUrl && amazonUrl && slot.amazonUrl !== amazonUrl) {
      diffs.amazonUrl.push(label(slot));
    }
    if (slot.image && product.image && slot.image !== product.image) {
      diffs.image.push(label(slot));
    }
    const rakutenUrl = product.sellers?.rakuten?.url;
    if (slot.rakutenUrl && rakutenUrl && slot.rakutenUrl !== rakutenUrl) {
      diffs.rakutenUrl.push(label(slot));
    }
  }
  return diffs;
}

describe("article → product master refs (#1064 Phase 2a)", () => {
  it("公開53の全スロット（106件）がマスタの100商品へ一意に解決する", () => {
    expect(slots).toHaveLength(106);
    const index = buildMasterIndex(catalog);
    expect(index.errors).toEqual([]);
    const ids = slots.map((slot) => resolveProductRef(index, slot).product?.id);
    expect(ids.filter(Boolean)).toHaveLength(106);
    expect(new Set(ids).size).toBe(100);
    expect([...new Set(ids)].sort()).toEqual(
      catalog.products.map((product) => product.id).sort(),
    );
  });

  it("productId を書かなくても ASIN > model > name で解決する（併走期間）", () => {
    const withoutProductId = (slot: Slot): Slot => {
      const copy: Slot = { ...slot };
      delete copy.productId;
      return copy;
    };
    expect(
      validateArticleProductRefs(slots.map(withoutProductId), catalog),
    ).toEqual([]);
    expect(checkArticleProductRefs({ root }).errors).toEqual([]);
  });

  it("解決の出所は ASIN > model > name の優先で決まる", () => {
    const index = buildMasterIndex(catalog);
    const withAsin = slots.find((slot) => slot.amazonAsin)!;
    expect(resolveProductRef(index, withAsin).source).toBe("amazon");
    const withoutAsin = slots.find(
      (slot) =>
        !slot.amazonAsin &&
        typeof slot.model === "string" &&
        index.byModel.has(slot.model),
    )!;
    expect(resolveProductRef(index, withoutAsin).source).toBe("model");
  });

  it("併走: seed とマスタの差分は既知の5点だけ（名前2・楽天URL3）", () => {
    const diffs = collectDiffs();
    expect(diffs.unresolved).toEqual([]);
    expect(diffs.amazonUrl).toEqual([]);
    expect(diffs.image).toEqual([]);
    expect(diffs.name).toEqual([
      {
        slot: "sony-wf-c710n-vs-soundcore-liberty-5:left",
        seed: "ソニー ワイヤレスノイズキャンセリングステレオヘッドセット WF-C710N ブラック",
        master:
          "ソニー ワイヤレスノイズキャンセリングステレオヘッドセット WF-C710N",
      },
      {
        slot: "ipad-mini-a17-pro-vs-ipad-a16:right",
        seed: "11インチ iPad（A16）Wi-Fi 128GB",
        master: "11インチ iPad（A16） Wi-Fi 128GB",
      },
    ]);
    // 楽天URLは記事間で成果URLが割れた2商品（docs/product-master.md、計画 §付録A.5）。
    // マスタは overrides.json の代表値1本、記事は自記事のURLを保持する（Phase 2c で判断）。
    expect(diffs.rakutenUrl.sort()).toEqual([
      "sony-wf-1000xm6-vs-linkbuds-fit:right",
      "sony-wf-c710n-vs-linkbuds-fit:left",
      "sony-wf-c710n-vs-soundcore-liberty-5:left",
    ]);
  });
});

describe("validateArticleProductRefs (fail-closed)", () => {
  const slot = (over: Partial<Slot> = {}): Slot => ({
    articleId: "example-article",
    side: "left",
    productId: null,
    amazonUrl: null,
    model: null,
    name: null,
    ...over,
  });
  const kdpAsin = "https://www.amazon.co.jp/dp/B0DZ7WF87P";
  const kindleAsin = "https://www.amazon.co.jp/dp/B0GV5VHTL6";

  it("明示 productId がマスタに無い・形式が不正ならエラー", () => {
    expect(
      validateArticleProductRefs(
        [slot({ productId: "amazon-b000000000" })],
        catalog,
      ).length,
    ).toBeGreaterThan(0);
    expect(
      validateArticleProductRefs([slot({ productId: "B0DZ7WF87P" })], catalog)
        .length,
    ).toBeGreaterThan(0);
  });

  it("明示 productId が導出結果と食い違えばエラー", () => {
    const mismatched = validateArticleProductRefs(
      [slot({ amazonUrl: kdpAsin, productId: "amazon-b0gv5vhtl6" })],
      catalog,
    );
    expect(mismatched.join()).toContain("amazon-b0gv5vhtl6");
    expect(mismatched.join()).toContain("does not match");
    expect(
      validateArticleProductRefs(
        [slot({ amazonUrl: kdpAsin, productId: "amazon-b0dz7wf87p" })],
        catalog,
      ),
    ).toEqual([]);
  });

  it("公開スロットがマスタへ解決できなければエラー", () => {
    const errors = validateArticleProductRefs(
      [slot({ name: "マスタに存在しない商品名" })],
      catalog,
    );
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.join()).toContain("example-article:left");
  });

  it("同一記事で左右が同じ商品を指せばエラー", () => {
    const errors = validateArticleProductRefs(
      [
        slot({ amazonUrl: kindleAsin }),
        slot({ side: "right", amazonUrl: kindleAsin }),
      ],
      catalog,
    );
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.join()).toContain("amazon-b0gv5vhtl6");
    expect(errors.join()).toContain("already referenced");
  });

  it("マスタの解決キーが曖昧（同じ model が別商品）ならエラー", () => {
    const ambiguous = {
      version: 1,
      products: [
        { id: "model-x", model: "X", name: "商品A", sellers: {} },
        { id: "model-y", model: "X", name: "商品B", sellers: {} },
      ],
    };
    const index = buildMasterIndex(ambiguous);
    expect(index.errors.length).toBeGreaterThan(0);
    expect(validateArticleProductRefs([], ambiguous).length).toBeGreaterThan(0);
  });

  it("明示 productId は導出より優先される（不一致は別の規則で検出）", () => {
    const index = buildMasterIndex(catalog);
    const resolved = resolveProductRef(
      index,
      slot({
        productId: "amazon-b0gv5vhtl6",
        amazonUrl: kdpAsin,
        name: "Kindle Paperwhite 16GB",
      }),
    );
    expect(resolved.source).toBe("productId");
    expect(resolved.product?.id).toBe("amazon-b0gv5vhtl6");
    expect(
      resolveDerived(index, slot({ amazonUrl: kdpAsin })).product?.id,
    ).toBe("amazon-b0dz7wf87p");
  });
});
