import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const articlesDir = path.join(root, "src", "content", "articles", "commercial");
const handoffDir = path.join(root, "docs", "article-handoffs");
const cutoff = "2026-09-16";
const errors = [];

const files = fs
  .readdirSync(articlesDir)
  .filter(
    (name) =>
      name.endsWith(".ts") && name !== "types.ts" && name !== "create.ts",
  );
for (const file of files) {
  const source = fs.readFileSync(path.join(articlesDir, file), "utf8");
  const publishedAt = source.match(/publishedAt:\s*["']([^"']+)["']/)?.[1];
  if (!publishedAt || publishedAt < cutoff) continue;
  const articleId = source.match(/id:\s*["']([^"']+)["']/)?.[1];
  const manifestId = source.match(/handoffManifestId:\s*["']([^"']+)["']/)?.[1];
  if (!articleId || !manifestId) {
    errors.push(`${file}: handoffManifestId is required for current articles`);
    continue;
  }
  const manifestPath = path.join(handoffDir, `${manifestId}.json`);
  if (!fs.existsSync(manifestPath)) {
    errors.push(`${file}: missing ${path.relative(root, manifestPath)}`);
    continue;
  }
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    errors.push(`${manifestPath}: invalid JSON (${error.message})`);
    continue;
  }
  if (manifest.articleId !== articleId || manifest.id !== manifestId) {
    errors.push(`${manifestPath}: articleId/id does not match the seed`);
  }
  for (const side of ["left", "right"]) {
    const amazon = manifest.amazon?.[side];
    if (amazon && !source.includes(amazon))
      errors.push(`${articleId}: Amazon ${side} URL is missing from the seed`);
    const rakuten = manifest.rakuten?.[side];
    if (
      manifest.rakuten?.status === "verified" &&
      rakuten &&
      !source.includes(rakuten)
    ) {
      errors.push(
        `${articleId}: verified Rakuten ${side} URL is missing from the seed`,
      );
    }
  }
  if (
    manifest.rakuten?.status === "verified" &&
    (!manifest.rakuten.left || !manifest.rakuten.right)
  ) {
    errors.push(
      `${articleId}: verified Rakuten handoff requires both product URLs`,
    );
  }
  if (manifest.social?.status === "adopted") {
    if (!source.includes("socialProofHasPosts: true"))
      errors.push(
        `${articleId}: adopted SNS handoff is not enabled in the seed`,
      );
    const urls = [
      ...(manifest.social.directPostUrls ?? []),
      ...(manifest.social.embedUrls ?? []),
    ];
    for (const url of urls)
      if (!source.includes(url))
        errors.push(`${articleId}: SNS URL is missing from the seed: ${url}`);
  }
  if (
    manifest.social?.status === "none" &&
    source.includes("socialProofHasPosts: true")
  ) {
    errors.push(
      `${articleId}: SNS handoff says none but the seed enables posts`,
    );
  }
}

if (errors.length) {
  console.error("Article handoff validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("Article handoff validation passed.");
