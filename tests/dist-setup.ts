import { existsSync } from "node:fs";

// dist スイート（tests/dist-suites.mjs の DIST_SUITE_FILES）はビルド出力を
// 検証する。dist が無いまま実行すると、各ケースが skipIf で静かに素通りして
// 成功に見えてしまうため、dist 専用実行では fail-fast する。
// REQUIRE_DIST は vitest.dist.config.ts が設定する。通常の `pnpm test` /
// `pnpm test:unit` では未設定なので、この検査は働かない。
if (process.env.REQUIRE_DIST === "1" && !existsSync("dist/index.html")) {
  throw new Error(
    "dist/index.html がありません。dist 依存のテスト（pnpm test:dist）は" +
      "ビルド出力を検証するため、`pnpm build` の後に実行してください。",
  );
}
