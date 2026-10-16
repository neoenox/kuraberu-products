import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  VERIFY_COMBINED,
  VERIFY_SCRIPTS,
  allSteps,
  buildCommand,
} from "../config/verification-manifest.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** pnpm 本体のサブコマンド。package.json の script と紛らわしいので除外する。 */
export const PNPM_BUILTINS = new Set([
  "install",
  "i",
  "add",
  "remove",
  "rm",
  "update",
  "up",
  "why",
  "audit",
  "outdated",
  "fetch",
  "patch",
  "publish",
  "link",
  "unlink",
  "import",
  "init",
  "setup",
  "store",
  "licenses",
  "list",
  "ls",
  "run",
  "root",
  "bin",
  "config",
  "doctor",
  "help",
  "exec",
  "dlx",
  "node",
  "pm",
  "self-update",
  "dedupe",
  "prune",
  "start",
]);

export const DOC_FILES = ["README.md", "AGENTS.md", "CONTRIBUTING.md"];

/** package.json の verify 系 script がマニフェストと一致するか比較する。 */
export function compareVerifyScripts(scripts) {
  const mismatches = [];
  for (const [name, steps] of Object.entries(VERIFY_SCRIPTS)) {
    const expected = buildCommand(steps);
    const actual = scripts[name];
    if (actual !== expected) {
      mismatches.push({ name, expected, actual });
    }
  }
  if (scripts.verify !== VERIFY_COMBINED) {
    mismatches.push({
      name: "verify",
      expected: VERIFY_COMBINED,
      actual: scripts.verify,
    });
  }
  return mismatches;
}

/** マニフェストが参照する scripts/*.mjs が実在するか確認し、欠落を返す。 */
export function missingScriptFiles(steps) {
  const missing = [];
  for (const step of steps) {
    const match = step.match(/scripts\/[\w.-]+\.mjs/);
    if (match && !existsSync(path.join(root, match[0]))) {
      missing.push(match[0]);
    }
  }
  return missing;
}

/** ドキュメント中の `pnpm <name>` 参照のうち、script にも builtin にも無いものを返す。 */
export function unknownDocScripts(texts, scripts) {
  const unknown = new Set();
  for (const text of texts) {
    for (const match of text.matchAll(/\bpnpm\s+(?!-)([a-z][\w:-]*)/g)) {
      const name = match[1];
      if (!(name in scripts) && !PNPM_BUILTINS.has(name)) {
        unknown.add(name);
      }
    }
  }
  return [...unknown];
}

function main() {
  const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
  const problems = [];

  for (const { name, expected, actual } of compareVerifyScripts(pkg.scripts)) {
    problems.push(
      `package.json "${name}" does not match the manifest.\n  expected: ${expected}\n  actual:   ${actual ?? "(missing)"}`,
    );
  }

  for (const file of missingScriptFiles(allSteps())) {
    problems.push(`manifest references a missing file: ${file}`);
  }

  const docs = DOC_FILES.map((file) => ({
    file,
    text: existsSync(path.join(root, file))
      ? readFileSync(path.join(root, file), "utf8")
      : "",
  }));
  for (const name of unknownDocScripts(
    docs.map((d) => d.text),
    pkg.scripts,
  )) {
    problems.push(
      `documentation references "pnpm ${name}" which is not a package.json script`,
    );
  }

  if (problems.length > 0) {
    console.error(`check-verification-manifest: ${problems.length} problem(s)`);
    for (const problem of problems) console.error(`- ${problem}`);
    process.exit(1);
  }
  console.log(
    "check-verification-manifest: package.json / CI / docs match the manifest",
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main();
}
