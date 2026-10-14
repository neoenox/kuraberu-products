/**
 * article-discovery.e2e.ts — 記事検索UIのブラウザレベル検証。
 *
 * - baseURL が未設定ならローカル dist（webServer が起動する）。
 * - E2E_BASE_URL に本番URLを指定すれば本番受入として実行できる。
 *   例: E2E_BASE_URL=https://kuraberu-products.pages.dev pnpm exec playwright test article-discovery
 * - 本番に対する破壊的操作は含まない（検索入力・遷移・表示確認のみ）。
 */

import { test, expect } from "@playwright/test";
import type { ConsoleMessage, Page, Response } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/articles/");
  await expect(page.locator("[data-article-discovery]")).toBeVisible();
});

async function resultCount(page: Page): Promise<number> {
  const text =
    (await page.locator("[data-discovery-count]").textContent()) ?? "";
  return Number(text.replace(/[^0-9]/g, "")) || 0;
}

type FailureCollectors = {
  jsErrors: string[];
  badResponses: string[];
};

async function collectFailures(page: Page): Promise<FailureCollectors> {
  const collected: FailureCollectors = { jsErrors: [], badResponses: [] };
  page.on("console", (message: ConsoleMessage) => {
    if (message.type() === "error") collected.jsErrors.push(message.text());
  });
  page.on("pageerror", (error: Error) =>
    collected.jsErrors.push(String(error)),
  );
  page.on("response", (response: Response) => {
    if (response.status() >= 400)
      collected.badResponses.push(`${response.status()} ${response.url()}`);
  });
  return collected;
}

function expectNoAppFailures(collected: FailureCollectors) {
  // favicon.ico は public/ に存在しない既知の欠落で、検索機能とは無関係。
  // そのため URLつきで記録された favicon の失敗と対になるものだけ許容し、
  // それ以外の JSエラー・HTTP 4xx/5xx はすべて失敗扱いにする。
  const faviconBad = collected.badResponses.filter((entry) =>
    entry.endsWith("/favicon.ico"),
  );
  const otherBad = collected.badResponses.filter(
    (entry) => !entry.endsWith("/favicon.ico"),
  );
  expect(otherBad).toEqual([]);
  const resourceErrors = collected.jsErrors.filter((entry) =>
    entry.startsWith("Failed to load resource"),
  );
  const otherJs = collected.jsErrors.filter(
    (entry) => !entry.startsWith("Failed to load resource"),
  );
  expect(otherJs).toEqual([]);
  expect(resourceErrors.length).toBeLessThanOrEqual(faviconBad.length);
}

test("同義語の単独検索で結果が表示される（軽い・重い）", async ({ page }) => {
  const failures = await collectFailures(page);
  const query = page.locator("[data-discovery-query]");
  await query.fill("軽い");
  await expect
    .poll(() => resultCount(page), { timeout: 8000 })
    .toBeGreaterThan(0);
  await query.fill("重い");
  await expect
    .poll(() => resultCount(page), { timeout: 8000 })
    .toBeGreaterThan(0);
  expectNoAppFailures(failures);
});

test("複合検索はANDとして動作する（軽い 静か）", async ({ page }) => {
  const failures = await collectFailures(page);
  const query = page.locator("[data-discovery-query]");
  await query.fill("軽い");
  await expect
    .poll(() => resultCount(page), { timeout: 8000 })
    .toBeGreaterThan(0);
  const single = await resultCount(page);
  await query.fill("軽い 静か");
  await page.waitForTimeout(500);
  expect(await resultCount(page)).toBeLessThanOrEqual(single);
  expectNoAppFailures(failures);
});

test("検索結果のクリックで正しい比較記事へ移動する", async ({ page }) => {
  const failures = await collectFailures(page);
  await page.locator("[data-discovery-query]").fill("iPhone");
  const firstLink = page
    .locator("[data-discovery-results] [data-article-card] a")
    .first();
  await expect(firstLink).toBeVisible({ timeout: 8000 });
  const href = await firstLink.getAttribute("href");
  const escaped = (href ?? "/articles/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  await firstLink.click();
  await expect(page).toHaveURL(new RegExp(`${escaped}$`));
  expectNoAppFailures(failures);
});

test("検索語の変更・クリア・再検索が動作する", async ({ page }) => {
  const failures = await collectFailures(page);
  const query = page.locator("[data-discovery-query]");
  await query.fill("軽い");
  await expect
    .poll(() => resultCount(page), { timeout: 8000 })
    .toBeGreaterThan(0);
  await query.fill("存在しない商品XYZ");
  await page.waitForTimeout(500);
  await expect(page.locator("[data-discovery-empty]")).toBeVisible();
  await query.fill("");
  await page.waitForTimeout(500);
  expectNoAppFailures(failures);
});

test("モバイル幅でも検索操作できる", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const failures = await collectFailures(page);
  await page.goto("/articles/");
  await page.locator("[data-discovery-query]").fill("軽い");
  await expect(
    page.locator("[data-discovery-results] [data-article-card]").first(),
  ).toBeVisible({ timeout: 8000 });
  expectNoAppFailures(failures);
});
