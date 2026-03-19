// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://www.mkoppmann.at",
  output: "static",
  trailingSlash: "ignore",
  security: { csp: true },
  compressHTML: false,
});
