/**
 * scripts/generate-ogp-top.mjs
 *
 * トップページ用 OGP 画像（public/ogp-top.png、1200x630）を生成する。
 * ブランド色（--ink #1a2f23 / アクセント #e87a67 / --sage #e1e8e2）に合わせた
 * 静的 SVG を sharp で PNG 化する。記事画像と違い、再生成はこのスクリプト経由で行う。
 *
 * 使用方法: node scripts/generate-ogp-top.mjs
 */
import { fileURLToPath } from "node:url";
import { Buffer } from "node:buffer";
import path from "node:path";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;
const FONT =
  "'Yu Gothic','Hiragino Kaku Gothic ProN',Meiryo,'Noto Sans JP',sans-serif";

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#1a2f23"/>
  <rect x="0" y="0" width="28" height="${HEIGHT}" fill="#e87a67"/>
  <g opacity="0.16">
    <rect x="880" y="120" width="260" height="340" rx="24" fill="none" stroke="#e1e8e2" stroke-width="10"/>
    <rect x="830" y="170" width="260" height="340" rx="24" fill="none" stroke="#e87a67" stroke-width="10"/>
  </g>
  <text x="96" y="252" font-family="${FONT}" font-size="104" font-weight="700" fill="#ffffff" letter-spacing="2">くらべる商品メモ</text>
  <text x="100" y="360" font-family="${FONT}" font-size="56" font-weight="700" fill="#e1e8e2">家電・日用品の2商品比較</text>
  <text x="100" y="440" font-family="${FONT}" font-size="36" fill="#e5e1d8">メーカー公式情報中心に「どっち向き？」を整理</text>
  <rect x="100" y="492" width="180" height="12" rx="6" fill="#e87a67"/>
</svg>`;

const outPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "ogp-top.png",
);

const info = await sharp(Buffer.from(svg, "utf8"))
  .png({ compressionLevel: 9 })
  .toFile(outPath);
const meta = await sharp(outPath).metadata();
console.log(
  `generate-ogp-top: OK — ${outPath} (${meta.width}x${meta.height}, ${info.size} bytes)`,
);
if (meta.width !== WIDTH || meta.height !== HEIGHT) {
  console.error(
    `generate-ogp-top: FAIL — 期待サイズは ${WIDTH}x${HEIGHT} です`,
  );
  process.exit(1);
}
