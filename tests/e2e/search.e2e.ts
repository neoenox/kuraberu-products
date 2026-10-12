import { test, expect, type Page } from "@playwright/test";

// 本番検索の受入 6 項目を再実行可能化 (#1081)。
// 読み取り専用操作のみ。本番環境への書き込み・破壊的操作は行わない。
//
// ローカル:  pnpm test:e2e
// 本番:      E2E_BASE_URL=https://<prod-host> pnpm test:e2e:prod
//
// 件数の固定値は避ける（記事追加で変わる）。AND/OR の意味論だけを検証する。
async function gotoDiscovery(page: Page): Promise<void> {
  await page.goto("/articles/");
  await expect(page.locator("[data-discovery-count]")).toHaveText(
    /^\d+件の記事/,
  );
}

function renderedCards(page: Page) {
  return page.locator("[data-discovery-results] [data-article-card]");
}

async function searchFor(page: Page, query: string): Promise<number> {
  await page.locator("[data-discovery-query]").fill(query);
  const count = page.locator("[data-discovery-count]");
  await expect(count).toHaveText(/^\d+件の記事/);
  const shown = Number((await count.textContent())?.match(/^(\d+)/)?.[1]);
  if (query !== "") {
    // 条件指定時は全 matches を描画する。空クエリ時は静的12件に戻る。
    await expect(renderedCards(page)).toHaveCount(shown);
  }
  return shown;
}

function collectPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(String(error)));
  return errors;
}

test("OR synonym search hits for 軽い and 重い", async ({ page }) => {
  await gotoDiscovery(page);
  const light = await searchFor(page, "軽い");
  expect(light).toBeGreaterThan(0);
  await expect(page).toHaveURL(/q=%E8%BB%BD%E3%81%84/);
  const heavy = await searchFor(page, "重い");
  expect(heavy).toBeGreaterThan(0);
});

test("AND across terms narrows by every group", async ({ page }) => {
  await gotoDiscovery(page);
  const light = await searchFor(page, "軽い");
  const quiet = await searchFor(page, "静か");
  const both = await searchFor(page, "軽い 静か");
  // AND は各単独条件の部分集合になる（データに依存しない単調性）。
  expect(both).toBeLessThanOrEqual(Math.min(light, quiet));
  const cards = page.locator("[data-discovery-results] [data-article-card]");
  for (let index = 0; index < both; index++) {
    const haystack = (await cards.nth(index).getAttribute("data-search")) ?? "";
    expect(haystack).toMatch(/軽い|軽量|重量/);
    expect(haystack).toMatch(/静か|静音|騒音/);
  }
});

test("result click navigates to the article", async ({ page }) => {
  await gotoDiscovery(page);
  await searchFor(page, "軽い");
  const firstLink = page
    .locator("[data-discovery-results] [data-article-card] a")
    .first();
  await expect(firstLink).toBeVisible();
  await firstLink.click();
  await expect(page).toHaveURL(/\/articles\/.+\//);
});

test("change, clear and re-search restore the list", async ({ page }) => {
  await gotoDiscovery(page);
  const initialShown = await searchFor(page, "");
  const initialCards = await renderedCards(page).count();
  const light = await searchFor(page, "軽い");
  expect(light).toBeLessThanOrEqual(initialShown);
  await searchFor(page, "重い");
  await expect(page).toHaveURL(/q=/);
  await page
    .locator("form[data-discovery-form] [data-discovery-clear]")
    .click();
  await expect(page.locator("[data-discovery-query]")).toHaveValue("");
  const restoredShown = await searchFor(page, "");
  expect(restoredShown).toBe(initialShown);
  await expect(renderedCards(page)).toHaveCount(initialCards);
  await expect(page).not.toHaveURL(/q=/);
});

test("search flow runs without console errors", async ({ page }) => {
  const errors = collectPageErrors(page);
  await gotoDiscovery(page);
  await searchFor(page, "軽い");
  const firstLink = page
    .locator("[data-discovery-results] [data-article-card] a")
    .first();
  await firstLink.click();
  await expect(page).toHaveURL(/\/articles\/.+\//);
  expect(errors).toEqual([]);
});

test("[mobile] search and tap navigate on small screens", async ({
  page,
}, testInfo) => {
  await gotoDiscovery(page);
  await searchFor(page, "重い");
  const firstLink = page
    .locator("[data-discovery-results] [data-article-card] a")
    .first();
  await expect(firstLink).toBeVisible();
  if (testInfo.project.name === "mobile") {
    await firstLink.tap();
  } else {
    await firstLink.click();
  }
  await expect(page).toHaveURL(/\/articles\/.+\//);
  // 画像読み込み中の過渡的なはみ出しを避けるため、収束まで再試行する。
  await expect(async () => {
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  }).toPass({ timeout: 10000 });
});
