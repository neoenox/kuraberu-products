import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { isPublishedArticlePath } from "../config/article-template-policy.mjs";

// Referenced local product images must exist as files. Scope is limited to
// paths browsers actually fetch:
//
// - article.imagePath values, rendered as raw <img> by discovery cards
//   (client createCard has no fail-closed resolver). Computed exactly like
//   create.ts: images.ts left ?? right ?? seed leftImage ?? rightImage.
// - <img>/<source>/<link>/<script> src|href|srcset in built HTML.
//
// Deliberately excluded: og:image / twitter:image / JSON-LD (crawler-only;
// browsers do not fetch them) and vendor URLs / glob patterns.
// No network access.
export const PRODUCTS_PREFIX = "/products/";

function walkFiles(directory, extensions, files = []) {
  let entries;
  try {
    entries = fs.readdirSync(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return files;
    throw error;
  }
  for (const entry of entries) {
    if (entry.name === "node_modules") continue;
    const current = path.join(directory, entry.name);
    if (entry.isDirectory()) walkFiles(current, extensions, files);
    else if (extensions.some((ext) => entry.name.endsWith(ext)))
      files.push(current);
  }
  return files;
}

/**
 * Normalize a "/products/..." reference: strip query/hash, URL-decode.
 * Returns the file name or null when external, out of scope, or unsafe.
 */
export function normalizeProductRef(ref) {
  if (typeof ref !== "string") return null;
  if (/^(https?:|data:)/i.test(ref)) return null;
  const bare = ref.split(/[?#]/, 1)[0];
  if (!bare.startsWith(PRODUCTS_PREFIX)) return null;
  let decoded = bare;
  try {
    decoded = decodeURIComponent(bare);
  } catch {
    return null;
  }
  const name = decoded.slice(PRODUCTS_PREFIX.length);
  if (
    !name ||
    name.includes("..") ||
    name.includes("/") ||
    name.includes("\\")
  ) {
    return null;
  }
  return name;
}

function readField(recordText, name) {
  const match = recordText.match(new RegExp(`${name}:\\s*"([^"]*)"`, ""));
  return match ? match[1] : undefined;
}

/**
 * Parse images.ts into { id: { left?, right? } }.
 */
export function parseImageMap(source) {
  const map = new Map();
  for (const block of source.matchAll(/"([^"]+)":\s*\{([^{}]*)\}/g)) {
    const [, id, body] = block;
    const left = readField(body, "left");
    const right = readField(body, "right");
    if (left || right) map.set(id, { left, right });
  }
  return map;
}

export function parseSeedImages(source) {
  const idMatch = source.match(/^\s*id:\s*"([^"]+)"/m);
  return {
    id: idMatch ? idMatch[1] : undefined,
    leftImage: readField(source, "leftImage"),
    rightImage: readField(source, "rightImage"),
    imagePath: readField(source, "imagePath"),
  };
}

/**
 * Collect the exact article.imagePath values (create.ts precedence):
 * images.ts left ?? right ?? seed leftImage ?? rightImage, plus guide
 * imagePath fields. Returns [{ file, name }].
 */
export function collectSourceRefs(
  srcDir = path.join("src"),
  { isPublished = isPublishedArticlePath } = {},
) {
  const commercialDir = path.join(srcDir, "content", "articles", "commercial");
  let imageMap = new Map();
  try {
    imageMap = parseImageMap(
      fs.readFileSync(path.join(commercialDir, "images.ts"), "utf8"),
    );
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const refs = [];
  const push = (file, value) => {
    const name = value ? normalizeProductRef(value) : null;
    if (name) refs.push({ file, name });
  };
  for (const file of walkFiles(commercialDir, [".ts"])) {
    if (path.basename(file) === "images.ts") continue;
    const source = fs.readFileSync(file, "utf8");
    const seed = parseSeedImages(source);
    // Only published articles render (same rule as the site itself).
    // Guide articles are excluded: their imagePath values go through the
    // fail-closed resolveImage() at build time, never raw <img>.
    if (!seed.id || !isPublished(`/articles/${seed.id}/`)) continue;
    const mapped = imageMap.get(seed.id);
    push(
      file,
      mapped?.left ?? mapped?.right ?? seed.leftImage ?? seed.rightImage,
    );
  }
  return refs.sort((a, b) =>
    a.name === b.name
      ? a.file.localeCompare(b.file)
      : a.name.localeCompare(b.name),
  );
}

/**
 * Collect browser-fetched /products/ refs from built HTML img/source/link/
 * script tags (meta and JSON-LD excluded: crawlers only). Returns null when
 * dist/ does not exist (caller skips).
 */
export function collectDistRefs(distDir = path.join("dist")) {
  if (!fs.existsSync(distDir)) return null;
  const refs = new Map();
  const tagPattern =
    /<(img|source|link|script)\b[^>]*(?:src|href|srcset)="([^"]*products\/[^"]*)"[^>]*>/gi;
  for (const file of walkFiles(distDir, [".html"])) {
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(tagPattern)) {
      for (const part of match[2].split(/[\s,]+/)) {
        const name = normalizeProductRef(part);
        if (name && !refs.has(name)) refs.set(name, file);
      }
    }
  }
  return [...refs].map(([name, file]) => ({ file, name }));
}

export function findMissingFiles(refs, directory) {
  return refs.filter(({ name }) => !fs.existsSync(path.join(directory, name)));
}

export function checkProductImages({
  srcDir = path.join("src"),
  publicDir = path.join("public", "products"),
  distDir = path.join("dist"),
  isPublished = isPublishedArticlePath,
} = {}) {
  const missing = [];
  const sourceRefs = collectSourceRefs(srcDir, { isPublished });
  const sourceMissing = findMissingFiles(sourceRefs, publicDir);
  for (const { file, name } of sourceMissing) {
    missing.push(
      `source: ${PRODUCTS_PREFIX}${name} (used by ${file}, missing under ${publicDir}/)`,
    );
  }
  console.log(
    `source refs ok: ${sourceRefs.length - sourceMissing.length}/${sourceRefs.length}`,
  );

  const distRefs = collectDistRefs(distDir);
  if (distRefs === null) {
    console.log(`dist check skipped (no ${distDir}/ directory)`);
  } else {
    const distMissing = findMissingFiles(
      distRefs,
      path.join(distDir, "products"),
    );
    for (const { file, name } of distMissing) {
      missing.push(
        `dist: ${PRODUCTS_PREFIX}${name} (used by ${file}, missing under ${distDir}/products/)`,
      );
    }
    console.log(
      `dist refs ok: ${distRefs.length - distMissing.length}/${distRefs.length}`,
    );
  }

  if (missing.length) {
    throw new Error(`missing product images:\n${missing.join("\n")}`);
  }
  console.log("product image existence ok");
  return { sourceRefs, distRefs };
}

const invokedPath = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href
  : undefined;
if (invokedPath === import.meta.url) {
  checkProductImages();
}
