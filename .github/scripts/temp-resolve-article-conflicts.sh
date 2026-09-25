#!/usr/bin/env bash
set -euo pipefail

git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
git fetch origin main article/next-product article/next-product-3 article/next-product-5

resolve_one() {
  local pr="$1"
  local target="$2"
  shift 2
  local expected=("$@")

  echo "=== PR #$pr ($target) ==="
  git checkout -B "resolve-$pr" "origin/$target"

  if git merge --no-ff origin/main -m "Merge main into $target"; then
    echo "Merged main cleanly."
  else
    mapfile -t conflicts < <(git diff --name-only --diff-filter=U)
    printf 'Conflicts: %s\n' "${conflicts[*]}"

    for file in "${conflicts[@]}"; do
      local allowed=false
      for wanted in "${expected[@]}"; do
        if [[ "$file" == "$wanted" ]]; then
          allowed=true
          break
        fi
      done
      if [[ "$allowed" != true ]]; then
        echo "Unexpected conflict in PR #$pr: $file" >&2
        exit 1
      fi
      # The PR-side version was already rebuilt from current main plus the
      # PR-specific addition immediately before this merge.
      git checkout --ours -- "$file"
      git add "$file"
    done

    for wanted in "${expected[@]}"; do
      if printf '%s\n' "${conflicts[@]}" | grep -Fxq "$wanted"; then
        continue
      fi
      echo "Expected conflict did not occur (safe): $wanted"
    done

    git commit -m "Merge main into $target and resolve article registry conflicts"
  fi

  git push origin "HEAD:$target"
}

resolve_one 895 article/next-product \
  src/content/articles/commercial/seeds.ts \
  scripts/check-commercial-article-quality.mjs

resolve_one 896 article/next-product-3 \
  src/content/articles/commercial/seeds.ts

resolve_one 898 article/next-product-5 \
  src/content/articles/commercial/seeds.ts
