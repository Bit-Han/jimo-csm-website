"use server";

import type { ArticleEditorState } from "@/lib/types/admin/article";

export interface ArticleActionResult {
	success: boolean;
	message: string;
	slug?: string;
}

export async function saveDraftArticle(
	state: ArticleEditorState,
): Promise<ArticleActionResult> {
	// TODO (integration stage):
	// 1. Validate with Zod
	// 2. Auto-generate slug from title if new
	// 3. Upsert into insights table (publishStatus = "draft")
	// 4. Upsert into seo_configs (pageType = "insight", pageSlug = slug)
	// 5. revalidatePath("/admin/news-insights")
	console.log("[saveDraftArticle]", state.slug || "(new)", state.title);
	await new Promise((res) => setTimeout(res, 400));
	return { success: true, message: "Draft saved.", slug: state.slug };
}

export async function publishArticle(
	state: ArticleEditorState,
): Promise<ArticleActionResult> {
	// TODO (integration stage):
	// 1. Validate with Zod
	// 2. Upsert with publishStatus = "published", publishedAt = now()
	// 3. revalidatePath(`/insights/${state.slug}`)
	// 4. revalidatePath("/insights")
	// 5. revalidatePath("/") — home page if it surfaces latest insights
	console.log("[publishArticle]", state.slug, state.title);
	await new Promise((res) => setTimeout(res, 600));
	return { success: true, message: "Article published.", slug: state.slug };
}
