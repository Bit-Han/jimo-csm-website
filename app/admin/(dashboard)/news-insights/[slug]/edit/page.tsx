// import type { Metadata } from "next";
// import { notFound } from "next/navigation";
// import { ArticleEditorShell } from "@/components/admin/insights/article-editor/ArticleEditorShell";
// import { getArticleEditorState } from "@/lib/data/admin/articles";
// import { getAllInsightSlugs } from "@/lib/data/insights";

// interface AdminArticleEditPageProps {
//   params: Promise<{ slug: string }>;
// }

// export function generateStaticParams() {
//   return getAllInsightSlugs().map((slug) => ({ slug }));
// }

// export async function generateMetadata({
//   params,
// }: AdminArticleEditPageProps): Promise<Metadata> {
//   const { slug } = await params;
//   const state = getArticleEditorState(slug);
//   return {
//     title: state
//       ? `Edit: ${state.title} | Jimo Command Centre`
//       : "Article Editor | Jimo Command Centre",
//   };
// }

// export default async function AdminArticleEditPage({
//   params,
// }: AdminArticleEditPageProps) {
//   const { slug } = await params;
//   const state = getArticleEditorState(slug);

//   if (!state) {
//     notFound();
//   }

//   return <ArticleEditorShell initialState={state} mode="edit" />;
// }

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleEditorShell } from "@/components/admin/insights/article-editor/ArticleEditorShell";
import { getAdminArticleEditorState } from "@/lib/db/queries/insights";
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

export default async function AdminArticleEditPage({
	params,
}: AdminArticleEditPageProps) {
	const { slug } = await params;
	const row = await getAdminArticleEditorState(slug);

	if (!row) notFound();

	const insight = mapInsightRowToDetail(row);

	const state: ArticleEditorState = {
		slug: insight.slug,
		title: insight.title,
		category: insight.category,
		categoryLabel: insight.categoryLabel,
		excerpt: insight.excerpt,
		body: insight.body.length > 0 ? insight.body : [""],
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
	};

	return <ArticleEditorShell initialState={state} mode="edit" />;
}