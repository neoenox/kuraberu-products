import {
  createEmptyComparisonProject,
  sanitizeComparisonProject,
} from "./comparison-project";
import {
  memoStateKey,
  readMemoState,
  saveMemoState,
  encodeMemoBackup,
  parseMemoBackup,
  memoBackupMaxBytes,
  memoProductLimit,
  type MemoState,
} from "./memo-state";
import { renderProductComparison } from "./memo-product-view";
import type { MemoProduct } from "./memo-products";

export function initMemoApp(): void {
  const root = document.querySelector<HTMLElement>("[data-memo-page]");
  if (!root) return;
  const form = root.querySelector<HTMLFormElement>("[data-project-form]");
  const status = root.querySelector("[data-project-status]");
  const list = root.querySelector<HTMLElement>("[data-memo-list]");
  const comparison = root.querySelector<HTMLElement>(
    "[data-product-comparison]",
  );
  const picker = root.querySelector<HTMLSelectElement>("[data-product-picker]");
  const registry: MemoProduct[] = JSON.parse(
    root.querySelector("[data-memo-products]")?.textContent ?? "[]",
  );
  const templates = [
    ...root.querySelectorAll<HTMLTemplateElement>(
      "template[data-memo-template]",
    ),
  ];
  const knownIds = templates.flatMap((template) =>
    template.dataset.articleId ? [template.dataset.articleId] : [],
  );
  const articleNames = new Map(
    templates.map((template) => [
      template.dataset.articleId,
      template.content.querySelector("h3")?.textContent ??
        template.dataset.articleId,
    ]),
  );
  let state: MemoState;
  const message = (text: string) => {
    if (status) status.textContent = text;
  };
  const field = (name: string) => form?.elements.namedItem(name);
  const value = (name: string) => {
    const input = field(name);
    return input instanceof HTMLInputElement ||
      input instanceof HTMLTextAreaElement
      ? input.value
      : "";
  };
  const setValue = (name: string, text: string) => {
    const input = field(name);
    if (
      input instanceof HTMLInputElement ||
      input instanceof HTMLTextAreaElement
    )
      input.value = text;
  };
  const capture = (): MemoState => {
    const decision =
      form?.querySelector<HTMLInputElement>('input[name="decision"]:checked')
        ?.value ?? "undecided";
    const project = sanitizeComparisonProject(
      JSON.stringify({
        ...state.project,
        purpose: value("purpose"),
        budget: value("budget"),
        mustHave: value("mustHave").split("\n"),
        avoid: value("avoid").split("\n"),
        decision,
        decisionReason: value("decisionReason"),
        unresolved: value("unresolved").split("\n"),
      }),
      knownIds,
    );
    const products = state.products.map((note) => {
      const card = [
        ...(comparison?.querySelectorAll<HTMLElement>("[data-product-id]") ??
          []),
      ].find((c) => c.dataset.productId === note.id);
      return {
        ...note,
        reason:
          card?.querySelector<HTMLTextAreaElement>(
            '[data-product-note="reason"]',
          )?.value ?? note.reason,
        unresolved:
          card?.querySelector<HTMLTextAreaElement>(
            '[data-product-note="unresolved"]',
          )?.value ?? note.unresolved,
      };
    });
    return { ...state, project, products };
  };
  const fill = () => {
    for (const name of ["purpose", "budget", "decisionReason"] as const)
      setValue(name, state.project[name]);
    for (const name of ["mustHave", "avoid", "unresolved"] as const)
      setValue(name, state.project[name].join("\n"));
    const legacy = root.querySelector("[data-legacy-candidates]");
    if (legacy)
      legacy.textContent = state.project.candidateIds.length
        ? `以前に選んだ候補記事：${state.project.candidateIds.map((id) => articleNames.get(id) ?? id).join(" / ")}`
        : "";
    const radio = form?.querySelector<HTMLInputElement>(
      `input[name="decision"][value="${state.project.decision}"]`,
    );
    if (radio) radio.checked = true;
  };
  const commit = (next: MemoState): boolean => {
    try {
      saveMemoState(localStorage, next);
      state = next;
      message("比較メモを保存しました");
      return true;
    } catch {
      message(
        "保存できませんでした。入力と元の保存内容は保持されています。ブラウザの保存設定を確認してください。",
      );
      return false;
    }
  };
  const render = () => {
    if (comparison)
      renderProductComparison(comparison, state.products, registry, (id) => {
        const next = capture();
        next.products = next.products.filter((p) => p.id !== id);
        if (commit(next)) {
          render();
          picker?.focus();
        }
      });
    if (list) {
      list.replaceChildren();
      for (const id of state.ids) {
        const template = templates.find((t) => t.dataset.articleId === id);
        const item = template?.content.firstElementChild?.cloneNode(true);
        if (!(item instanceof HTMLElement)) continue;
        item
          .querySelector("[data-memo-remove]")
          ?.addEventListener("click", () => {
            const next = capture();
            next.ids = next.ids.filter((saved) => saved !== id);
            if (commit(next)) {
              render();
              const heading = root.querySelector<HTMLElement>(
                "#saved-articles-heading",
              );
              if (heading) {
                heading.tabIndex = -1;
                heading.focus();
              }
            }
          });
        list.append(item);
      }
    }
    const empty = root.querySelector<HTMLElement>("[data-memo-empty]");
    if (empty) empty.hidden = state.ids.length > 0;
  };
  const add = (productIds: string[]) => {
    const next = capture();
    for (const id of productIds)
      if (
        registry.some((p) => p.id === id) &&
        !next.products.some((p) => p.id === id)
      )
        next.products.push({ id, reason: "", unresolved: "" });
    if (next.products.length > memoProductLimit) {
      message("候補商品は8件までです。追加する前に候補を外してください。");
      return;
    }
    if (commit(next)) {
      render();
      message("比較候補に追加しました");
    }
  };
  try {
    state = readMemoState(localStorage, knownIds);
    const unavailable = state.products.filter(
      (p) => !registry.some((r) => r.id === p.id),
    ).length;
    state.products = state.products.filter((p) =>
      registry.some((r) => r.id === p.id),
    );
    // 以前に明示的に比較候補として選んだ記事のみ商品に対応づける。
    if (
      localStorage.getItem(memoStateKey) === null &&
      !state.products.length &&
      state.project.candidateIds.length
    ) {
      state.products = registry
        .filter((p) =>
          p.references.some((r) =>
            state.project.candidateIds.includes(r.articleId),
          ),
        )
        .slice(0, memoProductLimit)
        .map((p) => ({ id: p.id, reason: "", unresolved: "" }));
      message(
        "以前の候補記事から商品を表示しました。8件を超える候補記事も任意入力内の記録に保持しています。",
      );
    }
    fill();
    render();
    if (unavailable)
      message(
        `${unavailable}件の商品情報が公開対象外です。元の保存記録は復元確定・保存まで保持されます。`,
      );
    const articleId = new URL(location.href).searchParams.get("article");
    if (articleId && knownIds.includes(articleId)) {
      const incoming = registry
        .filter((p) => p.references.some((r) => r.articleId === articleId))
        .map((p) => p.id);
      if (!incoming.length)
        message(
          "この記事の商品情報は比較メモに未登録です。保存した記事から内容を確認してください。",
        );
      else {
        add(incoming);
        if (incoming.every((id) => state.products.some((p) => p.id === id))) {
          const url = new URL(location.href);
          url.searchParams.delete("article");
          history.replaceState(null, "", url.pathname + url.search + url.hash);
        }
      }
    }
  } catch {
    message(
      "保存内容を読み取れません。ブラウザの設定または保存データを確認してください。元データは変更していません。",
    );
    form?.querySelectorAll<HTMLButtonElement>("button").forEach((b) => {
      b.disabled = true;
    });
    state = {
      version: 2,
      ids: [],
      project: createEmptyComparisonProject(),
      products: [],
    };
    const exportButton =
      root.querySelector<HTMLButtonElement>("[data-memo-export]");
    if (exportButton) exportButton.disabled = true;
  }
  root.querySelector("[data-product-add]")?.addEventListener("click", () => {
    if (picker?.value) add([picker.value]);
  });
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    commit(capture());
  });

  const backupStatus = root.querySelector("[data-backup-status]");
  const backupMessage = (text: string) => {
    if (backupStatus) backupStatus.textContent = text;
  };
  const input = root.querySelector<HTMLInputElement>("[data-memo-import]");
  const preview = root.querySelector<HTMLElement>("[data-backup-preview]");
  const content = root.querySelector("[data-backup-content]");
  let pending: MemoState | undefined;
  let revision = 0;
  const cancel = () => {
    revision++;
    pending = undefined;
    if (preview) preview.hidden = true;
    if (input) input.value = "";
  };
  root.querySelector("[data-memo-export]")?.addEventListener("click", () => {
    try {
      const blob = new Blob([encodeMemoBackup(capture())], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "kuraberu-comparison-memo.json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      backupMessage("記入内容を含むバックアップを書き出しました。");
    } catch {
      backupMessage("書き出せませんでした。入力内容は保持されています。");
    }
  });
  input?.addEventListener("change", async () => {
    pending = undefined;
    if (preview) preview.hidden = true;
    const current = ++revision;
    const file = input.files?.[0];
    if (!file) return;
    try {
      if (file.size > memoBackupMaxBytes)
        throw new Error("ファイルは1MB以下にしてください");
      const result = parseMemoBackup(
        await file.text(),
        knownIds,
        registry.map((p) => p.id),
      );
      if (current !== revision) return;
      pending = result.state;
      if (content) content.textContent = encodeMemoBackup(result.state);
      if (preview) preview.hidden = false;
      backupMessage(
        `保存記事${result.state.ids.length}件・候補商品${result.state.products.length}件。公開対象外の記録${result.excluded}件は除外します。まだ保存内容は変更していません。`,
      );
    } catch (error) {
      if (current === revision)
        backupMessage(
          error instanceof Error ? error.message : "復元内容を読み取れません",
        );
    }
  });
  root.querySelector("[data-backup-cancel]")?.addEventListener("click", () => {
    cancel();
    backupMessage("復元を取り消しました。保存内容は変更していません。");
  });
  root.querySelector("[data-backup-confirm]")?.addEventListener("click", () => {
    if (!pending) return;
    if (commit(pending)) {
      fill();
      render();
      root.querySelectorAll<HTMLButtonElement>("button").forEach((button) => {
        button.disabled = false;
      });
      cancel();
      backupMessage("バックアップを復元しました。");
    } else
      backupMessage(
        "復元を保存できませんでした。元の保存内容は保持されています。",
      );
  });
}
