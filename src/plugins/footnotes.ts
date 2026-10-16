import type { Element, ElementContent, Properties, Text } from "hast";
import type { HastNode, HastPluginDefinition } from "satteri";

// Enhance standard Markdown footnotes at build time. No browser script is needed.
const text = (value: string): Text => ({ type: "text", value });
const element = (
  tagName: string,
  properties: Properties,
  children: ElementContent[],
): Element => ({
  type: "element",
  tagName,
  properties,
  children,
});

function visit(node: HastNode, callback: (node: HastNode) => void) {
  callback(node);
  if ("children" in node) {
    for (const child of node.children) visit(child, callback);
  }
}

// Sätteri exposes lazy nodes; copy their public fields into independent HAST.
function copy<T extends HastNode>(node: T): T {
  const fields = Object.fromEntries(
    Object.entries(node).filter(([key]) => !key.startsWith("_")),
  );
  return {
    ...fields,
    ...(node.type === "element" ? { properties: { ...node.properties } } : {}),
    ...("children" in node ? { children: node.children.map(copy) } : {}),
  } as T;
}

function previewContent(children: ElementContent[], prefix: string) {
  const result = children
    .filter(
      (node) =>
        node.type !== "element" ||
        node.properties.dataFootnoteBackref === undefined,
    )
    .map(copy);
  let heading = 0;
  const ids = new Map<string, string>();
  const clean = (node: ElementContent) => {
    if ("children" in node) {
      node.children = node.children.filter(
        (child) =>
          child.type !== "element" ||
          child.properties.dataFootnoteBackref === undefined,
      );
      node.children.forEach(clean);
    }
    if (node.type !== "element") return;
    if (node.properties.id) {
      const id = node.properties.id;
      const previewId = `${prefix}-${id}`;
      ids.set(id, previewId);
      node.properties.id = previewId;
    } else if (/^h[1-6]$/.test(node.tagName)) {
      node.properties.id = `${prefix}-heading-${++heading}`;
    }
  };
  result.forEach(clean);
  result.forEach((node) =>
    visit(node, (child) => {
      if (child.type !== "element") return;
      const href = child.properties.href;
      if (
        typeof href === "string" &&
        ids.has(href.slice(1)) &&
        href[0] === "#"
      ) {
        child.properties.href = `#${ids.get(href.slice(1))}`;
      }
    }),
  );
  return result;
}

export default function footnotes(): HastPluginDefinition {
  const notes = new Map<string, ElementContent[]>();
  const previews: Element[] = [];

  return {
    name: "footnote-previews",
    before(root) {
      visit(root, (node) => {
        if (
          node.type !== "element" ||
          node.properties.dataFootnotes === undefined
        )
          return;
        const list = node.children.find(
          (child): child is Element =>
            child.type === "element" && child.tagName === "ol",
        );
        for (const note of list?.children ?? []) {
          if (
            note.type === "element" &&
            note.tagName === "li" &&
            note.properties.id
          ) {
            notes.set(note.properties.id, note.children);
          }
        }
      });
    },
    element: {
      filter: ["sup", "h2"],
      visit(node, ctx) {
        if (node.tagName === "h2" && node.properties.id === "footnote-label") {
          return element("h2", { id: "footnote-label" }, [text("Notes")]);
        }
        if (node.tagName !== "sup") return;
        const reference = node.children.find(
          (child): child is Element =>
            child.type === "element" &&
            child.properties.dataFootnoteRef !== undefined,
        );
        if (
          !reference ||
          typeof reference.properties.href !== "string" ||
          !reference.properties.id
        )
          return;
        const content = notes.get(reference.properties.href.slice(1));
        if (!content) return;

        const number = ctx.textContent(reference);
        const referenceId = reference.properties.id;
        const previewId = `footnote-preview-${referenceId}`;
        const link = copy(reference);
        delete link.properties.id;
        link.properties.ariaLabel = `Read note ${number}`;

        previews.push(
          element(
            "aside",
            {
              id: previewId,
              popover: "auto",
              dataFootnotePreview: true,
              dataPagefindIgnore: true,
              ariaLabel: `Note ${number}`,
            },
            [
              element("div", { className: ["footnote-preview-header"] }, [
                element("p", { className: ["footnote-preview-label"] }, [
                  text(`Note ${number}`),
                ]),
                element(
                  "button",
                  {
                    type: "button",
                    popoverTarget: previewId,
                    popoverTargetAction: "hide",
                    ariaLabel: `Close note ${number}`,
                    className: ["footnote-preview-close"],
                  },
                  [text("×")],
                ),
              ]),
              ...previewContent(content, previewId),
            ],
          ),
        );

        return element(
          "sup",
          { id: referenceId, className: ["footnote-reference"], tabIndex: -1 },
          [
            link,
            element(
              "button",
              {
                type: "button",
                popoverTarget: previewId,
                dataFootnoteTrigger: true,
                ariaLabel: `Read note ${number}`,
              },
              [text(number)],
            ),
          ],
        );
      },
    },
    after(root, ctx) {
      for (const preview of previews) ctx.appendChild(root, preview);
    },
  };
}
