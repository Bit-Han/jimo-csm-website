//@app/admin/(dashboard)/news-insights/[slug]/edit/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleEditorShell } from "@/components/admin/insights/article-editor/ArticleEditorShell";
import {
	getActiveAdminUsersForAuthorSelect,
	getAdminArticleEditorState,
} from "@/lib/db/queries/insights";
import { getInsightCategories } from "@/lib/db/queries/insight-categories";
import { mapInsightRowToDetail } from "@/lib/db/mappers/insights";
import type { ArticleEditorState } from "@/lib/types/admin/article";

interface AdminArticleEditPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({
	params,
}: AdminArticleEditPageProps): Promise<Metadata> {
	const { slug } = await params;
	const row = await getAdminArticleEditorState(slug);
	return {
		title: row
			? `Edit: ${row.title} | Jimo Command Centre`
			: "Article Editor | Jimo Command Centre",
	};
}

export const dynamic = "force-dynamic";

export default async function AdminArticleEditPage({
	params,
}: AdminArticleEditPageProps) {
	const { slug } = await params;

	const [row, categories, authors] = await Promise.all([
		getAdminArticleEditorState(slug),
		getInsightCategories(),
		getActiveAdminUsersForAuthorSelect(),
	]);

	if (!row) notFound();

	const insight = mapInsightRowToDetail(row);

	const state: ArticleEditorState = {
		slug: insight.slug,
		title: insight.title,
		category: insight.category,
		categoryLabel: insight.categoryLabel,
		excerpt: insight.excerpt,
		content:
			insight.content.length > 0
				? insight.content
				: [{ id: "block-initial", type: "paragraph", text: "" }],
		coverImageSrc: insight.coverImage.src,
		coverImageAlt: insight.coverImage.alt,
		relatedProjectSlug: insight.relatedProject?.slug ?? "",
		relatedProjectName: insight.relatedProject?.name ?? "",
		readTimeMinutes: insight.readTimeMinutes,
		publishedAt: insight.publishedAt,
		seoTitle: row.seoTitle ?? `${insight.title} | Jimo Property Development`,
		seoDescription: row.seoDescription ?? insight.excerpt.slice(0, 160),
		focusKeyword: "",
		publishStatus: row.publishStatus as "draft" | "published",
		authorId: row.authorId ?? "",
		authorName: row.authorName,
		authorAvatarUrl: row.authorAvatarUrl ?? "",
	};

	return (
		<ArticleEditorShell
			initialState={state}
			mode="edit"
			categories={categories}
			authors={authors}
		/>
	);
}
