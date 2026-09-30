/**
 * analytics-beacon.e2e.ts — page_view と購入クリックの計測ビーコン。
 *
 * ビーコンは自動操作（navigator.webdriver）を数えない設計のため、
 * このテストでは webdriver を false に見せてから読み込む。
 * 送信先は同一オリジンの /api/events のみで、テスト中は応答を差し替える。
 */

import { test, expect } from "@playwright/test";

const ARTICLE_PATH = "/articles/instax-mini-13-vs-mini-41/";

type EventPayload = Record<string, unknown>;

test.describe("analytics beacon", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "webdriver", {
        get: () => false,
        configurable: true,
      });
    });
  });

  test("sends one page_view with the ?src= label and no third-party request", async ({
    page,
  }) => {
    const events: EventPayload[] = [];
    const thirdParty: string[] = [];
    await page.route("**/api/events", async (route) => {
      events.push(JSON.parse(route.request().postData() ?? "{}"));
      await route.fulfill({ status: 204 });
    });
    page.on("request", (request) => {
      const host = new URL(request.url()).hostname;
      if (host !== "localhost" && host !== "127.0.0.1")
        thirdParty.push(request.url());
    });

    await page.goto(`${ARTICLE_PATH}?src=X`, { waitUntil: "networkidle" });
    await expect.poll(() => events.length).toBeGreaterThan(0);

    const views = events.filter((event) => event.event === "page_view");
    expect(views).toHaveLength(1);
    expect(views[0].path).toBe(ARTICLE_PATH);
    expect(views[0].src).toBe("x");
    // 参照元ホスト名以外に、URL・クエリ・個人を識別する値は送らない。
    expect(Object.keys(views[0]).sort()).toEqual(["event", "path", "src"]);
    // 埋め込みの外部サービス以外へ、計測のための第三者通信はない。
    expect(thirdParty.every((url) => !url.includes("/api/events"))).toBe(true);
  });

  test("keeps the first-touch source for purchase clicks on later pages in the same tab", async ({
    page,
  }) => {
    const events: EventPayload[] = [];
    await page.route("**/api/events", async (route) => {
      events.push(JSON.parse(route.request().postData() ?? "{}"));
      await route.fulfill({ status: 204 });
    });
    // 外部への遷移は行わない。クリックは計測だけを確認して止める。
    await page.route(
      /https:\/\/(hb\.afl\.rakuten\.co\.jp|item\.rakuten\.co\.jp|www\.amazon\.co\.jp)\/.*/,
      (route) =>
        route.fulfill({
          status: 200,
          contentType: "text/html",
          body: "<title>stub</title>",
        }),
    );

    await page.goto(`${ARTICLE_PATH}?src=instagram`, {
      waitUntil: "networkidle",
    });
    await page.goto("/articles/", { waitUntil: "networkidle" });
    await page.goto(ARTICLE_PATH, { waitUntil: "networkidle" });

    const cta = page.locator('a[data-cta-event="purchase"]').first();
    await expect(cta).toBeVisible();
    await cta.evaluate((element) => element.removeAttribute("target"));
    await cta.click();
    await expect
      .poll(() => events.some((event) => event.event === "purchase"))
      .toBe(true);

    const click = events.find((event) => event.event === "purchase");
    expect(["article-end", "next-step"]).toContain(click?.placement);
    expect(click?.linkType).toBe("affiliate-rakuten");
    expect(click?.src).toBe("instagram");
  });

  test("does not send events for automated browsers", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "webdriver", {
        get: () => true,
        configurable: true,
      });
    });
    const events: EventPayload[] = [];
    await page.route("**/api/events", async (route) => {
      events.push(JSON.parse(route.request().postData() ?? "{}"));
      await route.fulfill({ status: 204 });
    });
    await page.goto(ARTICLE_PATH, { waitUntil: "networkidle" });
    expect(events.filter((event) => event.event === "page_view")).toHaveLength(
      0,
    );
  });
});
