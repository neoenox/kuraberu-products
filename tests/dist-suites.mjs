/**
 * `dist`（astro build の生成物）に依存するテストファイルの分類（単一の情報源）。
 *
 * これらは生成HTML/ディレクトリを読むため `existsSync("dist"...)` でガードし、
 * ビルドが無い環境では skip する。分類は以下から参照される。
 *   - vitest.unit.config.ts : unit 実行から除外する
 *   - vitest.dist.config.ts : dist 実行の対象にする（dist 必須・fail-fast）
 *
 * 分類が古くならないよう、tests/dist-gate-awareness.test.ts が
 * 「dist ガードを持つテストファイル ⊂ この配列」を機械的に検証する。
 * 新しい dist 依存テストを追加したら、この配列にも追加すること。
 */
export const DIST_SUITE_FILES = [
  "tests/article-cta-consistency.test.ts",
  "tests/article-discovery.test.ts",
  "tests/article-metadata.test.ts",
  "tests/comparison-memo.test.ts",
  "tests/content-freshness.test.ts",
  "tests/not-found.test.ts",
  "tests/official-link-separation.test.ts",
  "tests/product-choice-ux.test.ts",
  "tests/runtime-hardening.test.ts",
  "tests/top-page.test.ts",
];

/**
 * `dist` を参照するが dist スイートではないファイル（常に実行する）。
 * スイートではないものの判定はこの allowlist を唯一の例外口とし、理由を必須にする。
 */
export const DIST_REFERENCE_ALLOWLIST = {
  "tests/dist-gate-awareness.test.ts":
    "dist の有無を警告する awareness テストであり、ビルド不要で常に実行する",
};

/**
 * そのファイルが「dist の有無に依存するガード」を持つかの判定に使う走査パターン。
 * `existsSync("dist")` や `existsSync(join("dist/articles", ...))` のような
 * 存在チェックを広めに検出する（誤検出側に倒し、分類漏れを防ぐ）。
 */
export const DIST_GUARD_PATTERN = /existsSync\([^)]*dist/i;
