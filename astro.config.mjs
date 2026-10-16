// @ts-check
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";
import { satteri } from "@astrojs/markdown-satteri";
import footnotes from "./src/plugins/footnotes.ts";

// https://astro.build/config
export default defineConfig({
  site: "https://www.mkoppmann.at",
  output: "static",
  trailingSlash: "always",
  security: { csp: true },
  integrations: [sitemap(), mdx()],
  markdown: {
    syntaxHighlight: "prism",
    processor: satteri({ hastPlugins: [footnotes] }),
  },
});
