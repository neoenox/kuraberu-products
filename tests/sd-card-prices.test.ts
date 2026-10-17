import { describe, expect, it } from "vitest";
import {
  sdCardOffers,
  sdCardOverseasRetailReview,
} from "../src/data/sd-card-prices";

// #1091: 楽天の「海外リテール」出品（キオクシア 256GB/512GB）の扱い。
// 販売ページには「海外リテール」の記載はあるが、並行輸入品・保証条件の記載が無い。
// 断定できないため掲載は継続し、note で注意喚起したうえで、確認日と参照先を記録しておく。
describe("SDカード価格ガイドの海外リテール出品 (#1091)", () => {
  const overseas = sdCardOffers.filter((offer) =>
    (offer.note ?? "").includes("海外リテール"),
  );

  it("「海外リテール」の出品には、保証の注意を note に書く", () => {
    // 対象が 0 件になるとこの検査が無意味になるため、存在も検査する。
    expect(overseas.length).toBeGreaterThan(0);
    for (const offer of overseas) {
      expect(offer.note).toContain("海外リテール");
      expect(offer.note).toContain("保証");
      expect(offer.note).toContain("ご確認ください");
    }
  });

  it("確認記録の参照先が、該当出品の販売ページと一致する", () => {
    expect(sdCardOverseasRetailReview.reviewedAt).toMatch(
      /^\d{4}-\d{2}-\d{2}$/,
    );
    expect(sdCardOverseasRetailReview.finding.length).toBeGreaterThan(0);
    expect([...sdCardOverseasRetailReview.references].sort()).toEqual(
      overseas.map((offer) => offer.itemUrl).sort(),
    );
  });
});
