#!/usr/bin/env node
/** Derive the published backlog table from the publication allowlist (#1068). */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PUBLISHED_ARTICLE_PAGE_SLUGS } from "../config/article-template-policy.mjs";

const BACKLOG = fileURLToPath(
  new URL("../docs/article-backlog.md", import.meta.url),
);

export function publishedTable(slugs) {
  const sorted = [...new Set(slugs)].sort();
  const tick = String.fromCharCode(96);
  const labels = sorted.map((slug) => tick + slug + tick);
  const width = Math.max(4, ...labels.map((label) => label.length));
  return [
    "| " + "slug".padEnd(width) + " | 状態     |",
    "| " + "-".repeat(width) + " | -------- |",
    ...labels.map((label) => "| " + label.padEnd(width) + " | 公開済み |"),
  ].join("\n");
}

export function updatePublishedBacklog(markdown, slugs) {
  const sectionStart = markdown.indexOf("## 現在の公開済み（");
  const nextSection = markdown.indexOf(
    "\n## 公開されていない記事",
    sectionStart,
  );
  if (sectionStart < 0 || nextSection < 0) {
    throw new Error("Published backlog section boundaries not found");
  }
  const oldSection = markdown.slice(sectionStart, nextSection);
  const heading = /^## 現在の公開済み（\d+本）$/m;
  const table =
    /^\| slug[^\n]*\|\n\| [-]+\s+\| [-]+\s+\|\n(?:\| \x60[^\n]+\|\n)+/m;
  if (!heading.test(oldSection) || !table.test(oldSection)) {
    throw new Error("Published backlog heading or table missing");
  }
  const section = oldSection
    .replace(heading, "## 現在の公開済み（" + new Set(slugs).size + "本）")
    .replace(table, publishedTable(slugs) + "\n");
  const previous = markdown.slice(0, sectionStart);
  const remainder = markdown.slice(nextSection);
  return previous + section + remainder;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const original = readFileSync(BACKLOG, "utf8");
  const slugs = PUBLISHED_ARTICLE_PAGE_SLUGS;
  const updated = updatePublishedBacklog(original, slugs);
  if (process.argv.includes("--write")) {
    writeFileSync(BACKLOG, updated);
    console.log("Published backlog table regenerated.");
  } else if (updated !== original) {
    console.error(
      "Published backlog table drift: run pnpm check:backlog-publication -- --write",
    );
    process.exitCode = 1;
  } else {
    console.log("Published backlog table: up to date.");
  }
}
