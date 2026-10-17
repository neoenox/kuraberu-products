# docs の読み方

## 現行ルール・手順（常に最新に保つ）

`site-management.md`、`chatgpt-article-handoff-manual.md`、`external-embed-policy.md`、`security-headers.md`、`production-operations.md`、`production-environment-setup.md`、`build-reproducibility.md`、`click-analytics.md`、`freshness-policy.md`、`rendered-gate-allowlist.md`、`source-relevancy-allowlist.md`、`article-research-template.md`、`article-backlog.md`、`ui-ux-spec-2026-08.md`、`article-data-schema-plan.md`

ルールを変えたら、README.md / CONTRIBUTING.md / AGENTS.md との重複記述も同時に直す。詳細はここ、README等には要約とリンクだけを書く。

### 記事別リファレンス

特定の記事だけで使う正規文字列・出典の控えは、その記事の方針として現行扱いにします（記録ではない）。

- `moony-m-source-notes.md` — ムーニー記事の商品名・公式URL・公式表記

## 記録（過去時点のスナップショット）

日付やIssue番号が付いた文書（`*-audit-*.md`、`*-review-*.md`、`issue-*-evidence*`）、PR作業時のチェックリストなど。現行ルールとして読まない。

### アーカイブ基準

- 対応するIssue/PRがクローズ済みで、現行ルールから参照されなくなったものは `docs/archive/` に移す。
- 移動の前に、リポジトリ全体で参照（他docs、`README.md` / `CONTRIBUTING.md` / `AGENTS.md`、`tests/` / `scripts/`）を確認し、参照があれば先に更新する。
- 移動後は `archive/README.md` の収録一覧に行を足す。

### 直下に残している記録（例外）

コードやテストが直接参照するため、記録でも `docs/` 直下に残す。

- `article-handoffs/` — 公開判定（`pnpm check:article-handoff`）が参照する
- `evidence/` — `scripts/validate-content.mjs` と `tests/external-embeds.test.ts` が参照する

2026-10-17 に基準を適用し、対象を `docs/archive/` へ移動しました（内訳は `archive/README.md`）。
