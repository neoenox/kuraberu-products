import {
  additionalCommercialArticleSeeds,
  publishedArticleMetadata,
} from "../content/articles";
import { comparisonV2 } from "../content/articles/comparison-v2";

export function memoProductId(name: string): string {
  // 完全一致する表記のみ統合。型番・色・容量を推測して同一商品としない。
  return name.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
}
export interface MemoProduct {
  id: string;
  name: string;
  references: {
    articleId: string;
    path: string;
    category: string;
    checkedAt: string;
    reason: string;
    sources: { label: string; url: string }[];
    specs: { label: string; value: string }[];
  }[];
}
export function buildMemoProducts(): MemoProduct[] {
  const products = new Map<string, MemoProduct>();
  for (const article of publishedArticleMetadata) {
    const legacy = Object.entries(comparisonV2).find(
      ([id]) => id === article.id,
    )?.[1];
    const seed = additionalCommercialArticleSeeds.find(
      (s) => s.id === article.id,
    );
    const rows =
      seed?.verifiedRows ??
      article.keyDiffRows ??
      article.verifiedRows ??
      legacy?.rows ??
      [];
    const sides: readonly ("left" | "right")[] =
      article.productCount === 1 ? ["left"] : ["left", "right"];
    for (const side of sides) {
      const model =
        (side === "left" ? article.leftModel : article.rightModel) ??
        legacy?.[side];
      const name =
        (side === "left" ? seed?.leftProduct : seed?.rightProduct) ??
        (model
          ? `${model.brand} ${model.line}`
          : side === "left"
            ? article.aboutProductNames?.[0]
            : undefined);
      if (!name) continue;
      const id = memoProductId(name);
      const product = products.get(id) ?? { id, name, references: [] };
      product.references.push({
        articleId: article.id,
        path: article.path,
        category: article.category,
        checkedAt: article.productInfoCheckedAt ?? "未記録",
        reason:
          (side === "left" ? seed?.leftPoint : seed?.rightPoint) ??
          model?.tagline ??
          "選ぶ理由は未記録",
        sources: [
          ...(seed?.officialSources ??
            article.officialSources ??
            (model?.officialHref
              ? [{ label: `${name} 公式商品ページ`, url: model.officialHref }]
              : [])),
        ],
        specs: rows.map((row) => ({ label: row.label, value: row[side] })),
      });
      products.set(id, product);
    }
  }
  return [...products.values()];
}
