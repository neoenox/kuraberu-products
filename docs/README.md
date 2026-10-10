# docs の読み方

## 現行ルール・手順（常に最新に保つ）

`site-management.md`、`chatgpt-article-handoff-manual.md`、`external-embed-policy.md`、`security-headers.md`、`production-operations.md`、`production-environment-setup.md`、`build-reproducibility.md`、`click-analytics.md`、`freshness-policy.md`、`rendered-gate-allowlist.md`、`source-relevancy-allowlist.md`、`article-research-template.md`、`article-backlog.md`

ルールを変えたら、README.md / CONTRIBUTING.md / AGENTS.md との重複記述も同時に直す。詳細はここ、README等には要約とリンクだけを書く。

## 記録（過去時点のスナップショット）

日付やIssue番号が付いた文書（`*-audit-*.md`、`*-review-*.md`、`issue-*-evidence*`）、`evidence/`、`reviews/`、`plans/`、`article-handoffs/`。現行ルールとして読まない。

### アーカイブ基準

- 対応するIssue/PRがクローズ済みで、現行ルールから参照されなくなったものは `docs/archive/` に移してよい。
- `article-handoffs/*.json` は記事の公開判定（`check:article-handoff`）が参照するため、公開中の記事に対応するものは移動しない。
- 移動の前に、`grep` でリンク元と、`tests/` / `scripts/` からの参照を確認する。参照があれば先に更新する。

この基準は未適用で、実際の移動は別PRで行う。
