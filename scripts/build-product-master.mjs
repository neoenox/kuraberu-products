/**
 * 商品マスタ（#1064 Phase 1）の生成スクリプト。
 *
 * 変換元（計画 docs/article-data-schema-plan.md §2.1）:
 * - 記事seed … src/content/articles/commercial/*.ts（本Phaseは公開53スラッグのみ）
 * - handoff台帳 … docs/article-handoffs/*.json（model / officialUrl の補完）
 *
 * 目的は「マスタを新設し、単体でスキーマ検証できる」こと。記事の表示・検証は
 * 変更しない（併走移行は Phase 2）。生成物 src/data/products/catalog.json は
 * 再現可能で、同じ入力からは常に同じ内容になる（tests/product-master.test.ts）。
 *
 * 使い方:
 *   node scripts/build-product-master.mjs            # catalog.json を再生成
 *   node scripts/build-product-master.mjs --check    # 現状と一致するか確認（書き込まない）
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { PUBLISHED_ARTICLE_PAGE_SLUGS } from "../config/article-template-policy.mjs";

export const ARTICLES_DIR = "src/content/articles/commercial";
export const HANDOFF_DIR = "docs/article-handoffs";
export const OUTPUT_PATH = "src/data/products/catalog.json";
export const OVERRIDES_PATH = "src/data/products/overrides.json";

/**
 * 表示名からブランドを解決する規則（順序どおりに評価し、最初の一致を採用）。
 * - `patterns`: ブランド判定に使う正規表現。
 * - `strip`: `line` を作るため名前の先頭から除去する正規表現（一致優先順）。
 *
 * 判定語は「現行UIが表示しているブランド表記」に合わせる（英字ブランドは英字、
 * 日本語ブランドは日本語）。新しい商品はここへ追記し、テストが全商品のbrand解決を
 * 検証する（未解決があれば fail）。
 */
export const BRAND_RULES = [
  {
    brand: "Apple",
    patterns: [
      /^Apple\b/i,
      /\biPad\b/,
      /\biPhone\b/,
      /^MacBook\b/,
      /^AirPods\b/,
      /搭載AirPods/,
    ],
    strip: [/^\d+(?:\.\d+)?インチ\s*/, /^Apple\s+/i],
  },
  {
    brand: "Amazon",
    patterns: [/^Amazon\b/i, /^Kindle\b/],
    strip: [/^Amazon\s+/i],
  },
  {
    brand: "ソニー",
    patterns: [/^ソニー/, /^Sony\b/i],
    strip: [/^ソニー\s*/, /^Sony\s+/i],
  },
  {
    brand: "Google",
    patterns: [/^Google\b/i, /^Pixel\b/],
    strip: [/^Google\s+/i],
  },
  {
    brand: "Samsung",
    patterns: [/^Samsung\b/i, /^Galaxy\b/],
    strip: [/^Samsung\s+/i],
  },
  { brand: "Anker", patterns: [/^Anker\b/i], strip: [/^Anker\s+/i] },
  {
    brand: "Soundcore",
    patterns: [/^Soundcore\b/i],
    strip: [/^Soundcore\s+/i],
  },
  { brand: "Logicool", patterns: [/^Logicool\b/i], strip: [/^Logicool\s+/i] },
  { brand: "JBL", patterns: [/^JBL\b/i], strip: [/^JBL\s+/i] },
  { brand: "Crucial", patterns: [/^Crucial\b/i], strip: [/^Crucial\s+/i] },
  { brand: "Kingston", patterns: [/^Kingston\b/i], strip: [/^Kingston\s+/i] },
  { brand: "Nintendo", patterns: [/^Nintendo\b/i], strip: [/^Nintendo\s+/i] },
  { brand: "Garmin", patterns: [/^Garmin\b/i], strip: [/^Garmin\s+/i] },
  { brand: "COROS", patterns: [/^COROS\b/i], strip: [/^COROS\s+/i] },
  { brand: "TP-Link", patterns: [/^TP-Link\b/i], strip: [/^TP-Link\s+/i] },
  { brand: "Roborock", patterns: [/^Roborock\b/i], strip: [/^Roborock\s+/i] },
  { brand: "Insta360", patterns: [/^Insta360\b/i], strip: [/^Insta360\s+/i] },
  { brand: "DJI", patterns: [/^DJI\b/i], strip: [/^DJI\s+/i] },
  { brand: "GoPro", patterns: [/^GoPro\b/i], strip: [/^GoPro\s+/i] },
  {
    brand: "SwitchBot",
    patterns: [/^SwitchBot\b/i],
    strip: [/^SwitchBot\s+/i],
  },
  { brand: "Kobo", patterns: [/^Kobo\b/i], strip: [/^Kobo\s+/i] },
  { brand: "Jackery", patterns: [/^Jackery\b/i], strip: [/^Jackery\s+/i] },
  { brand: "象印", patterns: [/^象印/], strip: [/^象印\s*/] },
  { brand: "ダイニチ", patterns: [/^ダイニチ/], strip: [/^ダイニチ\s*/] },
  { brand: "シャープ", patterns: [/^シャープ/], strip: [/^シャープ\s*/] },
  { brand: "ニコン", patterns: [/^ニコン/], strip: [/^ニコン\s*/] },
  {
    brand: "フィリップス",
    patterns: [/^フィリップス/],
    strip: [/^フィリップス\s*/],
  },
  {
    brand: "富士フイルム",
    patterns: [/^富士フイルム/],
    strip: [/^富士フイルム\s*/],
  },
  { brand: "ケルヒャー", patterns: [/^ケルヒャー/], strip: [/^ケルヒャー\s*/] },
];

/** 表示名からブランドとライン（ブランド表記を除いた表示名）を導出する。 */
export function deriveBrandLine(name) {
  for (const rule of BRAND_RULES) {
    if (!rule.patterns.some((pattern) => pattern.test(name))) continue;
    let line = name;
    for (const strip of rule.strip) {
      if (strip.test(line)) {
        line = line.replace(strip, "").trim();
        break;
      }
    }
    return { brand: rule.brand, line: line || name };
  }
  return null;
}

/** 記事seedのソーステキストからトップレベルの文字列フィールドを読む。 */
function seedString(source, key) {
  const match = source.match(
    new RegExp(`\\n\\s+${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`),
  );
  return match ? match[1] : null;
}

/** 記事seedのソーステキストから officialSources の先頭URLを読む。 */
function seedFirstOfficialUrl(source) {
  const index = source.indexOf("officialSources: [");
  if (index === -1) return null;
  const slice = source.slice(index, index + 4000);
  return /url:\s*"([^"]+)"/.exec(slice)?.[1] ?? null;
}

/** Amazon商品URLからASINを取り出す（見つからなければ null）。 */
export function asinOf(url) {
  if (!url) return null;
  return /(B[0-9A-Z]{9})/.exec(url)?.[1] ?? null;
}

/** 実効的な販売先状態（商品ごとの指定 > 販売先全体 > 記事全体）。 */
function effectiveStatus(sideStatus, sellerStatus, articleStatus) {
  return sideStatus ?? sellerStatus ?? articleStatus ?? null;
}

/**
 * 記事seedのソーステキスト1本から、左右の商品スロットを抽出する。
 * published 53 は1ファイル1seedなので、ファイル全体を対象にする。
 */
export function parseSeedSource(source, articleId) {
  const side = {};
  for (const key of ["left", "right"]) {
    side[key] = {
      name: seedString(source, `${key}Product`),
      amazonUrl: seedString(source, `${key}AmazonUrl`),
      amazonAsin: asinOf(seedString(source, `${key}AmazonUrl`)),
      amazonStatus: effectiveStatus(
        seedString(source, `${key}AmazonLinkStatus`),
        seedString(source, "amazonLinkStatus"),
        seedString(source, "purchaseLinkStatus"),
      ),
      rakutenUrl: seedString(source, `${key}RakutenUrl`),
      rakutenStatus: effectiveStatus(
        seedString(source, `${key}RakutenLinkStatus`),
        seedString(source, "rakutenLinkStatus"),
        seedString(source, "purchaseLinkStatus"),
      ),
      image: seedString(source, `${key}Image`),
      officialUrl: seedFirstOfficialUrl(source),
    };
  }
  return {
    articleId,
    publishedAt: seedString(source, "publishedAt"),
    purchaseLinksCheckedAt: seedString(source, "purchaseLinksCheckedAt"),
    productInfoCheckedAt: seedString(source, "productInfoCheckedAt"),
    handoffManifestId: seedString(source, "handoffManifestId"),
    sides: side,
  };
}

/** handoff台帳を id と articleId の両方で引ける索引にする。 */
export function loadHandoffs(root) {
  const dir = path.join(root, HANDOFF_DIR);
  const byId = new Map();
  const byArticle = new Map();
  if (!fs.existsSync(dir)) return { byId, byArticle };
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
    if (data.id) byId.set(data.id, data);
    if (data.articleId) byArticle.set(data.articleId, data);
  }
  return { byId, byArticle };
}

/**
 * 公開53スラッグの全商品スロットを集める。
 * handoffの model / officialUrl を補完し、スロット単位で返す。
 */
export function collectSlots(root = process.cwd()) {
  const dir = path.join(root, ARTICLES_DIR);
  const handoffs = loadHandoffs(root);
  /** articleId → ソーステキスト */
  const sourceByArticle = new Map();
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".ts")) continue;
    const source = fs.readFileSync(path.join(dir, file), "utf8");
    for (const match of source.matchAll(/\bid:\s*"([^"]+)"/g)) {
      if (!sourceByArticle.has(match[1])) sourceByArticle.set(match[1], source);
    }
  }

  const slots = [];
  for (const articleId of PUBLISHED_ARTICLE_PAGE_SLUGS) {
    const source = sourceByArticle.get(articleId);
    if (!source) continue;
    const parsed = parseSeedSource(source, articleId);
    const handoff =
      (parsed.handoffManifestId &&
        handoffs.byId.get(parsed.handoffManifestId)) ||
      handoffs.byArticle.get(articleId) ||
      null;
    for (const key of ["left", "right"]) {
      const slot = parsed.sides[key];
      const product = handoff?.products?.[key] ?? null;
      slots.push({
        articleId,
        side: key,
        publishedAt: parsed.publishedAt,
        purchaseLinksCheckedAt: parsed.purchaseLinksCheckedAt,
        productInfoCheckedAt: parsed.productInfoCheckedAt,
        ...slot,
        model: product?.model ?? null,
        officialUrl: product?.officialUrl ?? slot.officialUrl,
      });
    }
  }
  return slots;
}

/** スロットの識別キー。ASIN > model > name の優先で、共有キーを union する。 */
function groupSlots(slots) {
  const parent = new Map();
  const find = (x) => {
    let root = x;
    while (parent.get(root) !== root) root = parent.get(root);
    while (parent.get(x) !== root) {
      const next = parent.get(x);
      parent.set(x, root);
      x = next;
    }
    return root;
  };
  const union = (a, b) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(ra, rb);
  };
  for (const slot of slots) parent.set(slot.slotId, slot.slotId);
  const maps = { asin: new Map(), model: new Map(), name: new Map() };
  for (const slot of slots) {
    for (const [field, value] of [
      ["asin", slot.amazonAsin],
      ["model", slot.model],
      ["name", slot.name],
    ]) {
      if (!value) continue;
      if (maps[field].has(value)) union(slot.slotId, maps[field].get(value));
      else maps[field].set(value, slot.slotId);
    }
  }
  const groups = new Map();
  for (const slot of slots) {
    const root = find(slot.slotId);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(slot);
  }
  return [...groups.values()];
}

const min = (values, fallback = null) =>
  values.filter(Boolean).sort()[0] ?? fallback;

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function hashId(value) {
  return crypto.createHash("sha1").update(value).digest("hex").slice(0, 12);
}

/** 組（コンポーネント）から商品IDを決める。ASIN > model > name。 */
export function productIdFor(members) {
  const asin = min(members.map((member) => member.amazonAsin));
  if (asin) return `amazon-${asin.toLowerCase()}`;
  const model = min(members.map((member) => member.model));
  if (model && slugify(model)) return `model-${slugify(model)}`;
  return `name-${hashId(min(members.map((member) => member.name)) ?? "")}`;
}

/**
 * 商品1件を組から組み立てる。販売先の状態・URLが記事間で割れる場合は conflict を返す
 * （overrides.json で人が採用値を決める）。
 * @returns {{ product: object, conflicts: { seller: string, message: string }[] }}
 */
export function buildProductFromMembers(members) {
  const id = productIdFor(members);
  const conflicts = [];
  const unique = (values) => [...new Set(values.filter(Boolean))].sort();
  const name = min(members.map((member) => member.name));
  const derived = deriveBrandLine(name);
  const product = {
    id,
    brand: derived?.brand ?? null,
    line: derived?.line ?? name,
    model: min(members.map((member) => member.model)) ?? undefined,
    name,
    image: min(members.map((member) => member.image)) ?? undefined,
    officialUrl: min(members.map((member) => member.officialUrl)) ?? undefined,
    sellers: {},
    checkedAt:
      min(members.map((member) => member.productInfoCheckedAt)) ??
      min(members.map((member) => member.purchaseLinksCheckedAt)) ??
      min(members.map((member) => member.publishedAt)),
  };

  // Amazon販売先
  const amazonStates = unique(members.map((member) => member.amazonStatus));
  if (amazonStates.length > 1) {
    conflicts.push({
      seller: "amazon",
      message: `${id}: amazon state differs across articles: ${amazonStates.join(", ")}`,
    });
  } else if (amazonStates[0] === "search") {
    product.sellers.amazon = { state: "search", query: name };
  } else if (amazonStates[0] === "verified" || amazonStates[0] === "direct") {
    const urls = unique(members.map((member) => member.amazonUrl));
    if (urls.length > 1) {
      conflicts.push({
        seller: "amazon",
        message: `${id}: amazon url differs across articles: ${urls.join(", ")}`,
      });
    } else if (urls.length === 1) {
      product.sellers.amazon = {
        state: amazonStates[0],
        url: urls[0],
        checkedAt:
          min(members.map((member) => member.purchaseLinksCheckedAt)) ??
          product.checkedAt,
      };
    }
  } else if (amazonStates[0] === "unavailable") {
    product.sellers.amazon = { state: "unavailable" };
  }

  // 楽天販売先（seedに記録されたURLのみ。APIで実行時解決する分は Phase 2）
  const rakutenUrls = unique(
    members
      .filter((member) => ["verified", "direct"].includes(member.rakutenStatus))
      .map((member) => member.rakutenUrl),
  );
  if (rakutenUrls.length > 1) {
    conflicts.push({
      seller: "rakuten",
      message: `${id}: rakuten url differs across articles: ${rakutenUrls.join(", ")}`,
    });
  } else if (rakutenUrls.length === 1) {
    product.sellers.rakuten = {
      state:
        members.find((member) => member.rakutenUrl === rakutenUrls[0])
          ?.rakutenStatus ?? "verified",
      url: rakutenUrls[0],
      checkedAt:
        min(members.map((member) => member.purchaseLinksCheckedAt)) ??
        product.checkedAt,
    };
  } else if (members.some((member) => member.rakutenStatus === "unavailable")) {
    product.sellers.rakuten = { state: "unavailable" };
  }

  return { product, conflicts };
}

/** overrides.json を読み込む（無ければ空）。 */
export function loadOverrides(root = process.cwd()) {
  const file = path.join(root, OVERRIDES_PATH);
  if (!fs.existsSync(file)) return { products: {} };
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

/** overrides.json の商品ごとに許可するキー。タイポを黙って商品へ混ぜないため。 */
export const ALLOWED_OVERRIDE_KEYS = new Set([
  "brand",
  "line",
  "model",
  "name",
  "image",
  "officialUrl",
  "checkedAt",
  "sellers",
]);

/**
 * overrides を商品へマージする（sellers はキー単位）。`_note` は記録用に無視する。
 * @returns {{ product: object, errors: string[] }}
 */
export function applyOverride(product, override) {
  const errors = [];
  const next = { ...product };
  for (const [key, value] of Object.entries(override)) {
    if (key === "_note") continue;
    if (key === "sellers") {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        errors.push(`${product.id}: override sellers must be an object`);
        continue;
      }
      next.sellers = { ...next.sellers, ...value };
      continue;
    }
    if (!ALLOWED_OVERRIDE_KEYS.has(key)) {
      errors.push(`${product.id}: unknown override key ${JSON.stringify(key)}`);
      continue;
    }
    next[key] = value;
  }
  return { product: next, errors };
}

/**
 * 商品マスタを組み立てる。
 * @returns {{ master: object, errors: string[] }}
 */
export function buildProductMaster({ root = process.cwd() } = {}) {
  const slots = collectSlots(root).map((slot, index) => ({
    ...slot,
    slotId: `${slot.articleId}:${slot.side}:${index}`,
  }));
  const overrides = loadOverrides(root);
  const errors = [];
  const products = [];
  const unusedOverrides = new Set(Object.keys(overrides.products ?? {}));

  for (const members of groupSlots(slots)) {
    const built = buildProductFromMembers(members);
    let product = built.product;
    const override = overrides.products?.[product.id];
    if (override) {
      unusedOverrides.delete(product.id);
      const applied = applyOverride(product, override);
      product = applied.product;
      errors.push(...applied.errors);
    }
    for (const conflict of built.conflicts) {
      // 人が overrides.json で当該販売先を確定した場合だけ解消する。
      if (override?.sellers?.[conflict.seller] === undefined) {
        errors.push(conflict.message);
      }
    }
    if (!product.brand) {
      errors.push(
        `${product.id}: brand could not be derived from name ${JSON.stringify(product.name)}`,
      );
    }
    products.push(product);
  }
  for (const id of unusedOverrides) {
    errors.push(`overrides.json: unknown product id ${JSON.stringify(id)}`);
  }
  products.sort((a, b) => a.id.localeCompare(b.id));

  const master = {
    version: 1,
    generatedFrom:
      "docs/article-data-schema-plan.md §2.1 / seed(公開53) + docs/article-handoffs",
    products,
  };
  return { master, errors };
}

/** 生成物を prettier と同形で文字列化する。 */
export function serializeMaster(master) {
  return `${JSON.stringify(master, null, 2)}\n`;
}

function main() {
  const root = process.cwd();
  const { master, errors } = buildProductMaster({ root });
  if (errors.length > 0) {
    console.error(`build-product-master: ${errors.length} problem(s)`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  const serialized = serializeMaster(master);
  const outFile = path.join(root, OUTPUT_PATH);
  if (process.argv.includes("--check")) {
    const current = fs.existsSync(outFile)
      ? fs.readFileSync(outFile, "utf8")
      : "";
    if (current !== serialized) {
      console.error(
        `build-product-master: ${OUTPUT_PATH} is stale; run "pnpm build:product-master"`,
      );
      process.exit(1);
    }
    console.log(`build-product-master: ${OUTPUT_PATH} is up to date`);
    return;
  }
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, serialized, "utf8");
  console.log(
    `build-product-master: wrote ${OUTPUT_PATH} (${master.products.length} products)`,
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main();
}
