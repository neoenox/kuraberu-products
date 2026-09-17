import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { LEGACY_ARTICLE_PAGE_SLUGS } from "../config/article-template-policy.mjs";

const pagesRoot = join(process.cwd(), "src", "pages", "articles");
const violations = [];
for (const entry of readdirSync(pagesRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const pagePath = join(pagesRoot, entry.name, "index.astro");
  if (!existsSync(pagePath)) continue;
  const source = readFileSync(pagePath, "utf8");
  if (
    /ArticleComparisonPage/.test(source) &&
    !LEGACY_ARTICLE_PAGE_SLUGS.has(entry.name)
  ) {
    violations.push(
      `src/pages/articles/${entry.name}/index.astro uses the legacy ArticleComparisonPage; use CommercialArticlePage for new articles`,
    );
  }
}
if (violations.length) {
  console.error(violations.join("\n"));
  process.exit(1);
}
console.log(
  `article template policy ok: ${LEGACY_ARTICLE_PAGE_SLUGS.size} historical compatibility pages are allowlisted`,
);
