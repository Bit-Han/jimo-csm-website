// lib/utils/tiptap-render.ts — replace as-is
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import type { JSONContent } from "@tiptap/react";

// Must mirror RichTextEditor.tsx's extension config exactly — StarterKit's
// own bundled link/underline have to be turned off here too, or this
// registers two conflicting definitions of the same extension name and
// generateHTML can silently produce malformed output for anything those
// marks touch.
const extensions = [
	StarterKit.configure({
		heading: { levels: [1, 2, 3] },
		link: false,
		underline: false,
	}),
	Underline,
	Link.configure({
		openOnClick: false,
		HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
	}),
	Image.configure({ HTMLAttributes: { class: "rounded-2xl" } }),
];

export function renderInsightContentHtml(
	doc: JSONContent | null | undefined,
): string {
	if (!doc?.content || doc.content.length === 0) return "";
	try {
		return generateHTML(doc, extensions);
	} catch (error) {
		// A bad/unexpected node in the doc should degrade to "no body
		// rendered" for that one article, never take down the whole page.
		console.error("[renderInsightContentHtml]", error);
		return "";
	}
}