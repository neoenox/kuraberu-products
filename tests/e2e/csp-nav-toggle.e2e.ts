/**
 * csp-nav-toggle.e2e.ts — E2E test for CSP compliance + nav toggle functionality.
 *
 * Simulates Production CSP headers (from public/_headers) via Playwright route
 * interception, then verifies:
 *   1. No CSP violation errors in the console
 *   2. nav-toggle.js (external same-origin script) loads successfully
 *   3. At 1440px the nav is visible and interactive
 *
 * This catches the P1 regression where BaseLayout.astro had an inline
 * <script is:inline> blocked by the Production CSP script-src 'self' policy.
 */

import { test, expect } from "@playwright/test";

/** Production CSP from public/_headers — applied via route interception. */
const PRODUCTION_CSP =
  "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; " +
  "script-src 'self' https://platform.twitter.com https://assets.pinterest.com https://widgets.pinterest.com; " +
  "frame-src https://platform.twitter.com https://assets.pinterest.com https://www.youtube-nocookie.com https://www.tiktok.com; " +
  "connect-src 'self' https://platform.twitter.com https://cdn.syndication.twimg.com https://api.twitter.com https://assets.pinterest.com; " +
  "img-src 'self' data: https://pbs.twimg.com https://abs.twimg.com https://i.pinimg.com https://*.image.rakuten.co.jp; " +
  "style-src 'self' 'unsafe-inline'; font-src 'self' data:; media-src 'self' https://www.youtube-nocookie.com https://www.tiktok.com; form-action 'self'";

/** Apply Production CSP headers to every response via route interception. */
async function applyProductionCSP(page: import("@playwright/test").Page) {
  await page.route("**/*", async (route) => {
    const response = await route.fetch();
    const headers = { ...response.headers() };
    headers["content-security-policy"] = PRODUCTION_CSP;
    await route.fulfill({ response, headers });
  });
}

test.describe("CSP + nav toggle (1440px)", () => {
  test("nav-toggle.js loads and nav is functional with Production CSP", async ({
    page,
  }) => {
    // Set viewport to desktop width where nav should be visible
    await page.setViewportSize({ width: 1440, height: 900 });

    // Intercept all responses and inject Production CSP headers
    await applyProductionCSP(page);

    // Collect console errors — any CSP violation will appear here
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to the top page
    await page.goto("/", { waitUntil: "networkidle" });

    // Assert: zero CSP violation errors
    const cspViolations = consoleErrors.filter(
      (err) =>
        err.includes("Content Security Policy") ||
        err.includes("Refused to execute") ||
        err.includes("violates the following Content Security Policy"),
    );
    expect(
      cspViolations,
      `CSP violations detected with Production headers:\n${cspViolations.join("\n")}`,
    ).toHaveLength(0);

    // Assert: nav-toggle.js loaded (check the script tag exists in the DOM)
    const navToggleScript = page.locator('script[src="/nav-toggle.js"]');
    await expect(navToggleScript).toHaveCount(1);

    // Assert: the desktop nav (outside <details>) is visible at 1440px (≥561px
    // threshold) without depending on the drawer state (#836)
    const desktopNav = page.locator("nav.navlinks--desktop");
    await expect(desktopNav).toBeVisible();
    const navLinks = desktopNav.locator("a");
    await expect(navLinks).toHaveCount(4);

    // Assert: at least the first nav link is visible on screen
    const firstLink = navLinks.first();
    await expect(firstLink).toBeVisible();

    // Assert: the mobile drawer <details> stays in the DOM for narrow viewports
    // (JS still syncs it, but desktop display must not depend on it)
    const navDetails = page.locator("[data-nav-toggle]");
    await expect(navDetails).toBeAttached();
  });

  test("nav closes at narrow viewport and re-opens at wide viewport", async ({
    page,
  }) => {
    // Start narrow (mobile) — nav should be closed
    await page.setViewportSize({ width: 375, height: 812 });
    await applyProductionCSP(page);

    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/", { waitUntil: "networkidle" });

    // No CSP errors on narrow viewport either
    const cspViolations = consoleErrors.filter(
      (err) =>
        err.includes("Content Security Policy") ||
        err.includes("Refused to execute"),
    );
    expect(cspViolations).toHaveLength(0);

    const navDetails = page.locator("[data-nav-toggle]");

    // At 375px the drawer should NOT be open, and the desktop nav is hidden
    const isOpenNarrow = await navDetails.getAttribute("open");
    expect(isOpenNarrow, "Nav should be closed at 375px").toBeNull();
    await expect(page.locator("nav.navlinks--desktop")).toBeHidden();

    // Tap the hamburger — the drawer opens via native <details> behavior
    await page.locator("[data-nav-toggle] > summary").click();
    await expect(navDetails).toHaveAttribute("open", "");
    await expect(navDetails.locator("a").first()).toBeVisible();

    // Resize to desktop — the desktop nav appears via CSS alone
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator("nav.navlinks--desktop")).toBeVisible();
    await expect(page.locator("nav.navlinks--desktop a").first()).toBeVisible();

    // Still no CSP errors after resize
    const cspViolationsAfterResize = consoleErrors.filter(
      (err) =>
        err.includes("Content Security Policy") ||
        err.includes("Refused to execute"),
    );
    expect(cspViolationsAfterResize).toHaveLength(0);
  });

  test("no inline script tags in the rendered HTML (CSP safety)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await applyProductionCSP(page);

    await page.goto("/", { waitUntil: "networkidle" });

    // Only non-executable scripts (type="application/ld+json") may have inline content
    const executableInlineScripts = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll("script"));
      return scripts
        .filter(
          (s) =>
            !s.src && s.textContent?.trim() && s.type !== "application/ld+json",
        )
        .map((s) => ({
          type: s.type,
          snippet: s.textContent?.trim().slice(0, 100) ?? "",
        }));
    });

    expect(
      executableInlineScripts,
      `Found executable inline scripts that would be blocked by CSP:\n${JSON.stringify(executableInlineScripts, null, 2)}`,
    ).toHaveLength(0);
  });
});

test.describe("nav without JavaScript (#836)", () => {
  test.use({ javaScriptEnabled: false });

  test("desktop nav is visible and usable at 1440px", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });

    const desktopNav = page.locator("nav.navlinks--desktop");
    await expect(desktopNav).toBeVisible();
    await expect(desktopNav.locator("a")).toHaveCount(4);

    // The first link (比較記事) navigates without JS
    await desktopNav.locator("a").first().click();
    await expect(page).toHaveURL(/\/articles\//);
  });

  test("mobile drawer opens natively at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/", { waitUntil: "networkidle" });

    // Desktop nav is hidden; hamburger is shown instead
    await expect(page.locator("nav.navlinks--desktop")).toBeHidden();
    const summary = page.locator("[data-nav-toggle] > summary");
    await expect(summary).toBeVisible();

    // Native <details> toggle (no JS involved)
    await summary.click();
    const drawerLinks = page.locator("[data-nav-toggle] nav.navlinks a");
    await expect(drawerLinks).toHaveCount(4);
    await expect(drawerLinks.first()).toBeVisible();
  });
});
