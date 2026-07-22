// // lib/utils/tiptap.ts
// import type { JSONContent } from "@tiptap/react";

// /** Walks a Tiptap JSON doc and returns every image node's src. */
// export function extractImageUrls(
// 	doc: JSONContent | null | undefined,
// ): string[] {
// 	if (!doc) return [];
// 	const urls: string[] = [];

// 	function walk(node: JSONContent) {
// 		if (node.type === "image" && typeof node.attrs?.src === "string") {
// 			urls.push(node.attrs.src);
// 		}
// 		node.content?.forEach(walk);
// 	}

// 	walk(doc);
// 	return urls;
// }

// /** Extracts plain text from a Tiptap doc — used for word count / read time. */
// export function extractPlainText(doc: JSONContent | null | undefined): string {
// 	if (!doc) return "";
// 	const parts: string[] = [];

// 	function walk(node: JSONContent) {
// 		if (node.type === "text" && node.text) parts.push(node.text);
// 		node.content?.forEach(walk);
// 	}

// 	walk(doc);
// 	return parts.join(" ");
// }

// export function estimateReadTimeMinutes(
// 	doc: JSONContent | null | undefined,
// ): number {
// 	const words = extractPlainText(doc)
// 		.trim()
// 		.split(/\s+/)
// 		.filter(Boolean).length;
// 	return Math.max(1, Math.round(words / 200));
// }

// /** Safe default for a brand-new article. */
// export const EMPTY_TIPTAP_DOC: JSONContent = {
// 	type: "doc",
// 	content: [{ type: "paragraph" }],
// };


// lib/utils/tiptap.ts
import type { JSONContent } from "@tiptap/react";

/**
 * Strictly validates that a value is a usable Tiptap/ProseMirror document —
 * not just "truthy object." Rejects arrays (old InsightBodyBlock[] data),
 * missing `type: "doc"`, and empty content arrays (ProseMirror's Document
 * node requires `block+` — at least one block — an empty array is an
 * invalid doc that will also crash the schema builder).
 */
export function isValidTiptapDoc(value: unknown): value is JSONContent {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const doc = value as JSONContent;
  return (
    doc.type === "doc" &&
    Array.isArray(doc.content) &&
    doc.content.length > 0
  );
}

/** Walks a Tiptap JSON doc and returns every image node's src. */
export function extractImageUrls(
  doc: JSONContent | null | undefined,
): string[] {
  if (!doc) return [];
  const urls: string[] = [];

  function walk(node: JSONContent) {
    if (node.type === "image" && typeof node.attrs?.src === "string") {
      urls.push(node.attrs.src);
    }
    node.content?.forEach(walk);
  }

  walk(doc);
  return urls;
}

/** Extracts plain text from a Tiptap doc — used for word count / read time. */
export function extractPlainText(
  doc: JSONContent | null | undefined,
): string {
  if (!doc) return "";
  const parts: string[] = [];

  function walk(node: JSONContent) {
    if (node.type === "text" && node.text) parts.push(node.text);
    node.content?.forEach(walk);
  }

  walk(doc);
  return parts.join(" ");
}

export function estimateReadTimeMinutes(
  doc: JSONContent | null | undefined,
): number {
  const words = extractPlainText(doc).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export const EMPTY_TIPTAP_DOC: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};