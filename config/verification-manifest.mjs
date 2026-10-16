/**
 * 検証チェックの単一マニフェスト（Refs #1062）。
 *
 * `package.json` の `verify:*` と CI（`.github/workflows/verify.yml`）と
 * ドキュメント（README / AGENTS / CONTRIBUTING）が同じチェック一覧を指すことを
 * テストと `scripts/check-verification-manifest.mjs` で保証する。
 *
 * ここを変更したら、`package.json` の対応する script も同じ文字列へ更新すること
 * （`pnpm exec node scripts/check-verification-manifest.mjs` で不一致を検出できる）。
 */

/** ビルドやネットワークに依存しない静的チェック（verify:fast）。 */
export const STATIC_CHECKS = [
  "node scripts/verify-pnpm-version.mjs",
  "prettier --check .",
  "eslint .",
  "astro check",
  "node scripts/validate-build-env.mjs",
  "node scripts/validate-content.mjs",
  "node scripts/check-radius-tokens.mjs",
];

/**
 * 記事ワークフロー系の追加静的チェックとユニットテスト。
 * `verify:lint` = `STATIC_CHECKS` + ここ。
 */
export const LINT_CHECKS = [
  ...STATIC_CHECKS,
  "node scripts/check-article-workflow.mjs",
  "node scripts/check-commercial-article-quality.mjs",
  "node scripts/check-article-template-policy.mjs",
  "node scripts/check-article-handoff.mjs",
  "node scripts/check-purchase-link-consistency.mjs",
  "node scripts/sync-published-backlog.mjs",
  "vitest run --coverage",
];

/** ビルドと生成物の検証（verify:build）。 */
export const BUILD_CHECKS = [
  "astro build",
  "node scripts/check-image-magic.mjs",
  "node scripts/check-image-budget.mjs",
  "node scripts/check-product-images.mjs",
  "node scripts/report-css-usage.mjs --fail-on-unused",
  "node scripts/check-rendered-html.mjs",
  "node scripts/check-deployment-html.mjs",
  "node scripts/test-post-deploy-verification.mjs",
  "node scripts/check-external-links.mjs",
  "node scripts/check-official-links.mjs check",
  "node scripts/check-article-factual-integrity.mjs check",
  "node scripts/spec-claims.mjs check",
  "node scripts/validate-sns-ranks.mjs check",
  "node scripts/check-source-relevancy.mjs check",
  "node scripts/check-price-claims.mjs check",
  "node scripts/check-csp-embed-consistency.mjs check",
];

/** マニフェストのステップ配列から npm script のコマンド文字列を生成する。 */
export function buildCommand(steps) {
  return steps.join(" && ");
}

/** verify 系 script 名 → 実行ステップ。`package.json` と一致させる対象。 */
export const VERIFY_SCRIPTS = {
  "verify:fast": STATIC_CHECKS,
  "verify:lint": LINT_CHECKS,
  "verify:build": BUILD_CHECKS,
};

/** `pnpm verify` は `verify:lint` → `verify:build` の順で実行する。 */
export const VERIFY_COMBINED = "pnpm verify:lint && pnpm verify:build";

/** マニフェストが参照する全ステップ（重複なし）。 */
export function allSteps() {
  return [...new Set([...STATIC_CHECKS, ...LINT_CHECKS, ...BUILD_CHECKS])];
}
