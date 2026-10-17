# docs/archive

過去時点の記録です。現行ルールではありません。判断の経緯や当時の証跡をたどるときに参照します。

アーカイブ基準は [`../README.md`](../README.md) を参照してください（対応するIssue/PRがクローズ済み・現行ルールから参照されていない、の2条件を満たすもの）。

## 収録一覧（2026-10-17 に移動）

| 記録                                          | 元の場所                 | 内容                                                                                     |
| --------------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------- |
| `affiliate-link-audit-2026-08-16.md`          | `docs/`                  | 楽天アフィリエイトリンクの全件監査（2026-08-16）                                         |
| `competitive-audit-2026-08-07.md`             | `docs/`                  | 比較サイト競合監査（2026-08-07）                                                         |
| `hold-release-checklist.md`                   | `docs/`                  | HOLD リリース（PR #313）の作業チェックリスト。現在の運用は `../production-operations.md` |
| `issue-1-evidence.md`                         | `docs/`                  | Issue #1（モバイル体験）の実装・検証記録                                                 |
| `issue-2-evidence.md`                         | `docs/`                  | Issue #2（視覚・編集設計）の証跡                                                         |
| `issue-2-mock.md`                             | `docs/`                  | Issue #2 の採用モック（実装前のワイヤーフレーム）                                        |
| `product-source-review-2026-07-31.md`         | `docs/`                  | パンパース新生児用の商品別一次情報確認（確認日 2026-07-31）                              |
| `plans/2026-08-23-ui-refresh-quiet-craft*.md` | `docs/plans/`            | Quiet Craft の視覚刷新プラン（現行仕様は `../ui-ux-spec-2026-08.md`）                    |
| `reviews/2026-09-01-source-review.md`         | `docs/reviews/`          | 全ソース静的レビュー記録（2026-09-01）                                                   |
| `issue-2-evidence/`                           | `docs/issue-2-evidence/` | Issue #2 の before/after スクリーンショット                                              |

## 残している記録

次は名前・内容が記録寄りですが、コードやテストが直接参照するため `docs/` 直下に残します。

- `../article-handoffs/` — `scripts/check-article-handoff.mjs` / `check-commercial-article-quality.mjs` が公開判定に使う
- `../evidence/` — `scripts/validate-content.mjs` と `tests/external-embeds.test.ts` が参照する（`issue-15-embed-*` の混入を検出する）
