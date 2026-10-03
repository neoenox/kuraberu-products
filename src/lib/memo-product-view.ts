import type { MemoProduct } from "./memo-products";
import type { ProductNote } from "./memo-state";

function node<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text?: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  return element;
}
export function renderProductComparison(
  container: HTMLElement,
  notes: readonly ProductNote[],
  registry: readonly MemoProduct[],
  remove: (id: string) => void,
): void {
  container.replaceChildren();
  const selected = notes.flatMap((note) => {
    const product = registry.find((p) => p.id === note.id);
    return product ? [{ product, note }] : [];
  });
  if (!selected.length) {
    container.append(
      node(
        "p",
        "比較する商品はまだありません。商品を選ぶか、記事の「この2商品を比較する」から追加してください。",
      ),
    );
    return;
  }
  const cards = node("div");
  cards.className = "memo-product-grid";
  for (const { product, note } of selected) {
    const card = node("section");
    card.className = "card memo-product";
    card.dataset.productId = product.id;
    card.append(node("h3", product.name));
    for (const ref of product.references) {
      card.append(node("p", `選ぶ理由：${ref.reason}`));
      const link = node(
        "a",
        `比較記事・出典を読む（商品情報確認日 ${ref.checkedAt}）`,
      );
      link.href = ref.path;
      card.append(link);
      if (ref.sources.length) {
        const sources = node("ul");
        for (const source of ref.sources) {
          const item = node("li");
          const a = node("a", source.label);
          a.href = source.url;
          item.append(a);
          sources.append(item);
        }
        card.append(sources);
      }
    }
    for (const [key, label] of [
      ["reason", "自分が選ぶ理由"],
      ["unresolved", "未確認事項・確認したいこと"],
    ] as const) {
      const field = node("label", label);
      const input = node("textarea");
      input.maxLength = 500;
      input.rows = 2;
      input.value = note[key];
      input.dataset.productNote = key;
      field.append(input);
      card.append(field);
    }
    const button = node("button", "候補から外す");
    button.type = "button";
    button.addEventListener("click", () => remove(product.id));
    card.append(button);
    cards.append(card);
  }
  container.append(cards);
  const categories = [
    ...new Set(
      selected.flatMap((p) => p.product.references.map((r) => r.category)),
    ),
  ];
  for (const category of categories) {
    const labels = [
      ...new Set(
        selected.flatMap((p) =>
          p.product.references
            .filter((r) => r.category === category)
            .flatMap((r) => r.specs.map((s) => s.label)),
        ),
      ),
    ];
    if (!labels.length) continue;
    container.append(node("h3", `${category}の比較項目`));
    const common = labels.some((label) =>
      selected.every((p) =>
        p.product.references.some(
          (r) =>
            r.category === category && r.specs.some((s) => s.label === label),
        ),
      ),
    );
    if (selected.length > 1 && !common)
      container.append(
        node(
          "p",
          "全候補に共通する比較項目はありません。情報がない商品は未確認として表示します。",
        ),
      );
    for (const label of labels) {
      const row = node("section");
      row.className = "memo-comparison-row";
      row.append(node("h4", label));
      const cells = node("div");
      cells.className = "memo-product-grid";
      for (const { product } of selected) {
        const cell = node("div");
        cell.append(node("strong", product.name));
        const refs = product.references.filter(
          (r) =>
            r.category === category && r.specs.some((s) => s.label === label),
        );
        if (!refs.length)
          cell.append(node("p", "未確認（記事に対応する情報なし）"));
        for (const ref of refs) {
          for (const spec of ref.specs.filter((s) => s.label === label))
            cell.append(node("p", spec.value));
          const source = node("a", `出典・確認日 ${ref.checkedAt}`);
          source.href = ref.path;
          cell.append(source);
        }
        cells.append(cell);
      }
      row.append(cells);
      container.append(row);
    }
  }
}
