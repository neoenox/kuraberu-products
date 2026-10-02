import {
  comparisonMemoStorageKey,
  sanitizeComparisonMemo,
} from "./comparison-memo";
import {
  comparisonDecisions,
  comparisonProjectStorageKey,
  createEmptyComparisonProject,
  sanitizeComparisonProject,
  type ComparisonProject,
} from "./comparison-project";

export const memoStateKey = "kuraberu:memo-state:v2";
export const memoBackupMaxBytes = 1048576;
export const memoProductLimit = 8;
export interface ProductNote {
  id: string;
  reason: string;
  unresolved: string;
}
export interface MemoState {
  version: 2;
  ids: string[];
  project: ComparisonProject;
  products: ProductNote[];
}
export interface MemoStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("形式が正しくありません");
  return value as Record<string, unknown>;
}
function text(value: unknown, limit: number): string {
  if (typeof value !== "string" || value.length > limit)
    throw new Error("文字列の型・長さが正しくありません");
  return value;
}
function list(value: unknown, limit: number, itemLimit = 500): string[] {
  if (!Array.isArray(value) || value.length > limit)
    throw new Error("項目数が上限を超えています");
  return value.map((item) => text(item, itemLimit));
}

function validateState(raw: unknown): MemoState {
  const value = record(raw);
  if (value.version !== 2) throw new Error("非対応の保存形式です");
  const ids = list(value.ids, 50);
  if (
    ids.some((id) => !/^[a-z0-9-]+$/.test(id)) ||
    new Set(ids).size !== ids.length
  )
    throw new Error("記事IDが正しくありません");
  const p = record(value.project);
  if (p.version !== 1 || !comparisonDecisions.some((d) => d === p.decision))
    throw new Error("判断の値が正しくありません");
  const project: ComparisonProject = {
    ...createEmptyComparisonProject(),
    purpose: text(p.purpose, 300),
    budget: text(p.budget, 100),
    mustHave: list(p.mustHave, 1000),
    avoid: list(p.avoid, 1000),
    candidateIds: list(p.candidateIds, 1000),
    decision: p.decision as ComparisonProject["decision"],
    decisionReason: text(p.decisionReason, 500),
    unresolved: list(p.unresolved, 1000),
  };
  if (project.candidateIds.some((id) => !/^[a-z0-9-]+$/.test(id)))
    throw new Error("候補記事IDが正しくありません");
  if (
    !Array.isArray(value.products) ||
    value.products.length > memoProductLimit
  )
    throw new Error("商品数が上限を超えています");
  const products = value.products.map((item) => {
    const note = record(item);
    return {
      id: text(note.id, 500),
      reason: text(note.reason, 500),
      unresolved: text(note.unresolved, 500),
    };
  });
  if (
    products.some((p) => !p.id) ||
    new Set(products.map((p) => p.id)).size !== products.length
  )
    throw new Error("商品が重複しています");
  return { version: 2, ids, project, products };
}

export function readMemoState(
  storage: MemoStorage,
  knownIds: readonly string[],
): MemoState {
  const raw = storage.getItem(memoStateKey);
  if (raw !== null) {
    const state = validateState(JSON.parse(raw));
    const allowed = new Set(knownIds);
    return {
      ...state,
      ids: state.ids.filter((id) => allowed.has(id)),
      project: {
        ...state.project,
        candidateIds: state.project.candidateIds.filter((id) =>
          allowed.has(id),
        ),
      },
    };
  }
  return {
    version: 2,
    ids: [
      ...sanitizeComparisonMemo(
        storage.getItem(comparisonMemoStorageKey),
        knownIds,
      ).ids,
    ],
    project: sanitizeComparisonProject(
      storage.getItem(comparisonProjectStorageKey),
      knownIds,
    ),
    products: [],
  };
}

export function saveMemoState(storage: MemoStorage, state: MemoState): void {
  // Web Storage setItem は失敗時に既存値を維持する。複数キーの途中更新を行わない。
  storage.setItem(memoStateKey, JSON.stringify(validateState(state)));
}
export function encodeMemoBackup(state: MemoState): string {
  return JSON.stringify(
    {
      format: "kuraberu-comparison-memo",
      version: 1,
      ...Object.fromEntries(
        Object.entries(validateState(state)).filter(
          ([key]) => key !== "version",
        ),
      ),
    },
    null,
    2,
  );
}
export function parseMemoBackup(
  raw: string,
  knownIds: readonly string[],
  knownProducts: readonly string[],
): { state: MemoState; excluded: number } {
  if (new TextEncoder().encode(raw).byteLength > memoBackupMaxBytes)
    throw new Error("ファイルは1MB以下にしてください");
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("JSON形式を読み取れません");
  }
  const value = record(parsed);
  if (value.format !== "kuraberu-comparison-memo" || value.version !== 1)
    throw new Error("非対応のバックアップ形式です");
  const state = validateState({ ...value, version: 2 });
  const articles = new Set(knownIds);
  const products = new Set(knownProducts);
  const excludedIds = new Set(
    [...state.ids, ...state.project.candidateIds].filter(
      (id) => !articles.has(id),
    ),
  );
  const excludedProducts = state.products.filter(
    (p) => !products.has(p.id),
  ).length;
  return {
    state: {
      ...state,
      ids: state.ids.filter((id) => articles.has(id)),
      project: {
        ...state.project,
        candidateIds: state.project.candidateIds.filter((id) =>
          articles.has(id),
        ),
      },
      products: state.products.filter((p) => products.has(p.id)),
    },
    excluded: excludedIds.size + excludedProducts,
  };
}
