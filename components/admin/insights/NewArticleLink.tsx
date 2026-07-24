// components/admin/insights/NewArticleLink.tsx
"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

// Warms the RichTextEditor's JS chunk (Tiptap core + extensions) before
// the click happens. That chunk is only requested lazily by next/dynamic
// the first time ArticleContentPanel renders it — prefetching it here
// removes that fetch+parse delay from the critical path of "click → see
// the editor," which is most of what makes /new feel slow to open.
function prefetchRichTextEditor() {
  void import("@/components/admin/insights/article-editor/RichTextEditor");
}

export function NewArticleLink() {
  return (
    <Link
      href="/admin/news-insights/new"
			// Loading this server route starts the editor's database reads. Do that
			// only after an intentional click; the editor JavaScript is still warmed
			// separately on hover below.
			prefetch={false}
      onMouseEnter={prefetchRichTextEditor}
      onFocus={prefetchRichTextEditor}
      onTouchStart={prefetchRichTextEditor}
      className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
    >
      <Plus className="h-4 w-4" />
      New Article
    </Link>
  );
}
