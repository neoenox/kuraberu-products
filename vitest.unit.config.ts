/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";
import { DIST_SUITE_FILES } from "./tests/dist-suites.mjs";

// ビルド不要のテストのみを実行する（開発中の素早いフィードバック用）。
// dist 依存スイートは DIST_SUITE_FILES が唯一の分類情報源で、ここから除外する。
// dist の生成物まで検証する場合は `pnpm build && pnpm test:dist` を使う。
export default getViteConfig({
  test: {
    setupFiles: ["./tests/vitest-setup.ts"],
    // exclude を指定すると vitest 既定の除外が置き換わるため、既定も明示する。
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.astro/**",
      ...DIST_SUITE_FILES,
    ],
  },
});
