import { describe, expect, it } from "vitest";
import { hasVerifiedPurchaseDestination } from "../scripts/article-purchase-readiness.mjs";

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
});
