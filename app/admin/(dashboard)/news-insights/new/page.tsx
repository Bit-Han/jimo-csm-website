// //@admin/(dashboard)/news-insights/new/page

import type { Metadata } from "next";
import { ArticleEditorShell } from "@/components/admin/insights/article-editor/ArticleEditorShell";
import { DEFAULT_ARTICLE_STATE } from "@/lib/types/admin/article";
import { getInsightCategories } from "@/lib/db/queries/insight-categories";
import { getActiveAdminUsersForAuthorSelect } from "@/lib/db/queries/insights";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import { timed } from "@/lib/utils/timed";

export const metadata: Metadata = {
	title: "New Article | Jimo Command Centre",
};

export const dynamic = "force-dynamic";

export default async function AdminNewArticlePage() {
	const [categories, authors, currentAdmin] = await Promise.all([
		timed("getInsightCategories", getInsightCategories()),
		timed(
			"getActiveAdminUsersForAuthorSelect",
			getActiveAdminUsersForAuthorSelect(),
		),
		timed("getAdminUser", getAdminUser()),
	]);

	const firstCategory = categories[0];
	const initialState = {
		...DEFAULT_ARTICLE_STATE,
		category: firstCategory?.value ?? "",
		categoryLabel: firstCategory?.label ?? "",
		authorId: currentAdmin?.id ?? "",
		authorName: currentAdmin?.fullName ?? "",
		authorAvatarUrl: currentAdmin?.avatarUrl ?? "",
	};

	return (
		<ArticleEditorShell
			initialState={initialState}
			mode="new"
			categories={categories}
			authors={authors}
		/>
	);
}