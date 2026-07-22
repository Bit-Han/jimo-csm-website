// lib/utils/tiptap-render.ts
// No "use client" — this runs in Server Components.
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import type { JSONContent } from "@tiptap/react";

const extensions = [
	StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
	Underline,
	Link.configure({ openOnClick: false }),
	Image,
];

export function renderInsightContentHtml(
	doc: JSONContent | null | undefined,
): string {
	if (!doc?.content || doc.content.length === 0) return "";
	return generateHTML(doc, extensions);
}
