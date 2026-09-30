#!/usr/bin/env node
// クリック計測（ANALYTICS_KV）の集計。ローカルの wrangler（ログイン済み）で KV を読み取り専用で読む。
//
// 使い方:
//   pnpm report:analytics                 # 直近7日
//   pnpm report:analytics -- --days 30
//   pnpm report:analytics -- --namespace-id <id>
//
// 出力: 日別のページ表示・購入クリック・クリック率、流入元別、配置別、商品別、ページ別。
// 保存されている値は、イベント名・商品ID・配置・リンク種別・パス・流入元（src/ref）・時刻だけ
// （docs/click-analytics.md）。個人を識別する値は、そもそも保存していない。

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const DEFAULT_NAMESPACE_ID = "96b93901d4d3455aa3f0823a57f8b6c0";
const CTA_EVENTS = new Set(["purchase"]);

function parseArgs(argv) {
  const args = {
    days: 7,
    namespaceId: process.env.ANALYTICS_KV_NAMESPACE_ID ?? DEFAULT_NAMESPACE_ID,
  };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--days") args.days = Number(argv[++i]);
    else if (argv[i] === "--namespace-id") args.namespaceId = argv[++i];
    else if (argv[i] === "--help" || argv[i] === "-h") args.help = true;
  }
  if (!Number.isInteger(args.days) || args.days < 1 || args.days > 90) {
    throw new Error(
      "--days は 1〜90 の整数で指定してください（保存期間は最大90日）",
    );
  }
  return args;
}

const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
function wrangler(argv) {
  return execFileSync(pnpm, ["exec", "wrangler", ...argv], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 64 * 1024 * 1024,
    shell: process.platform === "win32",
  });
}

function lastJson(text) {
  const start = text.search(/[[{]/);
  if (start < 0) return undefined;
  return JSON.parse(text.slice(start));
}

function daysBack(count) {
  const days = [];
  for (let i = 0; i < count; i += 1) {
    days.push(new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10));
  }
  return days.reverse();
}

function listKeys(namespaceId, day) {
  const out = wrangler([
    "kv",
    "key",
    "list",
    "--namespace-id",
    namespaceId,
    "--prefix",
    `v1:events:${day}:`,
    "--remote",
  ]);
  return (lastJson(out) ?? []).map((entry) => entry.name);
}

function getValues(namespaceId, keys) {
  const values = [];
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "kv-report-"));
  try {
    for (let i = 0; i < keys.length; i += 100) {
      const file = path.join(dir, `keys-${i}.json`);
      fs.writeFileSync(file, JSON.stringify(keys.slice(i, i + 100)));
      const out = wrangler([
        "kv",
        "bulk",
        "get",
        file,
        "--namespace-id",
        namespaceId,
        "--remote",
      ]);
      const parsed = lastJson(out) ?? {};
      for (const raw of Object.values(parsed)) {
        try {
          values.push(typeof raw === "string" ? JSON.parse(raw) : raw);
        } catch {
          // 壊れた値は数えない
        }
      }
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  return values;
}

function count(map, key) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function table(title, map, limit = 10) {
  const rows = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
  console.log(`\n■ ${title}`);
  if (rows.length === 0) console.log("  （データなし）");
  for (const [key, value] of rows)
    console.log(`  ${String(value).padStart(5)}  ${key}`);
}

const pct = (a, b) => (b === 0 ? "-" : `${((a / b) * 100).toFixed(1)}%`);

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log("pnpm report:analytics [-- --days N] [-- --namespace-id ID]");
    return;
  }
  const days = daysBack(args.days);
  const events = [];
  for (const day of days) {
    const keys = listKeys(args.namespaceId, day);
    if (keys.length > 0) events.push(...getValues(args.namespaceId, keys));
  }

  const views = events.filter((e) => e.event === "page_view");
  const clicks = events.filter((e) => CTA_EVENTS.has(e.event));
  console.log(
    `集計期間: ${days[0]} 〜 ${days[days.length - 1]}（${args.days}日）  KV: ${args.namespaceId}`,
  );
  console.log(`イベント総数: ${events.length}`);
  console.log(
    `ページ表示: ${views.length}  購入ボタンのクリック: ${clicks.length}  クリック率: ${pct(clicks.length, views.length)}`,
  );

  const byDay = new Map();
  for (const day of days) byDay.set(day, { views: 0, clicks: 0 });
  for (const e of events) {
    const day = String(e.at ?? "").slice(0, 10);
    const row = byDay.get(day);
    if (!row) continue;
    if (e.event === "page_view") row.views += 1;
    else if (CTA_EVENTS.has(e.event)) row.clicks += 1;
  }
  console.log("\n■ 日別（表示 / クリック / クリック率）");
  for (const [day, row] of byDay) {
    console.log(
      `  ${day}  ${String(row.views).padStart(5)}  ${String(row.clicks).padStart(5)}  ${pct(row.clicks, row.views)}`,
    );
  }

  const bySrcViews = new Map();
  const bySrcClicks = new Map();
  for (const e of views)
    count(bySrcViews, e.src || (e.ref ? `ref:${e.ref}` : "direct/unknown"));
  for (const e of clicks)
    count(bySrcClicks, e.src || (e.ref ? `ref:${e.ref}` : "direct/unknown"));
  table("流入元別のページ表示", bySrcViews);
  table("流入元別の購入クリック", bySrcClicks);
  table(
    "配置別の購入クリック",
    (() => {
      const m = new Map();
      for (const e of clicks) count(m, e.placement || "-");
      return m;
    })(),
  );
  table(
    "リンク種別別の購入クリック",
    (() => {
      const m = new Map();
      for (const e of clicks) count(m, e.linkType || "-");
      return m;
    })(),
  );
  table(
    "商品別の購入クリック",
    (() => {
      const m = new Map();
      for (const e of clicks) count(m, e.productId || "(商品ID なし)");
      return m;
    })(),
  );
  table(
    "ページ別の表示",
    (() => {
      const m = new Map();
      for (const e of views) count(m, e.path || "-");
      return m;
    })(),
  );
  table(
    "ページ別の購入クリック",
    (() => {
      const m = new Map();
      for (const e of clicks) count(m, e.path || "-");
      return m;
    })(),
  );
  console.log(
    "\n※ 注文（購入）は、楽天アフィリエイトと Amazon アソシエイトの管理画面のレポートで確認します。",
  );
}

try {
  main();
} catch (error) {
  console.error(
    "集計に失敗しました:",
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
}
