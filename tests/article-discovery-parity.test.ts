/**
 * サーバ側の同義語辞書（src/lib/article-discovery.ts）とクライアント側の
 * 辞書（public/scripts/article-discovery.js）の同期不変条件を検証する。
 *
 * public/ 配下の素のJSは Astro バンドルを通らないため、クライアントは
 * TS実装を import できない。そのため辞書は手動同期になっており、片方だけ
 * 更新されると検索結果がサーバとクライアントで食い違う。このテストは
 * 「TS定義を import し、JSファイルのテキストからキー群を抽出して比較する」
 * ことで、同期漏れをビルド前に検出する。
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  SYNONYMS,
  expandQueryTermGroups,
  normalizeDiscoveryText,
} from "../src/lib/article-discovery";

const clientSource = readFileSync(
  "public/scripts/article-discovery.js",
  "utf8",
);

/** JS 側の SYNONYMS Map リテラル部分を抽出する。 */
function extractClientMapLiteral(source: string): string {
  const start = source.indexOf("const SYNONYMS = new Map([");
  expect(
    start,
    "client JS must declare `const SYNONYMS = new Map([...`",
  ).toBeGreaterThanOrEqual(0);
  const end = source.indexOf("]);", start);
  expect(
    end,
    "client SYNONYMS literal must be closed with `]);`",
  ).toBeGreaterThan(start);
  return source.slice(start, end + "]);".length);
}

/** Map リテラルのテキストから [キー, 同義語配列] を抽出する。 */
function parseSynonymEntries(literal: string): Map<string, string[]> {
  const entries = new Map<string, string[]>();
  for (const match of literal.matchAll(/\[\s*"([^"]+)"\s*,\s*\[([^\]]*)\]/g)) {
    const key = match[1];
    const synonyms = (match[2]?.match(/"([^"]+)"/g) ?? []).map((quoted) =>
      quoted.slice(1, -1),
    );
    entries.set(key, synonyms);
  }
  return entries;
}

const clientEntries = parseSynonymEntries(
  extractClientMapLiteral(clientSource),
);

describe("article discovery synonym parity", () => {
  it("client dictionary is non-empty and parseable", () => {
    expect(clientEntries.size).toBeGreaterThan(0);
  });

  it("declares exactly the same keys as the server definition", () => {
    const serverKeys = [...SYNONYMS.keys()].sort();
    const clientKeys = [...clientEntries.keys()].sort();
    expect(clientKeys).toEqual(serverKeys);
  });

  it("maps each key to the same synonym list as the server definition", () => {
    for (const [key, serverSynonyms] of SYNONYMS) {
      expect(clientEntries.get(key), `synonyms for "${key}"`).toEqual([
        ...serverSynonyms,
      ]);
    }
  });
});

/** JS 側の expandTermGroup 関数ソースを抽出する。 */
function loadClientExpander(): (term: string) => string[] {
  const marker = "const expandTermGroup = (term) => {";
  const start = clientSource.indexOf(marker);
  expect(
    start,
    "client JS must define `const expandTermGroup = ...`",
  ).toBeGreaterThanOrEqual(0);
  let depth = 0;
  let end = -1;
  for (let i = start; i < clientSource.length; i++) {
    if (clientSource[i] === "{") depth++;
    else if (clientSource[i] === "}") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  expect(end, "client expandTermGroup must be balanced").toBeGreaterThan(start);
  const factory = new Function(
    "SYNONYMS",
    `${clientSource.slice(start, end + 1)}; return expandTermGroup;`,
  ) as (synonyms: Map<string, string[]>) => (term: string) => string[];
  return factory(new Map(clientEntries));
}

describe("article discovery expansion parity", () => {
  const expandClient = loadClientExpander();

  it.each([
    "軽い",
    "重い",
    "静か",
    "手入れが簡単",
    "超軽い",
    "安いもの",
    "掃除",
    "存在しない語XYZ",
  ])("expands %s identically on both sides", (term) => {
    expect(expandClient(term)).toEqual([...expandQueryTermGroups([term])[0]]);
  });
});

/** 実際のブラウザ用 termMatches を抽出して検索結果の一致を比較する。 */
function loadClientTermMatcher(): (term: string, text: string) => boolean {
  const marker = "const termMatches = (term, text) => {";
  const start = clientSource.indexOf(marker);
  expect(start, "client JS must define termMatches").toBeGreaterThanOrEqual(0);
  const closing = "\n  };";
  const end = clientSource.indexOf(closing, start);
  expect(end, "client termMatches must be closed").toBeGreaterThan(start);
  const factory = new Function(
    "expandTermGroup",
    `${clientSource.slice(start, end + closing.length)}; return termMatches;`,
  ) as (
    expander: (term: string) => string[],
  ) => (term: string, text: string) => boolean;
  return factory(loadClientExpander());
}

describe("article discovery final search-result parity", () => {
  const clientTermMatches = loadClientTermMatcher();
  const cases: Array<readonly [string, string, boolean]> = [
    ["手入れが簡単", "洗浄機能を比較", true],
    ["手入れが簡単", "掃除しやすい", true],
    ["手入れが簡単", "軽量モデル", false],
    ["軽い 静か", "軽量で静音", true],
    ["軽い 静か", "軽量だが普通の音", false],
    ["超軽い", "重量を比較", true],
    ["安いもの", "価格を比較", true],
    ["存在しない語XYZ", "存在しない語XYZ", true],
    ["存在しない語XYZ", "洗浄機能", false],
    ["手入れが簡単", "手入れが簡単", true],
  ];

  it.each(cases)(
    "query %s against %s matches on server and client",
    (query, text, expected) => {
      const haystack = normalizeDiscoveryText(text);
      const terms = normalizeDiscoveryText(query).split(" ").filter(Boolean);
      const serverMatch = expandQueryTermGroups(terms).every((group) =>
        group.some((candidate) => haystack.includes(candidate)),
      );
      const clientMatch = terms.every((term) =>
        clientTermMatches(term, haystack),
      );
      expect(serverMatch).toBe(expected);
      expect(clientMatch).toBe(serverMatch);
    },
  );
});
