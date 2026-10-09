/**
 * embed-consent.e2e.ts — E2E test for the default-display embed behavior.
 *
 * 外部コンテンツ（X/YouTube/TikTok/Pinterest）は標準で表示する。
 * - 初期HTMLは第三者のscript / iframeを含まない（表示はページ読み込み後のJS）。
 * - 「表示しない」を選んだブラウザ（localStorage の embed-consent=denied）では、
 *   外部サービスへ一切接続しない。
 * - 記事内の1枚の案内バーで、外部送信の注意と「表示しない」「表示する」を切り替えられる。
 *
 * ネットワークレベルで検証する（DOMだけでは見えない読み込みを検出するため）。
 */

import { test, expect } from "@playwright/test";

/**
 * Third-party origins that embed components may contact.
 * A stored "denied" choice must block ALL of these.
 */
const THIRD_PARTY_ORIGINS = [
  "platform.twitter.com",
  "syndication.twitter.com",
  "cdn.syndication.twimg.com",
  "www.youtube-nocookie.com",
  "youtube.com",
  "www.youtube.com",
  "i.ytimg.com",
  "www.tiktok.com",
  "tiktok.com",
  "assets.pinterest.com",
  "pinterest.com",
  "widgets.pinterest.com",
];

function isThirdPartyRequest(url: string): boolean {
  try {
    const parsed = new URL(url);
    return THIRD_PARTY_ORIGINS.some(
      (origin) =>
        parsed.hostname === origin || parsed.hostname.endsWith(`.${origin}`),
    );
  } catch {
    return false;
  }
}

const X_ARTICLE_PATH = "/articles/instax-mini-13-vs-mini-41/";
const YOUTUBE_ARTICLE_PATH = "/articles/anker-nano-a1638-vs-power-bank-a1256/";
const X_LOADED_TIMEOUT = 30_000;

test.describe("default-display embeds (network level)", () => {
  test("initial HTML contains no third-party script or iframe", async ({
    request,
  }) => {
    for (const path of [X_ARTICLE_PATH, YOUTUBE_ARTICLE_PATH]) {
      const html = await (await request.get(path)).text();
      const thirdPartyTags = [
        ...html.matchAll(/<(?:script|iframe)\b[^>]*\bsrc="([^"]+)"/gi),
      ]
        .map((match) => match[1])
        .filter((src) =>
          isThirdPartyRequest(new URL(src, "https://x.test").href),
        );
      expect(thirdPartyTags, `third-party tags in ${path}`).toEqual([]);
    }
  });

  test("shows the X post by default, with a disclosure and a deny control", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    const thirdPartyRequests: string[] = [];
    page.on("request", (request) => {
      if (isThirdPartyRequest(request.url())) {
        thirdPartyRequests.push(request.url());
      }
    });

    await page.goto(X_ARTICLE_PATH, { waitUntil: "domcontentloaded" });
    // この記事には X の投稿が複数ある。最初の1件で、既定表示の仕組みを確認する。
    const embed = page
      .locator('#sns [data-external-embed][data-provider="x"]')
      .first();
    // この記事の X 投稿は autoload 指定（読者の操作なしで読み込む）。
    await expect(embed).toHaveAttribute("data-autoload", "true");
    // No click, no consent step: the embed loads on its own.
    await expect(embed).toHaveAttribute("data-embed-state", "loaded", {
      timeout: X_LOADED_TIMEOUT,
    });
    await expect(embed.locator("iframe").first()).toBeVisible();
    expect(
      thirdPartyRequests.some((url) => url.includes("platform.twitter.com")),
    ).toBe(true);

    // One non-blocking notice bar; no blocking banner or accept button.
    const bar = page.locator("[data-embed-consent-bar]");
    await expect(bar).toHaveCount(1);
    await expect(bar).toContainText(
      "外部コンテンツ（X・YouTubeなど）を表示しています",
    );
    await expect(bar).toContainText(
      "IPアドレスなどが外部サービスに送信される場合があります",
    );
    await expect(bar.locator('a[href="/privacy/"]')).toBeVisible();
    await expect(bar.locator("[data-embed-consent-deny]")).toHaveText(
      "表示しない",
    );
    await expect(page.locator("[data-embed-consent-banner]")).toHaveCount(0);
    await expect(page.locator("[data-embed-consent-accept]")).toHaveCount(0);
  });

  test("autoDisplay YouTube loads by default without any click", async ({
    page,
  }) => {
    await page.route("https://www.youtube-nocookie.com/embed/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<!doctype html><title>Video fixture</title>",
      }),
    );
    await page.goto(YOUTUBE_ARTICLE_PATH, { waitUntil: "networkidle" });
    const embed = page.locator(
      '[data-external-embed][data-provider="youtube"]',
    );
    await expect(embed).toHaveAttribute("data-auto-display", "true");
    await expect(embed.locator("iframe")).toHaveAttribute(
      "src",
      /https:\/\/www\.youtube-nocookie\.com\/embed\//,
    );
    await expect(embed).toHaveAttribute("data-embed-state", "loaded");
  });

  test("a stored 表示しない choice blocks every third-party request", async ({
    page,
  }) => {
    await page.addInitScript(() =>
      localStorage.setItem("embed-consent", "denied"),
    );
    const thirdPartyRequests: string[] = [];
    page.on("request", (request) => {
      if (isThirdPartyRequest(request.url()))
        thirdPartyRequests.push(request.url());
    });

    await page.goto(X_ARTICLE_PATH, { waitUntil: "networkidle" });
    const embeds = page.locator(
      '#sns [data-external-embed][data-provider="x"]',
    );
    // この記事には X の投稿が複数ある。すべてが「表示しない」状態になる。
    expect(await embeds.count()).toBeGreaterThan(0);
    for (const embed of await embeds.all()) {
      await expect(embed).toHaveAttribute("data-embed-state", "idle");
      await expect(embed.locator("iframe")).toHaveCount(0);
    }
    const embed = embeds.first();
    const bar = page.locator("[data-embed-consent-bar]");
    await expect(bar).toContainText("表示しない設定になっています");
    await expect(bar.locator("[data-embed-consent-allow]")).toHaveText(
      "表示する",
    );
    expect(thirdPartyRequests).toHaveLength(0);

    // 元投稿への通常リンクは残る。
    await expect(
      embed.locator('a[href^="https://x.com/"]').first(),
    ).toBeVisible();
  });

  test("switching to 表示しない stops embeds and persists across reloads; 表示する restores", async ({
    page,
  }) => {
    test.setTimeout(90_000);
    await page.route("https://www.youtube-nocookie.com/embed/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<!doctype html><title>Video fixture</title>",
      }),
    );
    await page.goto(YOUTUBE_ARTICLE_PATH, { waitUntil: "networkidle" });
    const embed = page.locator(
      '[data-external-embed][data-provider="youtube"]',
    );
    await expect(embed).toHaveAttribute("data-embed-state", "loaded");

    // Deny: the iframe goes away and the choice is stored.
    await page.locator("[data-embed-consent-deny]").click();
    await expect(embed.locator("iframe")).toHaveCount(0);
    await expect(embed).toHaveAttribute("data-embed-state", "idle");
    expect(
      await page.evaluate(() => localStorage.getItem("embed-consent")),
    ).toBe("denied");
    // The bar switches to the restore control and keeps keyboard focus on it.
    await expect(page.locator("[data-embed-consent-allow]")).toBeFocused();

    // Reload: still denied, and no third-party request is made.
    const requestsAfterDeny: string[] = [];
    page.on("request", (request) => {
      if (isThirdPartyRequest(request.url()))
        requestsAfterDeny.push(request.url());
    });
    await page.reload({ waitUntil: "networkidle" });
    await expect(embed).toHaveAttribute("data-embed-state", "idle");
    expect(requestsAfterDeny).toHaveLength(0);

    // Allow again: the embed loads and the choice is stored.
    await page.locator("[data-embed-consent-allow]").click();
    await expect(embed.locator("iframe")).toHaveAttribute(
      "src",
      /https:\/\/www\.youtube-nocookie\.com\/embed\//,
    );
    await expect(embed).toHaveAttribute("data-embed-state", "loaded");
    expect(
      await page.evaluate(() => localStorage.getItem("embed-consent")),
    ).toBe("granted");
    await expect(page.locator("[data-embed-consent-deny]")).toBeFocused();
  });

  test("a stored choice applies across article navigation", async ({
    page,
  }) => {
    await page.addInitScript(() =>
      localStorage.setItem("embed-consent", "denied"),
    );
    const thirdPartyRequests: string[] = [];
    page.on("request", (request) => {
      if (isThirdPartyRequest(request.url()))
        thirdPartyRequests.push(request.url());
    });
    await page.goto(X_ARTICLE_PATH, { waitUntil: "networkidle" });
    await page.goto(YOUTUBE_ARTICLE_PATH, { waitUntil: "networkidle" });
    await expect(
      page.locator('[data-external-embed][data-provider="youtube"]'),
    ).toHaveAttribute("data-embed-state", "idle");
    expect(thirdPartyRequests).toHaveLength(0);
  });

  test("the notice bar is not present on pages without embeds", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator("[data-embed-consent-bar]")).toHaveCount(0);
  });

  test("the notice bar does not take keyboard focus on page load", async ({
    page,
  }) => {
    await page.route("https://www.youtube-nocookie.com/embed/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<!doctype html><title>Video fixture</title>",
      }),
    );
    await page.goto(YOUTUBE_ARTICLE_PATH, { waitUntil: "networkidle" });
    await expect(page.locator("[data-embed-consent-bar]")).toHaveCount(1);
    const activeInsideBar = await page.evaluate(
      () => !!document.activeElement?.closest("[data-embed-consent-bar]"),
    );
    expect(activeInsideBar).toBe(false);
  });
});
