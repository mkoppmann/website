import type { CollectionEntry } from "astro:content";

export type EntryImage = NonNullable<
  CollectionEntry<"talks" | "publications">["data"]["image"]
>;

const sentences = new Intl.Segmenter("en", { granularity: "sentence" });

export function descriptionPreview(description: string): string {
  const text = description.trim();
  const firstSentence = sentences.segment(text)[Symbol.iterator]().next().value;
  const preview = firstSentence?.segment.trim() ?? text;
  return preview.length < text.length ? `${preview} …` : preview;
}
