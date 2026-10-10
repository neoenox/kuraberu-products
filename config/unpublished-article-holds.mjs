/**
 * 未公開（PUBLISHED_ARTICLE_PAGE_SLUGS に含まれない）商業記事シードの保留台帳。
 *
 * 各グループは「保留理由」「解除条件」「見直し期限（reviewBy）」を持つ。
 * 期限を過ぎたグループは tests/unpublished-article-holds.test.ts が失敗する。
 * 期限が来たら、公開（品質ゲート通過）か削除かを決めて台帳を更新する。
 */
export const UNPUBLISHED_HOLD_GROUPS = [
  {
    id: "legacy-memo-format",
    reason:
      "旧形式（くらべる商品メモ）の初稿。商品情報確認日・購入先確認状態・handoffが未整備で、公式情報の再確認も未実施。",
    releaseCondition:
      "docs/chatgpt-article-handoff-manual.md の手順で再確認・再作成し、品質ゲートを通して PUBLISHED_ARTICLE_PAGE_SLUGS へ個別追加する。",
    reviewBy: "2026-12-31",
    // 他グループに属さない未公開シードの既定グループ
    default: true,
    slugs: [],
  },
  {
    id: "handoff-in-progress",
    reason:
      "handoffManifestId を持つが、公開条件（購入先の確認済み状態など）が未完了。",
    releaseCondition:
      "docs/article-handoffs の該当manifestを完了させ、各商品に確認済み購入先が1つ以上ある状態にする。",
    reviewBy: "2026-11-30",
    slugs: [
      "elecom-de-c85-vs-de-c86",
      "shokz-openfit-2-plus-vs-openfit-2",
      "soundcore-liberty-5-pro-vs-liberty-4-pro",
    ],
  },
];

/** slug が属する保留グループ（個別指定がなければ既定グループ）。 */
export function holdGroupFor(slug) {
  const group =
    UNPUBLISHED_HOLD_GROUPS.find((candidate) =>
      candidate.slugs.includes(slug),
    ) ?? UNPUBLISHED_HOLD_GROUPS.find((candidate) => candidate.default);
  if (!group) throw new Error("unpublished hold groups need a default group");
  return group;
}
