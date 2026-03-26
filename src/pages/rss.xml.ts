import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { APIContext } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { getCollection, render } from "astro:content";
import { publications } from "../data/publications";
import { talks } from "../data/talks";
import { transform, walk } from "ultrahtml";
import sanitize from "ultrahtml/transformers/sanitize";

const feedAuthor = "me+www@mkoppmann.at (Michael Koppmann)";
const feedTitle = "mkoppmann’s mneme";
const feedDescription = "My thoughts and understandings on our world.";
const feedStylesheetPath = "/pretty-feed-v3.xsl";

const parseFeedDate = (dateValue: string): Date =>
  new Date(`${dateValue}T00:00:00Z`);

const toTimestamp = (pubDate: RSSFeedItem["pubDate"]): number => {
  if (!pubDate) return 0;
  return (pubDate instanceof Date ? pubDate : new Date(pubDate)).valueOf();
};

export async function GET(context: APIContext) {
  // Get the base URL for converting relative links
  let baseUrl = context.site?.href || "https://www.mkoppmann.at";
  if (baseUrl.endsWith("/")) baseUrl = baseUrl.slice(0, -1);

  const toAbsoluteUrl = (value: string) =>
    value.startsWith("/") && !value.startsWith("//")
      ? `${baseUrl}${value}`
      : value;

  const toAbsoluteSrcset = (value: string) =>
    value
      .split(",")
      .map((entry) => {
        const trimmedEntry = entry.trim();
        if (!trimmedEntry) return trimmedEntry;

        const [url, ...descriptor] = trimmedEntry.split(/\s+/);
        const absoluteUrl = toAbsoluteUrl(url);
        return descriptor.length > 0
          ? `${absoluteUrl} ${descriptor.join(" ")}`
          : absoluteUrl;
      })
      .join(", ");

  // Load MDX renderer so we can render Astro components
  const renderers = await loadRenderers([getMDXRenderer()]);
  const container = await AstroContainer.create({ renderers });

  const posts = await getCollection("blog");
  const sortedPosts = posts.sort(
    (a, b) => b.data.createdDate.valueOf() - a.data.createdDate.valueOf(),
  );

  const feedItems: RSSFeedItem[] = [];

  for (const post of sortedPosts) {
    // Render the MDX component to get the actual HTML content
    const { Content } = await render(post);

    // Use the container to render the component to an HTML string
    const rawContent = await container.renderToString(Content);

    // Transform the HTML to:
    // 1. Convert relative URLs to absolute URLs
    // 2. Sanitize and remove script/style tags
    const content = await transform(
      rawContent.replace(/^<!DOCTYPE html>/, ""),
      [
        async (node) => {
          await walk(node, (node) => {
            if (!node.attributes) return;

            // Convert relative links to absolute
            if (node.attributes.href) {
              node.attributes.href = toAbsoluteUrl(node.attributes.href);
            }

            // Convert relative image sources to absolute
            if (node.attributes.src) {
              node.attributes.src = toAbsoluteUrl(node.attributes.src);
            }

            // Convert relative responsive image sources to absolute
            if (node.attributes.srcset) {
              node.attributes.srcset = toAbsoluteSrcset(node.attributes.srcset);
            }
          });
          return node;
        },
        sanitize({ dropElements: ["script", "style"] }),
      ],
    );

    feedItems.push({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.createdDate,
      author: feedAuthor,
      link: `/blog/${post.id}/`,
      content,
    });
  }

  const talkItems: RSSFeedItem[] = talks.map((talk) => {
    return {
      title: `New talk: ${talk.title}`,
      pubDate: parseFeedDate(talk.date),
      author: feedAuthor,
      link: "/talks/",
    };
  });

  const publicationItems: RSSFeedItem[] = publications.map((publication) => {
    return {
      title: `New publication: ${publication.title}`,
      pubDate: parseFeedDate(publication.date),
      author: feedAuthor,
      link: "/publications/",
    };
  });

  const combinedItems = [...feedItems, ...talkItems, ...publicationItems].sort(
    (a, b) => toTimestamp(b.pubDate) - toTimestamp(a.pubDate),
  );

  return rss({
    title: feedTitle,
    description: feedDescription,
    site: context.site ?? new URL(context.url.origin),
    stylesheet: feedStylesheetPath,
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
    customData: `<atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />`,
    items: combinedItems,
  });
}
