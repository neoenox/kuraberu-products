/**
 * unverified-cta.e2e.ts — E2E test for the purchase-CTA contract on current articles.
 *
 * 現行テンプレートの比較記事は、購入先を記事末尾の「購入先」1か所にまとめる
 * （結論直後の next-step 欄は出さない）。実ブラウザで次を確認する。
 * - 結論直後に購入ボタン（next-step）を出さないこと。
 * - 購入先に、確認済みの購入ボタンが2件出ること（新しいタブ・noopener）。
 * - モバイル幅 (390px) では横スクロールが発生せず、購入ボタンが
 *   タップしやすい大きさを保つこと。
 *
 * 購入リンクが未確認のときの描画（購入カードの pending 表示）は、
 * ユニットテスト tests/purchase-card.test.ts が確認している。
 *
 * Test target:
 * - /articles/kobo-clara-colour-vs-libra-colour/ (purchaseLinkStatus: verified)
 */

import { test, expect } from "@playwright/test";

const VERIFIED_PATH = "/articles/kobo-clara-colour-vs-libra-colour/";

test.describe("purchase CTA (desktop)", () => {
  test("does not render a next-step purchase block after the conclusion", async ({
    page,
  }) => {
    await page.goto(VERIFIED_PATH);
    await expect(page.locator("[data-next-step]")).toHaveCount(0);
    await expect(page.locator("a.next-step__buy")).toHaveCount(0);
  });

  test("shows two purchase buttons in the purchase section of a verified article", async ({
    page,
  }) => {
    await page.goto(VERIFIED_PATH);
    const buttons = page.locator("#purchase ~ .purchase-cards a.cta-card");
    await expect(buttons).toHaveCount(2);
    for (const element of await buttons.all()) {
      await expect(element).toHaveAttribute("target", "_blank");
      const rel = (await element.getAttribute("rel")) ?? "";
      expect(rel).toContain("noopener");
    }
  });
});

test.describe("purchase CTA on mobile width", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("causes no horizontal overflow on article pages", async ({ page }) => {
    await page.goto(VERIFIED_PATH);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(
      overflow,
      `horizontal overflow on ${VERIFIED_PATH}`,
    ).toBeLessThanOrEqual(1);
  });

  test("keeps verified purchase buttons tappable at 390px", async ({
    page,
  }) => {
    await page.goto(VERIFIED_PATH);
    const buttons = page.locator("#purchase ~ .purchase-cards a.cta-card");
    await expect(buttons).toHaveCount(2);
    for (const element of await buttons.all()) {
      const box = await element.boundingBox();
      expect(box, "purchase button must be visible").not.toBeNull();
      // 44px 以上をタップ領域の最低線とする。
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.width).toBeGreaterThan(200);
    }
  });
});
