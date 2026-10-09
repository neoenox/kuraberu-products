import { expect, it } from "vitest";
import {
  readMemoState,
  parseMemoBackup,
  saveMemoState,
  encodeMemoBackup,
  memoStateKey,
} from "../src/lib/memo-state";
import { comparisonProjectStorageKey } from "../src/lib/comparison-project";
import { comparisonMemoStorageKey } from "../src/lib/comparison-memo";
import { buildMemoProducts, memoProductId } from "../src/lib/memo-products";

function storage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}
it("keeps product identity exact and combines repeated article references", () => {
  expect(memoProductId(" A  B ")).toBe(memoProductId("A B"));
  expect(memoProductId("A Black")).not.toBe(memoProductId("A White"));
  const products = buildMemoProducts();
  expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
  expect(products.some((p) => p.references.length > 1)).toBe(true);
});
it("migrates legacy fields without turning saved articles into candidates", () => {
  const s = storage();
  s.setItem(
    comparisonMemoStorageKey,
    JSON.stringify({ version: 1, ids: ["a"] }),
  );
  s.setItem(
    comparisonProjectStorageKey,
    JSON.stringify({
      version: 1,
      purpose: "用途",
      candidateIds: [],
      decision: "hold",
      unresolved: ["確認"],
    }),
  );
  const state = readMemoState(s, ["a"]);
  expect(state.ids).toEqual(["a"]);
  expect(state.project.purpose).toBe("用途");
  expect(state.project.decision).toBe("hold");
  expect(state.products).toEqual([]);
  expect(s.getItem(memoStateKey)).toBeNull();
});
it("round trips notes and reports removed articles without mutating storage", () => {
  const s = storage();
  const state = readMemoState(s, ["a"]);
  state.ids = ["a", "old"];
  state.products = [
    { id: "product", reason: "<script>text</script>", unresolved: "未確認" },
  ];
  const result = parseMemoBackup(encodeMemoBackup(state), ["a"], ["product"]);
  expect(result.state.products).toEqual(state.products);
  expect(result.excluded).toBe(1);
  expect(result.state.ids).toEqual(["a"]);
  expect(s.getItem(memoStateKey)).toBeNull();
});
it("rejects invalid JSON, versions, types, oversized data and duplicate candidates", () => {
  const raw = JSON.parse(encodeMemoBackup(readMemoState(storage(), ["a"])));
  for (const bad of [
    "{",
    JSON.stringify({ ...raw, version: 9 }),
    JSON.stringify({ ...raw, ids: [2] }),
    JSON.stringify({ ...raw, project: { ...raw.project, decision: "wrong" } }),
    " ".repeat(1048577),
    JSON.stringify({
      ...raw,
      products: [
        { id: "p", reason: "", unresolved: "" },
        { id: "p", reason: "", unresolved: "" },
      ],
    }),
  ]) {
    expect(() => parseMemoBackup(bad, ["a"], ["p"])).toThrow();
  }
});
it("writes a single snapshot atomically and preserves the previous value on quota failure", () => {
  const s = storage();
  const state = readMemoState(s, ["a"]);
  saveMemoState(s, state);
  const original = s.getItem(memoStateKey);
  const failing = {
    getItem: s.getItem,
    setItem: () => {
      throw new Error("quota");
    },
  };
  expect(() => saveMemoState(failing, { ...state, ids: ["a"] })).toThrow(
    "quota",
  );
  expect(s.getItem(memoStateKey)).toBe(original);
});
