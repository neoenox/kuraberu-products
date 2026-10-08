/**
 * scripts/check-price-freshness.mjs
 *
 * 公開中の商用記事のうち、本文に価格（○○円）を載せている記事と、トップページの
 * 価格ガイド（src/data/*-prices.ts の *_CHECKED_AT）について、
 * 確認日が閾値（既定 30 日）を超えたものを報告する。
 * check-price-claims.mjs は価格の記述に確認日などの文脈があるかを見るが、
 * その確認日の古さは見ないため、週次ワークフローで再確認を促す。
 *
 * 使い方:
 *   node scripts/check-price-freshness.mjs [--threshold-days 30] [--as-of 2026-10-05]
 *   .acceptance/price-freshness/report.md を出力し、対象があれば exit 1。
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isPublishedArticlePath } from "../config/article-template-policy.mjs";

export const DEFAULT_THRESHOLD_DAYS = 30;
const COMMERCIAL_SEED_DIR = "src/content/articles/commercial";
const PRICE_GUIDE_DIR = "src/data";
const PRICE_RE = /[0-9][0-9,]{2,}円/g;
const DAY_MS = 86_400_000;

const field = (source, name) =>
  new RegExp(`\\b${name}\\s*:\\s*"([^"]+)"`).exec(source)?.[1];

/** 公開中で価格を載せている商用記事の確認日を集める。 */
export function collectPricedArticles({
  root = ".",
  isPublished = isPublishedArticlePath,
} = {}) {
  const directory = path.join(root, COMMERCIAL_SEED_DIR);
  const articles = [];
  if (!fs.existsSync(directory)) return articles;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".ts")) continue;
    const source = fs.readFileSync(path.join(directory, entry.name), "utf8");
    if (!/\bhandoffManifestId\s*:/.test(source)) continue; // seed 以外
    const id = field(source, "id");
    if (!id || /\bdraft\s*:\s*true\b/.test(source)) continue;
    if (!isPublished(`/articles/${id}/`)) continue;
    const priceMentions = (source.match(PRICE_RE) ?? []).length;
    if (priceMentions === 0) continue;
    articles.push({
      id,
      checkedAt: field(source, "productInfoCheckedAt") ?? null,
      priceMentions,
    });
  }
  return articles.sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * 価格ガイド（src/data/*-prices.ts）の確認日を集める。
 * 各ファイルの `export const XXX_CHECKED_AT = "YYYY-MM-DD"` を確認日とし、
 * 価格の記載数は `price: 数値` の出現数で数える。
 */
export function collectPriceGuides({ root = "." } = {}) {
  const directory = path.join(root, PRICE_GUIDE_DIR);
  const guides = [];
  if (!fs.existsSync(directory)) return guides;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith("-prices.ts")) continue;
    const source = fs.readFileSync(path.join(directory, entry.name), "utf8");
    const checkedAt =
      /export const [A-Z0-9_]*CHECKED_AT\s*=\s*"([^"]+)"/.exec(source)?.[1] ??
      null;
    guides.push({
      id: `guide:${entry.name.replace(/\.ts$/, "")}`,
      checkedAt,
      priceMentions: (source.match(/\bprice\s*:\s*[0-9]/g) ?? []).length,
    });
  }
  return guides.sort((a, b) => a.id.localeCompare(b.id));
}

/** 確認日が閾値を超えた（または確認日がない）記事を古い順に返す。 */
export function findStalePricedArticles(articles, asOf, thresholdDays) {
  const asOfTime = Date.parse(`${asOf}T00:00:00Z`);
  return articles
    .map((article) => ({
      ...article,
      ageDays: article.checkedAt
        ? Math.floor(
            (asOfTime - Date.parse(`${article.checkedAt}T00:00:00Z`)) / DAY_MS,
          )
        : null,
    }))
    .filter(
      (article) => article.ageDays === null || article.ageDays > thresholdDays,
    )
    .sort((a, b) => (b.ageDays ?? Infinity) - (a.ageDays ?? Infinity));
}

export function renderReport(stale, asOf, thresholdDays) {
  const lines = [
    `# 価格表示の再確認（${asOf} 時点）`,
    "",
    `公開中の商用記事（productInfoCheckedAt）と価格ガイド（guide: 接頭辞、*_CHECKED_AT）のうち、確認日が ${thresholdDays} 日を超えたもの: ${stale.length} 件`,
    "",
  ];
  if (stale.length === 0) {
    lines.push("対象はありません。");
  } else {
    lines.push(
      "| 記事 | 確認日 | 経過日数 | 価格の記載数 |",
      "| --- | --- | --- | --- |",
    );
    for (const article of stale) {
      lines.push(
        `| \`${article.id}\` | ${article.checkedAt ?? "未記載"} | ${article.ageDays ?? "-"} | ${article.priceMentions} |`,
      );
    }
    lines.push(
      "",
      "メーカー公式ページで価格・仕様を再確認し、記事の価格・確認日（productInfoCheckedAt と本文の確認日表記）を更新してください。",
      "`guide:` の項目は、src/data の該当ファイルで楽天市場の価格を取り直し、*_CHECKED_AT と価格を更新してください。",
    );
  }
  return `${lines.join("\n")}\n`;
}

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--threshold-days") {
      options.thresholdDays = Number(argv[index + 1]);
      index += 1;
    } else if (argv[index] === "--as-of") {
      options.asOf = argv[index + 1];
      index += 1;
    }
  }
  return options;
}

if (
  path.resolve(process.argv[1] ?? "") ===
  path.resolve(fileURLToPath(import.meta.url))
) {
  const options = parseArgs(process.argv.slice(2));
  const asOf = options.asOf ?? new Date().toISOString().slice(0, 10);
  const thresholdDays = Number.isFinite(options.thresholdDays)
    ? options.thresholdDays
    : DEFAULT_THRESHOLD_DAYS;
  const stale = findStalePricedArticles(
    [...collectPricedArticles(), ...collectPriceGuides()],
    asOf,
    thresholdDays,
  );
  const report = renderReport(stale, asOf, thresholdDays);
  const outputDir = ".acceptance/price-freshness";
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "report.md"), report, "utf8");
  console.log(report);
  if (stale.length > 0) process.exitCode = 1;
}
