/**
 * 記事レジストリ（単一情報源）
 *
 * 個別記事ファイルから再エクスポートし、
 * 消費者コードはここだけを import する。
 */
// Type re-exports
export type {
  ArticleChangeLogEntry,
  ArticleMetadata,
  ArticleMetadataBase,
  ComparisonSide,
  ComparisonRow,
  GuideArticleMetadata,
  ComparisonArticleMetadata,
} from "./types";
export { defineArticleMetadata } from "./types";

// Individual article exports
export { panasonicBabyMonitorArticle } from "./panasonic-baby-monitor-kx-hc705";
export { panasonicEhNa9mGuideArticle } from "./panasonic-eh-na9m-guide";

// Commercial article exports
export { commercialArticleSeeds, createCommercialArticle } from "./commercial";

// Re-import for computed values
import type { ArticleMetadata } from "./types";
import { panasonicBabyMonitorArticle } from "./panasonic-baby-monitor-kx-hc705";
import { panasonicEhNa9mGuideArticle } from "./panasonic-eh-na9m-guide";
import { commercialArticleSeeds, createCommercialArticle } from "./commercial";
import { isPublishedArticlePath } from "../../../config/article-template-policy.mjs";

/** 全記事の配列（商業記事を含む） */
const commercialIds = new Set(commercialArticleSeeds.map((seed) => seed.id));
const draftCommercialIds = new Set(
  commercialArticleSeeds.filter((seed) => seed.draft).map((seed) => seed.id),
);

export const additionalCommercialArticles: readonly ArticleMetadata[] =
  Object.freeze(
    commercialArticleSeeds.map((seed) => createCommercialArticle(seed)),
  );

export const additionalCommercialArticleSeeds = commercialArticleSeeds;

export const articleMetadata: readonly ArticleMetadata[] = Object.freeze([
  panasonicBabyMonitorArticle,
  panasonicEhNa9mGuideArticle,
  ...additionalCommercialArticles,
]);

const publicArticleMetadata = Object.freeze(
  articleMetadata.filter(
    (article) =>
      !commercialIds.has(article.id) ||
      (!draftCommercialIds.has(article.id) &&
        Boolean(article.productInfoCheckedAt)),
  ),
);
const publishedArticleMetadata = Object.freeze(
  publicArticleMetadata.filter((article) =>
    isPublishedArticlePath(article.path),
  ),
);
export { publicArticleMetadata, publishedArticleMetadata };
