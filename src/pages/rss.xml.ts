import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx/container-renderer";
import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { APIContext } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { getCollection, render } from "astro:content";
import type { CollectionEntry } from "astro:content";
import EntryImage from "../components/EntryImage.astro";
import {
  DOCUMENT_NODE,
  ELEMENT_NODE,
  TEXT_NODE,
  transform,
  walk,
  type Node,
} from "ultrahtml";
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

type JsonEntry = Pick<CollectionEntry<"talks" | "publications">, "data">;

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

  const sanitizeFeedHtml = async (rawHtml: string, contentUrl = baseUrl) =>
    transform(rawHtml.replace(/^<!DOCTYPE html>/, ""), [
      async (node) => {
        await walk(node, (node) => {
          // Readers get the canonical endnotes, without duplicate previews or buttons.
          if (node.type === DOCUMENT_NODE || node.type === ELEMENT_NODE) {
            node.children = node.children.filter(
              (child: Node) =>
                child.attributes?.["data-footnote-preview"] === undefined &&
                child.attributes?.["data-footnote-trigger"] === undefined,
            );
          }
          // Some readers decode entities twice, turning an escaped `<details>`
          // in inline code into a real element that hides the rest of the post.
          // A word joiner after `<` keeps it from ever parsing as a tag.
          if (node.type === TEXT_NODE) {
            node.value = node.value.replace(
              /&lt;(?=[a-z\/!?])/gi,
              "&lt;\u2060",
            );
          }
          if (!node.attributes) return;

          if (node.attributes.href) {
            node.attributes.href = node.attributes.href.startsWith("#")
              ? `${contentUrl}${node.attributes.href}`
              : toAbsoluteUrl(node.attributes.href);
          }

          if (node.attributes.src) {
            node.attributes.src = toAbsoluteUrl(node.attributes.src);
          }

          if (node.attributes.srcset) {
            node.attributes.srcset = toAbsoluteSrcset(node.attributes.srcset);
          }
        });
        return node;
      },
      sanitize({ dropElements: ["script", "style"] }),
    ]);

  const escapeHtml = (value: string): string =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const toEntryDescription = (entry: JsonEntry): string =>
    entry.data.description ??
    `${entry.data.type} at ${entry.data.venue} (${entry.data.language}, ${entry.data.date})`;

  const renderEntryContent = async (
    kind: "Talk" | "Publication",
    entry: JsonEntry,
  ): Promise<string> => {
    const descriptionHtml = entry.data.description
      ? `<p>${escapeHtml(entry.data.description)}</p>`
      : "";
    const imageHtml = entry.data.image
      ? await container.renderToString(EntryImage, {
          props: { image: entry.data.image },
          locals: { feed: true },
        })
      : "";
    const linksHtml = entry.data.links
      .map(
        (link) =>
          `<li><a href="${escapeHtml(toAbsoluteUrl(link.href))}">${escapeHtml(link.label)}</a></li>`,
      )
      .join("");

    const html = `
      <article>
        <h1>${escapeHtml(entry.data.title)}</h1>
        ${descriptionHtml}
        ${imageHtml}
        <p>Kind: ${escapeHtml(kind)}</p>
        <p>Type: ${escapeHtml(entry.data.type)}</p>
        <p>Venue: ${escapeHtml(entry.data.venue)}</p>
        <p>Date: ${escapeHtml(entry.data.date)}</p>
        <p>Language: ${escapeHtml(entry.data.language)}</p>
        <h2>Resources</h2>
        <ul>${linksHtml}</ul>
      </article>
    `;

    return sanitizeFeedHtml(html);
  };

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
    const rawContent = await container.renderToString(Content, {
      locals: { feed: true },
    });

    // Transform the HTML to:
    // 1. Convert relative URLs to absolute URLs
    // 2. Sanitize and remove script/style tags
    const postUrl = new URL(`/blog/${post.id}/`, baseUrl).href;
    const content = await sanitizeFeedHtml(rawContent, postUrl);

    feedItems.push({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.createdDate,
      author: feedAuthor,
      link: `/blog/${post.id}/`,
      content,
    });
  }

  const allTalks = await getCollection("talks");
  const talkItems: RSSFeedItem[] = await Promise.all(
    allTalks.map(async (talk) => {
      return {
        title: `New talk: ${talk.data.title}`,
        description: toEntryDescription(talk),
        pubDate: parseFeedDate(talk.data.date),
        author: feedAuthor,
        link: `/talks/${talk.id}/`,
        content: await renderEntryContent("Talk", talk),
      };
    }),
  );

  const allPublications = await getCollection("publications");
  const publicationItems: RSSFeedItem[] = await Promise.all(
    allPublications.map(async (publication) => {
      return {
        title: `New publication: ${publication.data.title}`,
        description: toEntryDescription(publication),
        pubDate: parseFeedDate(publication.data.date),
        author: feedAuthor,
        link: `/publications/${publication.id}/`,
        content: await renderEntryContent("Publication", publication),
      };
    }),
  );

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
