// import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

// interface AdminArticleEditPageProps {
// 	params: Promise<{ slug: string }>;
// }

// export default async function AdminArticleEditPage({
// 	params,
// }: AdminArticleEditPageProps) {
// 	const { slug } = await params;

// 	return (
// 		<AdminPlaceholderPage
// 			title="Article Editor"
// 			description={`Editing article "${slug}".`}
// 			stageNote="This becomes the SEO-ready article editor once we get to this stage."
// 		/>
// 	);
// }


import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleEditorShell } from "@/components/admin/insights/article-editor/ArticleEditorShell";
import { getArticleEditorState } from "@/lib/data/admin/articles";
import { getAllInsightSlugs } from "@/lib/data/insights";

interface AdminArticleEditPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllInsightSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: AdminArticleEditPageProps): Promise<Metadata> {
  const { slug } = await params;
  const state = getArticleEditorState(slug);
  return {
    title: state
      ? `Edit: ${state.title} | Jimo Command Centre`
      : "Article Editor | Jimo Command Centre",
  };
}

export default async function AdminArticleEditPage({
  params,
}: AdminArticleEditPageProps) {
  const { slug } = await params;
  const state = getArticleEditorState(slug);

  if (!state) {
    notFound();
  }

  return <ArticleEditorShell initialState={state} mode="edit" />;
}