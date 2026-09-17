import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  CUSTOM_ARTICLE_PAGE_SLUGS,
  LEGACY_ARTICLE_PAGE_SLUGS,
} from "../config/article-template-policy.mjs";

const pagesRoot = join(process.cwd(), "src", "pages", "articles");
const violations = [];
const routes = readdirSync(pagesRoot, { withFileTypes: true }).flatMap(
  (entry) => {
    if (entry.isDirectory()) {
      const pagePath = join(pagesRoot, entry.name, "index.astro");
      return existsSync(pagePath) ? [{ slug: entry.name, pagePath }] : [];
    }
    if (
      entry.isFile() &&
      entry.name.endsWith(".astro") &&
      entry.name !== "index.astro"
    ) {
      return [
        {
          slug: entry.name.slice(0, -".astro".length),
          pagePath: join(pagesRoot, entry.name),
        },
      ];
    }
    return [];
  },
);
for (const { slug, pagePath } of routes) {
  const source = readFileSync(pagePath, "utf8");
  if (LEGACY_ARTICLE_PAGE_SLUGS.has(slug)) {
    if (!/ArticleComparisonPage/.test(source)) {
      violations.push(
        `${pagePath} is allowlisted as legacy but no longer uses ArticleComparisonPage`,
      );
    }
    continue;
  }
  if (CUSTOM_ARTICLE_PAGE_SLUGS.has(slug)) continue;
  if (!/<CommercialArticlePage\b/.test(source)) {
    violations.push(
      `${pagePath} must use CommercialArticlePage; add an explicit compatibility exception only for an existing custom page`,
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
