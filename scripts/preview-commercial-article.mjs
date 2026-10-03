import { spawn, spawnSync } from "node:child_process";

const affiliateTagVariable = "PUBLIC_AMAZON_ASSOCIATE_TAG";
const pnpmCommand = "pnpm";

function parseArguments(args) {
  let checkOnly = false;
  let port = 4321;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    // pnpm は `pnpm article:preview -- --check-only` の `--` をそのまま渡す。
    if (argument === "--") continue;
    if (argument === "--check-only") {
      checkOnly = true;
      continue;
    }
    if (argument === "--port") {
      const value = args[index + 1];
      if (!/^\d+$/.test(value ?? "")) {
        throw new Error("--port requires a number from 1 to 65535");
      }
      port = Number(value);
      if (port < 1 || port > 65535) {
        throw new Error("--port requires a number from 1 to 65535");
      }
      index += 1;
      continue;
    }
    throw new Error(`Unknown option: ${argument}`);
  }

  return { checkOnly, port };
}

function getProductionAffiliateTag() {
  const result = spawnSync(
    "gh",
    ["variable", "get", affiliateTagVariable, "--env", "production"],
    {
      encoding: "utf8",
      shell: process.platform === "win32",
      stdio: ["ignore", "pipe", "ignore"],
      windowsHide: true,
    },
  );

  if (result.error || result.status !== 0) {
    throw new Error(
      "Could not read the GitHub production variable. Sign in with GitHub CLI and confirm access to this repository's production environment.",
    );
  }

  const tag = result.stdout.trim();
  if (!tag || /\s/.test(tag)) {
    throw new Error(
      "The GitHub production variable is empty or has an invalid format; no build was started.",
    );
  }

  return tag;
}

function runPnpm(args, env = process.env) {
  const result = spawnSync(pnpmCommand, args, {
    cwd: process.cwd(),
    env,
    shell: process.platform === "win32",
    stdio: "inherit",
    windowsHide: true,
  });

  if (result.error) {
    console.error(
      "Could not start pnpm. Confirm pnpm is installed and available on PATH.",
    );
    return 1;
  }
  return result.status ?? 1;
}

function startPreview(port) {
  const previewEnv = { ...process.env };
  delete previewEnv[affiliateTagVariable];

  console.log(`Starting the local preview at http://127.0.0.1:${port}/`);
  const child = spawn(
    pnpmCommand,
    ["preview", "--host", "127.0.0.1", "--port", String(port)],
    {
      cwd: process.cwd(),
      env: previewEnv,
      shell: process.platform === "win32",
      stdio: "inherit",
      windowsHide: true,
    },
  );

  child.on("error", () => {
    console.error(
      "Could not start the local preview. Confirm pnpm is available on PATH.",
    );
    process.exitCode = 1;
  });
  child.on("close", (code) => {
    process.exitCode = code ?? 1;
  });
}

let options;
try {
  options = parseArguments(process.argv.slice(2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 2;
}

if (options) {
  let affiliateTag;
  try {
    affiliateTag = getProductionAffiliateTag();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }

  if (affiliateTag) {
    const buildEnv = {
      ...process.env,
      [affiliateTagVariable]: affiliateTag,
    };

    console.log(
      "Building the article preview with the GitHub production tag (value hidden).",
    );
    const buildStatus = runPnpm(["build"], buildEnv);
    if (buildStatus !== 0) {
      process.exitCode = buildStatus;
    } else {
      console.log("Checking rendered purchase buttons and destinations.");
      const checkStatus = runPnpm(["check:rendered"]);
      if (checkStatus !== 0) {
        process.exitCode = checkStatus;
      } else if (options.checkOnly) {
        console.log("Article preview build and purchase-link checks passed.");
      } else {
        startPreview(options.port);
      }
    }
  }
}
