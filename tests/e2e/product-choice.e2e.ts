import { test, expect, type Page } from "@playwright/test";

// 件数は記事の追加で変わるため固定値にしない。表示件数が実際に描画された
// カード枚数と一致すること、サブタイプの絞り込みが親カテゴリより狭いことを確かめる。
async function shownCount(page: Page): Promise<number> {
  const count = page.locator("[data-discovery-count]");
  await expect(count).toHaveText(/^\d+件の記事$/);
  const shown = Number((await count.textContent())?.match(/^(\d+)/)?.[1]);
  await expect(
    page.locator("[data-discovery-results] [data-article-card]"),
  ).toHaveCount(shown);
  return shown;
}

test("category subtype selection survives reload and clearing restores the parent", async ({
  page,
}) => {
  await page.goto("/articles/category/オーディオ/");
  const category = page.locator("[data-discovery-category]");
  const parentCount = await shownCount(page);
  await category.selectOption("完全ワイヤレスイヤホン");
  await expect(page).toHaveURL(/category=/);
  const subtypeCount = await shownCount(page);
  expect(subtypeCount).toBeGreaterThan(0);
  expect(subtypeCount).toBeLessThan(parentCount);
  await page.reload();

  await expect(category).toHaveValue("完全ワイヤレスイヤホン");
  expect(await shownCount(page)).toBe(subtypeCount);
  await page.locator("[data-discovery-clear]").first().click();
  await expect(category).toHaveValue("オーディオ");
  expect(await shownCount(page)).toBe(parentCount);
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
