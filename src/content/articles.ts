/**
 * 記事レジストリ（単一情報源）
 *
 * 個別記事ファイルから再エクスポートし、
 * 消費者コードはここだけを import する。
 *
 * 注: ファイルは分割済み。このファイルはテストの raw source 読み込みとの
 * 後方互換性のために残置されている。
 */
export {
  // Type re-exports
  type ArticleChangeLogEntry,
  type ArticleMetadata,
  type ArticleMetadataBase,
  type ComparisonSide,
  type ComparisonRow,
  type GuideArticleMetadata,
  type ComparisonArticleMetadata,
  defineArticleMetadata,
  // Individual article exports (alphabetical by slug)
  panasonicBabyMonitorArticle,
  panasonicEhNa9mGuideArticle,
  // Commercial article exports
  additionalCommercialArticles,
  additionalCommercialArticleSeeds,
  articleMetadata,
  publicArticleMetadata,
  publishedArticleMetadata,
} from "./articles/index";
