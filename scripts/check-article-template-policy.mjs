import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  CUSTOM_ARTICLE_PAGE_SLUGS,
  LEGACY_ARTICLE_PAGE_SLUGS,
} from "../config/article-template-policy.mjs";

const pagesRoot = join(process.cwd(), "src", "pages", "articles");
const violations = [];
for (const entry of readdirSync(pagesRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const pagePath = join(pagesRoot, entry.name, "index.astro");
  if (!existsSync(pagePath)) continue;
  const source = readFileSync(pagePath, "utf8");
  if (LEGACY_ARTICLE_PAGE_SLUGS.has(entry.name)) {
    if (!/ArticleComparisonPage/.test(source)) {
      violations.push(
        `src/pages/articles/${entry.name}/index.astro is allowlisted as legacy but no longer uses ArticleComparisonPage`,
      );
    }
    continue;
  }
  if (CUSTOM_ARTICLE_PAGE_SLUGS.has(entry.name)) continue;
  if (!/<CommercialArticlePage\b/.test(source)) {
    violations.push(
      `src/pages/articles/${entry.name}/index.astro must use CommercialArticlePage; add an explicit compatibility exception only for an existing custom page`,
    );
  }
}
if (violations.length) {
  console.error(violations.join("\n"));
  process.exit(1);
}
console.log(
  `article template policy ok: ${LEGACY_ARTICLE_PAGE_SLUGS.size} legacy and ${CUSTOM_ARTICLE_PAGE_SLUGS.size} custom pages are explicitly allowlisted`,
);
