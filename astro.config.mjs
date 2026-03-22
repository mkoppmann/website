// @ts-check
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://www.mkoppmann.at",
  output: "static",
  trailingSlash: "always",
  security: { csp: true },
  integrations: [sitemap(), mdx()],
  markdown: {
    syntaxHighlight: "prism",
  },
});