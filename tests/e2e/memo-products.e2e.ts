import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

const key = "kuraberu:memo-state:v2";
const article = "instax-mini-13-vs-mini-41";
test("direct comparison preserves product notes, deduplicates, and fits mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto(`/memo/?article=${article}`);
  await expect(page.locator("[data-product-id]")).toHaveCount(2);
  await page.locator('[data-product-note="reason"]').first().fill("持ち運び用");
  await page
    .getByRole("button", { name: "比較メモを保存", exact: true })
    .click();
  await page.reload();
  await expect(page.locator("[data-product-id]")).toHaveCount(2);
  await expect(
    page.locator('[data-product-note="reason"]').first(),
  ).toHaveValue("持ち運び用");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .locator("[data-product-id]")
    .first()
    .getByRole("button", { name: "候補から外す" })
    .click();
  await page.goto("/memo/");
  await expect(page.locator("[data-product-id]")).toHaveCount(1);
});

test("legacy saved articles stay separate and chosen candidates survive migration", async ({
  page,
}) => {
  await page.addInitScript((id) => {
    localStorage.setItem(
      "kuraberu:comparison-memo:v1",
      JSON.stringify({ version: 1, ids: [id] }),
    );
    localStorage.setItem(
      "kuraberu:comparison-project:v1",
      JSON.stringify({
        version: 1,
        purpose: "以前の目的",
        decision: "hold",
        candidateIds: [],
        unresolved: ["確認する"],
      }),
    );
  }, article);
  await page.goto("/memo/");
  await expect(page.locator("[data-product-id]")).toHaveCount(0);
  await expect(page.locator("[data-memo-item]")).toHaveCount(1);
  await page.locator("[data-project-details] summary").click();
  await expect(page.locator('[name="purpose"]')).toHaveValue("以前の目的");
  await page
    .locator("[data-memo-item]")
    .getByRole("link", { name: "この2商品を比較する →" })
    .click();
  await expect(page.locator("[data-product-id]")).toHaveCount(2);
  await page.goto("/memo/");
  await expect(page.locator("[data-product-id]")).toHaveCount(2);
  await expect(page.locator('[name="purpose"]')).toHaveValue("以前の目的");
});

test("backup previews safely, cancels, rejects invalid files and restores atomically", async ({
  page,
}) => {
  await page.goto(`/memo/?article=${article}`);
  const original = await page.evaluate((k) => localStorage.getItem(k), key);
  const state = JSON.parse(original!);
  const backup = {
    ...state,
    version: 1,
    format: "kuraberu-comparison-memo",
    project: { ...state.project, purpose: "<img src=x onerror=alert(1)>" },
  };
  const upload = async (text: string) =>
    page.locator("[data-memo-import]").setInputFiles({
      name: "backup.json",
      mimeType: "application/json",
      buffer: Buffer.from(text),
    });
  await upload(JSON.stringify(backup));
  await expect(page.locator("[data-backup-preview]")).toBeVisible();
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBe(
    original,
  );
  await expect(page.locator("[data-backup-content]")).toContainText(
    "<img src=x onerror=alert(1)>",
  );
  await page.getByRole("button", { name: "取り消す", exact: true }).click();
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBe(
    original,
  );
  await upload("{invalid");
  await expect(page.locator("[data-backup-status]")).toContainText("JSON形式");
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBe(
    original,
  );
  await upload(JSON.stringify(backup));
  await page.getByRole("button", { name: "この内容で置き換える" }).click();
  await expect(page.locator('[name="purpose"]')).toHaveValue(
    backup.project.purpose,
  );
  await page.goto("/memo/");
  await expect(page.locator('[name="purpose"]')).toHaveValue(
    backup.project.purpose,
  );
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "現在の入力をファイルに書き出す" })
    .click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("kuraberu-comparison-memo.json");
  const file = await download.path();
  expect(file).toBeTruthy();
  const exported = JSON.parse(await readFile(file!, "utf8"));
  expect(exported.project.purpose).toBe(backup.project.purpose);
  expect(exported.products).toEqual(backup.products);
});

test("quota failures keep inputs and previous state; unrelated products stay unconfirmed", async ({
  page,
}) => {
  await page.goto(`/memo/?article=${article}`);
  const unrelated = await page.evaluate(() => {
    const products = JSON.parse(
      document.querySelector("[data-memo-products]")!.textContent!,
    );
    return products.find((p: { references: { category: string }[] }) =>
      p.references.some((r) => r.category.includes("イヤホン")),
    )?.id;
  });
  expect(unrelated).toBeTruthy();
  await page.locator("[data-product-picker]").selectOption(unrelated);
  await page.getByRole("button", { name: "比較に追加", exact: true }).click();
  await expect(page.locator("[data-product-comparison]")).toContainText(
    "全候補に共通する比較項目はありません",
  );
  await expect(page.locator("[data-product-comparison]")).toContainText(
    "未確認（記事に対応する情報なし）",
  );
  const original = await page.evaluate((k) => localStorage.getItem(k), key);
  await page
    .locator('[data-product-note="reason"]')
    .first()
    .fill("保存前の入力");
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("quota", "QuotaExceededError");
    };
  });
  await page
    .getByRole("button", { name: "比較メモを保存", exact: true })
    .click();
  await expect(page.locator("[data-project-status]")).toContainText(
    "保存できませんでした",
  );
  await expect(
    page.locator('[data-product-note="reason"]').first(),
  ).toHaveValue("保存前の入力");
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBe(
    original,
  );
  const snapshot = JSON.parse(original!);
  const backup = {
    ...snapshot,
    version: 1,
    format: "kuraberu-comparison-memo",
    project: { ...snapshot.project, purpose: "復元候補" },
  };
  await page.locator("[data-memo-import]").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(backup)),
  });
  await page.getByRole("button", { name: "この内容で置き換える" }).click();
  await expect(page.locator("[data-backup-status]")).toContainText(
    "復元を保存できませんでした",
  );
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBe(
    original,
  );
});

test("previously selected articles migrate once, and corrupted storage can recover after confirmation", async ({
  page,
}) => {
  await page.addInitScript((id) => {
    localStorage.setItem(
      "kuraberu:comparison-project:v1",
      JSON.stringify({
        version: 1,
        purpose: "旧候補",
        decision: "hold",
        candidateIds: [id],
      }),
    );
  }, article);
  await page.goto("/memo/");
  await expect(page.locator("[data-product-id]")).toHaveCount(2);
  await page
    .getByRole("button", { name: "比較メモを保存", exact: true })
    .click();
  await page
    .locator("[data-product-id]")
    .first()
    .getByRole("button", { name: "候補から外す" })
    .click();
  await page
    .locator("[data-product-id]")
    .first()
    .getByRole("button", { name: "候補から外す" })
    .click();
  await page.reload();
  await expect(page.locator("[data-product-id]")).toHaveCount(0);
  const saved = await page.evaluate((k) => localStorage.getItem(k), key);
  const backup = {
    ...JSON.parse(saved!),
    version: 1,
    format: "kuraberu-comparison-memo",
  };
  await page.evaluate((k) => localStorage.setItem(k, "broken"), key);
  await page.reload();
  await expect(page.locator("[data-project-status]")).toContainText(
    "保存内容を読み取れません",
  );
  await page.locator("[data-memo-import]").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(backup)),
  });
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBe(
    "broken",
  );
  await page.getByRole("button", { name: "この内容で置き換える" }).click();
  await expect(page.locator("[data-backup-status]")).toContainText(
    "復元しました",
  );
  await expect(
    page.getByRole("button", { name: "比較メモを保存", exact: true }),
  ).toBeEnabled();
  expect(
    JSON.parse((await page.evaluate((k) => localStorage.getItem(k), key))!)
      .project.purpose,
  ).toBe("旧候補");
});
