/**
 * 記事別の購入URLレジストリ（型付きの再公開）。
 * 旧「商品マスタ」（Product レコード）は、参照する記事がなくなったため削除した。
 */
import articlePurchaseLinksJson from "../data/article-purchase-links.json";

/**
 * 記事別の購入（アフィリエイト）URL レジストリ（単一情報源）
 *
 * 実データは src/data/article-purchase-links.json に置く。JSON だけを正規の
 * 編集対象とし、TypeScript 側は型付きで再公開するだけにする。
 * scripts/check-purchase-link-consistency.mjs も同じ JSON を直接読むため、
 * 正規表現によるソース解析は不要（整形・構文変化に強い）。
 * JSON にしか書けない構成のため、文字列リテラル以外（関数参照など）の
 * 混入が構造的に起きない（#436 の検索URL混入を防止）。
 */
export interface ArticlePurchaseLink {
  /** 表示名（例: ムーニー 低刺激であんしん） */
  name: string;
  /** 購入（アフィリエイト）URL */
  purchaseUrl: string;
}

export const articlePurchaseLinks: Record<string, ArticlePurchaseLink> =
  articlePurchaseLinksJson;
