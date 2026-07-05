import type { Metadata } from "next";
import { ArticleEditorShell } from "@/components/admin/insights/article-editor/ArticleEditorShell";
import { DEFAULT_ARTICLE_STATE } from "@/lib/types/admin/article";

export const metadata: Metadata = {
	title: "New Article | Jimo Command Centre",
};

export default function AdminNewArticlePage() {
	return <ArticleEditorShell initialState={DEFAULT_ARTICLE_STATE} mode="new" />;
}
