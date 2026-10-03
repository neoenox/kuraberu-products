import { test, expect } from "@playwright/test";

test("category subtype selection survives reload and clearing restores the parent", async ({
  page,
}) => {
  await page.goto("/articles/category/オーディオ/");
  const category = page.locator("[data-discovery-category]");
  await category.selectOption("完全ワイヤレスイヤホン");
  await expect(page.locator("[data-discovery-count]")).toHaveText("2件の記事");
  await expect(page).toHaveURL(/category=/);
  await page.reload();

  await expect(category).toHaveValue("完全ワイヤレスイヤホン");
  await expect(page.locator("[data-discovery-count]")).toHaveText("2件の記事");
  await page.locator("[data-discovery-clear]").first().click();
  await expect(category).toHaveValue("オーディオ");
  await expect(page.locator("[data-discovery-count]")).toHaveText("6件の記事");
});

test("keyboard can reveal common specifications and mobile content does not overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/articles/instax-mini-13-vs-mini-41/");
  const summary = page.locator(".comparison-details summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".comparison-details")).toHaveAttribute("open", "");
  await expect(
    page.getByText("両商品に共通する仕様", { exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
});
