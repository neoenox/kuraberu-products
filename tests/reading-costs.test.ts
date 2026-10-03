import { expect, it } from "vitest";
import { priceAgeDays, shortIntroduction } from "../src/lib/reading-costs";

it("uses Japanese calendar days and rejects invalid or future checks", () => {
  expect(priceAgeDays("2026-09-30", new Date("2026-10-01T15:00:00Z"))).toBe(2);
  expect(priceAgeDays("2026-02-30", new Date("2026-10-02"))).toBeNull();
  expect(priceAgeDays("2026-10-03", new Date("2026-10-02"))).toBeNull();
});
it("keeps the first complete sentence without cutting a word", () => {
  expect(shortIntroduction("比較します。詳細を説明します。")).toBe(
    "比較します。",
  );
  expect(shortIntroduction("短い導入")).toBe("短い導入");
});
