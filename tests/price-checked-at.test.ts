import { expect, it } from "vitest";
import { priceAgeDays } from "../src/lib/reading-costs";

it("uses Japan calendar days for price freshness", () => {
  expect(
    priceAgeDays("2026-09-30", new Date("2026-10-01T15:00:00Z")),
  ).toBe(2);
  expect(
    priceAgeDays("2026-02-30", new Date("2026-10-02T00:00:00Z")),
  ).toBeNull();
  expect(
    priceAgeDays("2026-10-03", new Date("2026-10-02T00:00:00Z")),
  ).toBeNull();
});
