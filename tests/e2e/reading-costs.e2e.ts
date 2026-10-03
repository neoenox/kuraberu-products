import { expect, test } from "@playwright/test";

test("compact introduction retains full text and links only compatible cost guides", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/articles/instax-mini-evo-vs-evo-cinema/");
  const intro = page.locator(".article-introduction");
  await expect(intro).not.toHaveAttribute("open", "");
  await intro.locator("summary").press("Enter");
  await expect(intro).toHaveAttribute("open", "");
  await expect(intro).toContainText("違いは");
  await expect(
    page.getByRole("link", { name: "無地フィルムの価格を比較する →" }),
  ).toHaveAttribute("href", "/guides/instax-mini-film-price/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/");
  await expect(page.locator("[data-price-check]")).toHaveCount(3);
  await expect(page.locator("[data-price-check]").first()).toContainText(
    "2026-09-30",
  );
  await expect(page.locator("[data-price-age]").first()).toContainText(
    "確認から",
  );
});
