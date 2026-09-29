import { describe, expect, it } from "vitest";
import {
  getAmazonUnavailableEvidenceErrors,
  hasVerifiedPurchaseDestination,
} from "../scripts/article-purchase-readiness.mjs";

const rakutenAffiliateUrl =
  "https://hb.afl.rakuten.co.jp/ichiba/example/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fshop%2Fitem%2F";

describe("hasVerifiedPurchaseDestination", () => {
  it("accepts one verified marketplace when the other is unavailable", () => {
    expect(
      hasVerifiedPurchaseDestination({
        amazonStatus: "unavailable",
        amazonUrl: "https://www.amazon.co.jp/dp/B0EXAMPLE1",
        rakutenStatus: "verified",
        rakutenUrl: rakutenAffiliateUrl,
      }),
    ).toBe(true);
  });

  it("accepts a verified Amazon product page when Rakuten is unavailable", () => {
    expect(
      hasVerifiedPurchaseDestination({
        amazonStatus: "verified",
        amazonUrl: "https://www.amazon.co.jp/dp/B0EXAMPLE1",
        rakutenStatus: "unavailable",
        rakutenUrl: undefined,
      }),
    ).toBe(true);
  });

  it("rejects search URLs and unverified destinations", () => {
    expect(
      hasVerifiedPurchaseDestination({
        amazonStatus: "verified",
        amazonUrl: "https://www.amazon.co.jp/s?k=portable+ssd",
        rakutenStatus: "unverified",
        rakutenUrl: rakutenAffiliateUrl,
      }),
    ).toBe(false);
  });

  it("does not count an Amazon search CTA as a verified destination", () => {
    expect(
      hasVerifiedPurchaseDestination({
        amazonStatus: "search",
        amazonUrl: undefined,
        rakutenStatus: "unverified",
        rakutenUrl: rakutenAffiliateUrl,
      }),
    ).toBe(false);
  });
});

describe("Amazon unavailable evidence gate", () => {
  const asin = "B012345678";
  const productPageUrl = `https://www.amazon.co.jp/dp/${asin}`;

  it("rejects unavailable when an exact Amazon product ASIN was never confirmed", () => {
    const manifest = {
      researchDateJst: "2026-09-29",
      amazon: {
        statusBySide: { left: "unavailable" },
        browserEvidence: {
          bySide: {
            left: {
              productMatch: {
                state: "not-found",
                evidence: "Amazon検索で商品詳細ページを見つけられなかった。",
              },
              eligibility: {
                state: "not-shown",
                evidence: "商品別の適格性表示を確認できなかった。",
              },
              taggedUrl: { state: "not-created", evidence: "未生成。" },
              destination: { state: "not-checked", evidence: "未確認。" },
            },
          },
        },
      },
    };

    expect(
      getAmazonUnavailableEvidenceErrors(manifest, "fixture-article"),
    ).toEqual([expect.stringContaining("confirmed Amazon product-detail URL")]);
  });

  it("rejects unavailable based only on missing Amazon search results", () => {
    const manifest = {
      researchDateJst: "2026-09-29",
      amazon: {
        statusBySide: { left: "unavailable" },
        productPages: { left: productPageUrl },
        browserEvidence: {
          bySide: {
            left: {
              productMatch: {
                state: "not-found",
                evidence: "Amazon検索でASINを見つけられなかった。",
              },
              eligibility: {
                state: "not-shown",
                evidence: "商品別の対象可否表示を確認できなかった。",
              },
              taggedUrl: {
                state: "not-created",
                evidence: "公式リンク生成UIの結果は未確認。",
              },
              destination: {
                state: "not-checked",
                evidence: "成果URLを生成していない。",
              },
            },
          },
        },
      },
    };

    expect(
      getAmazonUnavailableEvidenceErrors(manifest, "fixture-article"),
    ).toEqual([expect.stringContaining("direct item-level evidence")]);
  });

  it("accepts an item-specific Associates ineligibility result for the matching ASIN", () => {
    const manifest = {
      researchDateJst: "2026-09-29",
      amazon: {
        statusBySide: { left: "unavailable" },
        productPages: { left: productPageUrl },
        browserEvidence: {
          bySide: {
            left: {
              productMatch: {
                state: "verified",
                evidence: `商品名・型番とASIN ${asin} の一致を確認。`,
              },
              eligibility: {
                state: "ineligible",
                evidence: `Amazon Associates画面にASIN ${asin} は対象外と表示。`,
              },
              taggedUrl: {
                state: "not-applicable",
                evidence: "対象外表示のためリンクを生成しない。",
              },
              destination: {
                state: "not-applicable",
                evidence: "成果リンクを生成していない。",
              },
              unavailableEvidence: {
                reason: "item-ineligible",
                source: "associates-eligibility-ui",
                asin,
                observedAtJst: "2026-09-29",
              },
            },
          },
        },
      },
    };

    expect(
      getAmazonUnavailableEvidenceErrors(manifest, "fixture-article"),
    ).toEqual([]);
  });

  it("accepts an explicit official link-builder refusal for the matching ASIN", () => {
    const manifest = {
      researchDateJst: "2026-09-29",
      amazon: {
        statusBySide: { left: "unavailable" },
        productPages: { left: productPageUrl },
        browserEvidence: {
          bySide: {
            left: {
              productMatch: {
                state: "verified",
                evidence: `商品名・型番とASIN ${asin} の一致を確認。`,
              },
              eligibility: {
                state: "not-shown",
                evidence: "商品別の適格性表示はなかった。",
              },
              taggedUrl: {
                state: "refused",
                evidence: `公式リンク生成UIがASIN ${asin} のリンク生成を明示的に拒否。`,
              },
              destination: { state: "not-applicable", evidence: "未生成。" },
              unavailableEvidence: {
                reason: "official-link-builder-refused",
                source: "associates-link-builder-ui",
                asin,
                observedAtJst: "2026-09-29",
              },
            },
          },
        },
      },
    };

    expect(
      getAmazonUnavailableEvidenceErrors(manifest, "fixture-article"),
    ).toEqual([]);
  });

  it("rejects unavailable evidence when the recorded ASIN does not match the product page", () => {
    const manifest = {
      researchDateJst: "2026-09-29",
      amazon: {
        statusBySide: { left: "unavailable" },
        productPages: { left: productPageUrl },
        browserEvidence: {
          bySide: {
            left: {
              productMatch: {
                state: "verified",
                evidence: `商品名・型番とASIN ${asin} の一致を確認。`,
              },
              eligibility: {
                state: "ineligible",
                evidence: `Amazon Associates画面にASIN ${asin} は対象外と表示。`,
              },
              taggedUrl: { state: "not-applicable", evidence: "未生成。" },
              destination: { state: "not-applicable", evidence: "未生成。" },
              unavailableEvidence: {
                reason: "item-ineligible",
                source: "associates-eligibility-ui",
                asin: "B098765432",
                observedAtJst: "2026-09-29",
              },
            },
          },
        },
      },
    };

    expect(
      getAmazonUnavailableEvidenceErrors(manifest, "fixture-article"),
    ).toEqual([
      expect.stringContaining(
        "ASIN must match the confirmed Amazon product page",
      ),
    ]);
  });

  it("requires an explicit official link-builder refusal, not a transient generation failure", () => {
    const manifest = {
      researchDateJst: "2026-09-29",
      amazon: {
        statusBySide: { left: "unavailable" },
        productPages: { left: productPageUrl },
        browserEvidence: {
          bySide: {
            left: {
              productMatch: {
                state: "verified",
                evidence: `商品名・型番とASIN ${asin} の一致を確認。`,
              },
              eligibility: {
                state: "not-shown",
                evidence: "商品別の適格性表示が見つからなかった。",
              },
              taggedUrl: {
                state: "failed",
                evidence: `通信エラーでASIN ${asin} のリンクを生成できなかった。`,
              },
              destination: { state: "not-checked", evidence: "未生成。" },
              unavailableEvidence: {
                reason: "official-link-builder-refused",
                source: "associates-link-builder-ui",
                asin,
                observedAtJst: "2026-09-29",
              },
            },
          },
        },
      },
    };

    expect(
      getAmazonUnavailableEvidenceErrors(manifest, "fixture-article"),
    ).toEqual([expect.stringContaining("explicit refusal")]);
  });
});
