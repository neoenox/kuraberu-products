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

// 価格ガイド本文の上部に、基準日と経過日数を 1 行で示すラベルを出す（#1090）。
// 以前は注意書き（.notice）/メタ行（.meta, 0.88rem の淡色）に埋もれていた。
const guides = [
  ["/guides/sd-card-price-per-gb/", "SDカード"],
  ["/guides/instax-mini-film-price/", "instax mini フィルム"],
  ["/guides/instax-mini-pattern-film-price/", "instax mini 絵柄つきフィルム"],
] as const;

for (const [path, name] of guides) {
  test(`price guide labels the price basis date: ${name}`, async ({ page }) => {
    await page.goto(path);
    const basis = page.locator("[data-price-basis]");
    await expect(basis).toHaveCount(1);
    await expect(basis).toHaveAttribute("data-price-basis", "2026-09-30");
    await expect(basis).toContainText("価格の基準日");
    await expect(basis).toContainText("2026年9月30日");
    await expect(basis.locator("[data-price-basis-age]")).toContainText(
      "取得から",
    );
    // 注意書きより前に置き、読み飛ばされない位置に出す。
    expect(
      await page.evaluate(() => {
        const b = document.querySelector("[data-price-basis]");
        const n = document.querySelector(".notice");
        if (!b || !n) return "missing";
        return b.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_FOLLOWING
          ? "before"
          : "after";
      }),
    ).toBe("before");
  });
}
