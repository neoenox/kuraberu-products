import { defineConfig } from "astro/config";
import { validateBuildEnvironment } from "./config/runtime-env.mjs";

validateBuildEnvironment(process.env);

export default defineConfig({
  output: "static",
  // Production CSP permits same-origin scripts, not executable inline scripts.
  vite: {
    build: {
      assetsInlineLimit: (path) => (path.endsWith(".js") ? false : undefined),
    },
  },
  image: {
    service: { entrypoint: "astro/assets/services/sharp" },
  },
});
