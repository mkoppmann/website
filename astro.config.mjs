// @ts-check
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://www.mkoppmann.at",
  output: "static",
  trailingSlash: "always",
  security: { csp: true },
  compressHTML: false,
  integrations: [sitemap()],
});