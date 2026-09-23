import fs from "node:fs";
import path from "node:path";
import { PUBLISHED_ARTICLE_PAGE_SLUGS } from "../config/article-template-policy.mjs";

const root = process.cwd();
const articlesDir = path.join(root, "src", "content", "articles", "commercial");
const routesDir = path.join(root, "src", "pages", "articles");
const handoffDir = path.join(root, "docs", "article-handoffs");
const cutoff = "2026-09-18";
const errors = [];

const files = fs
  .readdirSync(articlesDir)
  .filter(
    (name) =>
      name.endsWith(".ts") &&
      !["types.ts", "create.ts", "seeds.ts"].includes(name),
  );

function has(source, pattern) {
  return pattern instanceof RegExp
    ? pattern.test(source)
    : source.includes(pattern);
}

for (const file of files) {
  const source = fs.readFileSync(path.join(articlesDir, file), "utf8");
  const publishedAt = source.match(/publishedAt:\s*["']([^"']+)["']/)?.[1];
  if (!publishedAt || publishedAt < cutoff) continue;

  const articleId = source.match(/id:\s*["']([^"']+)["']/)?.[1];
  const manifestId = source.match(/handoffManifestId:\s*["']([^"']+)["']/)?.[1];
  if (!articleId) {
    errors.push(`${file}: id is required`);
    continue;
  }
  const required = [
    ["modifiedAt", /modifiedAt:\s*["'][^"']+["']/],
    ["handoffManifestId", /handoffManifestId:\s*["'][^"']+["']/],
    ["productInfoCheckedAt", /productInfoCheckedAt:\s*["'][^"']+["']/],
    ["purchaseLinksCheckedAt", /purchaseLinksCheckedAt:\s*["'][^"']+["']/],
    ["leftImage", /leftImage:\s*["'](?:\/|https:\/\/)/],
    ["rightImage", /rightImage:\s*["'](?:\/|https:\/\/)/],
    ["officialSources", /officialSources:\s*\[/],
    ["verifiedRows", /verifiedRows:\s*\[/],
    ["faqEntries", /faqEntries:\s*\[/],
    ["decisionGuideSteps", /decisionGuideSteps:\s*\[/],
  ];
  for (const [label, pattern] of required) {
    if (!has(source, pattern)) errors.push(`${articleId}: missing ${label}`);
  }

  const routePath = path.join(routesDir, articleId, "index.astro");
  if (!fs.existsSync(routePath)) errors.push(`${articleId}: route is missing`);
  for (const imageKey of ["leftImage", "rightImage"]) {
    const image = source.match(
      new RegExp(`${imageKey}:\\s*["']([^"']+)["']`),
    )?.[1];
    if (!image) continue;
    if (image.startsWith("https://")) continue;
    if (!image.startsWith("/products/")) {
      errors.push(`${articleId}: ${imageKey} must use /products/... or https://`);
      continue;
    }
    if (!fs.existsSync(path.join(root, "public", image.slice(1)))) {
      errors.push(`${articleId}: image file is missing: ${image}`);
    }
  }

  if (!manifestId) continue;
  const manifestPath = path.join(handoffDir, `${manifestId}.json`);
  if (!fs.existsSync(manifestPath)) {
    errors.push(`${articleId}: handoff manifest is missing`);
    continue;
  }
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch {
    errors.push(`${articleId}: handoff manifest is invalid JSON`);
    continue;
  }
  const isPublished = PUBLISHED_ARTICLE_PAGE_SLUGS.has(articleId);
  if (manifest.articleReady !== true) {
    if (isPublished)
      errors.push(
        `${articleId}: published article must have articleReady=true`,
      );
    continue;
  }
  if (!/purchaseLinkStatus:\s*"(?:verified|direct)"/.test(source)) {
    errors.push(
      `${articleId}: articleReady=true requires a CTA-enabled purchaseLinkStatus`,
    );
  }
  for (const side of ["left", "right"]) {
    const amazon = manifest.amazon?.[side];
    const rakuten = manifest.rakuten?.[side];
    if (
      !/^https:\/\//.test(amazon ?? "") ||
      manifest.rakuten?.status !== "verified" ||
      !/^https:\/\/hb\.afl\.rakuten\.co\.jp\//.test(rakuten ?? "")
    ) {
      errors.push(
        `${articleId}: ${side} needs confirmed Amazon and Rakuten URLs`,
      );
    }
  }
  const socialStatus = manifest.social?.status;
  if (socialStatus === "adopted") {
    if (!has(source, "socialProofHasPosts: true"))
      errors.push(
        `${articleId}: adopted SNS requires socialProofHasPosts: true`,
      );
    if (!has(source, /embeds:\s*\[/))
      errors.push(`${articleId}: adopted SNS requires embeds`);
    if (!(manifest.social.embedUrls?.length > 0))
      errors.push(`${articleId}: adopted SNS requires an embed URL`);
  } else if (socialStatus === "none") {
    if (
      has(source, "socialProofHasPosts: true") ||
      has(source, /embeds:\s*\[/)
    ) {
      errors.push(`${articleId}: SNS status none must not enable SNS output`);
    }
  } else {
    errors.push(`${articleId}: social.status must be adopted or none`);
  }
}

if (errors.length) {
  console.error("Commercial article quality check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(
  `Commercial article quality check passed for articles published on or after ${cutoff}.`,
);
