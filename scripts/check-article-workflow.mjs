import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manualPath = path.join(root, "docs", "chatgpt-article-handoff-manual.md");
const manual = fs.existsSync(manualPath)
  ? fs.readFileSync(manualPath, "utf8")
  : "";

const requiredRules = [
  "ChatGPTには成果用アフィリエイトURLの取得を要求しない",
  "楽天の成果URLは、Codex側がChromeのログイン済み楽天アフィリエイト管理画面",
  "`articleReady` は、記事に表示する購入ボタン用のURLと、掲載するSNSの実埋め込みが揃った時点でCodex側が判定する",
  "毎回、商品選定から始める完全新規の依頼を送る",
  "上部に枠付きの見出し「目次」と番号付きの`<ol>`",
  "本文の順番は「結論 → 主な比較ポイント → よくある質問 → 購入先 → SNSでの感想 → 更新履歴・情報源」",
  "採用投稿を載せる場合は、X・YouTube・Redditの実埋め込みを少なくとも1件",
  "埋め込みが1件もない場合はSNS見出し・検索リンク・直接リンクを表示しない",
  "CTA横の「（広告）」、動画前の「外部コンテンツの表示」",
];
const forbiddenRules = [
  "必要な場合はユーザーが生成して後から渡す",
  "楽天の完全な成果URLはログイン済みの本人だけが生成できるため",
];
const errors = [];

const sourceRules = [
  [
    "src/components/ExternalEmbed.astro",
    ":global(.external-embed__target iframe)",
  ],
  ["src/components/ExternalEmbed.astro", "aspect-ratio: 16 / 9"],
  ["src/components/ExternalEmbed.astro", "data-server-embed"],
  ["src/components/ExternalEmbed.astro", "serverRenderYoutube"],
  ["src/lib/external-embeds.ts", "https://www.youtube.com/embed/"],
  ["src/components/CommercialArticlePage.astro", 'id="purchase"'],
];

if (!manual) errors.push("article workflow manual is missing");
for (const rule of requiredRules) {
  if (!manual.includes(rule)) {
    errors.push(`manual is missing required rule: ${rule}`);
  }
}
for (const rule of forbiddenRules) {
  if (manual.includes(rule)) {
    errors.push(`manual contains obsolete rule: ${rule}`);
  }
}
for (const [relativePath, rule] of sourceRules) {
  const sourcePath = path.join(root, relativePath);
  const source = fs.existsSync(sourcePath)
    ? fs.readFileSync(sourcePath, "utf8")
    : "";
  if (!source.includes(rule)) {
    errors.push(
      `current template is missing required implementation: ${relativePath} -> ${rule}`,
    );
  }
}

const embedSource = fs.existsSync(
  path.join(root, "src/components/ExternalEmbed.astro"),
)
  ? fs.readFileSync(
      path.join(root, "src/components/ExternalEmbed.astro"),
      "utf8",
    )
  : "";
if (
  embedSource.includes("data-external-embed-stop") ||
  embedSource.includes("external-embed__privacy")
) {
  errors.push(
    "current embed template still contains removed privacy/opt-out UI",
  );
}
for (const relativePath of [
  "src/components/AffiliateButton.astro",
  "src/components/NextStepBlock.astro",
]) {
  const sourcePath = path.join(root, relativePath);
  const source = fs.existsSync(sourcePath)
    ? fs.readFileSync(sourcePath, "utf8")
    : "";
  if (source.includes("ad-note") || source.includes("（広告）")) {
    errors.push(
      `current CTA template still contains removed ad label: ${relativePath}`,
    );
  }
}

if (errors.length) {
  console.error("Article workflow policy check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Article workflow policy check passed.");
console.log("- Start every run with fresh product selection.");
console.log(
  "- ChatGPT researches; Codex validates, uses Chrome Rakuten link creation, and builds the article.",
);
