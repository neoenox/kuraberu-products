/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";
import { DIST_SUITE_FILES } from "./tests/dist-suites.mjs";

// dist 依存スイートのみを実行する。対象は tests/dist-suites.mjs が唯一の情報源。
// dist が無ければ tests/dist-setup.ts が fail-fast する（skip で素通りさせない）。
// `pnpm build` の後に実行すること。CI では verify:build の直後に実行する。
export default getViteConfig({
  test: {
    include: DIST_SUITE_FILES,
    setupFiles: ["./tests/vitest-setup.ts", "./tests/dist-setup.ts"],
    env: { REQUIRE_DIST: "1" },
  },
});
