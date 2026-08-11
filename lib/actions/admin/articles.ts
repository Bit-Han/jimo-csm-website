
//@/lib/actions/admin/articles
"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { JSONContent } from "@tiptap/react";
import { db } from "@/lib/db";
import { insights, adminUsers } from "@/lib/db/schema";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import { deleteCloudinaryAssetSafe } from "@/lib/integrations/cloudinary";
import { deleteStorageObjectSafe } from "@/lib/integrations/supabase-storage";
import { extractImageUrls } from "@/lib/utils/tiptap";
import type { ArticleEditorState, ArticleEditorPayload } from "@/lib/types/admin/article";

export interface ArticleActionResult {
	success: boolean;
	message: string;
	slug?: string;
}

interface AuthorSnapshot {
	authorId: string | null;
	authorName: string;
	authorAvatarUrl: string | null;
}

function buildSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

/** Never throws — a Cloudinary cleanup failure must not surface as a
 * save/delete failure, since the DB is already the source of truth. */
async function cleanupImages(urls: string[]): Promise<void> {
	await Promise.all(
		urls
			.filter(Boolean)
			.map((url) =>
				url.includes("supabase.co")
					? deleteStorageObjectSafe(url)
					: deleteCloudinaryAssetSafe(url, "image"),
			),
	);
}

/** Resolves an authorId to a live admin_users row. Returns a blank
 * snapshot (authorId: null) if none was given, or if the given id no
 * longer resolves to a real admin — e.g. deleted between being selected
 * in the editor and the publish click landing. Callers that require a
 * valid author (publishArticle) must check authorId !== null themselves;
 * this function only resolves, it doesn't decide whether blank is
 * acceptable — saveDraftArticle allows it, publishArticle must not. */
async function resolveAuthorSnapshot(
	authorId: string | null | undefined,
): Promise<AuthorSnapshot> {
	if (!authorId)
		return { authorId: null, authorName: "", authorAvatarUrl: null };

	const author = await db.query.adminUsers.findFirst({
		where: eq(adminUsers.id, authorId),
	});
	if (!author) return { authorId: null, authorName: "", authorAvatarUrl: null };

	return {
		authorId: author.id,
		authorName: author.fullName,
		authorAvatarUrl: author.avatarUrl ?? null,
	};
}

/** Parses the wire-boundary payload's stringified content back into a
 * real Tiptap JSONContent doc, producing the ArticleEditorState shape
 * every downstream function (upsertInsight, validation, etc.) expects. */
function parsePayload(payload: ArticleEditorPayload): ArticleEditorState {
	return {
		...payload,
		content: JSON.parse(payload.content) as JSONContent,
	};
}

async function upsertInsight(
	state: ArticleEditorState,
	requestedStatus: "draft" | "published",
	authorSnapshot: AuthorSnapshot,
): Promise<{ slug: string; publishStatus: "draft" | "published" }> {
	const slug = state.slug || buildSlug(state.title);

	const existing = state.slug
		? await db.query.insights.findFirst({ where: eq(insights.slug, state.slug) })
		: null;

	// A "Save Draft" click on an already-published article should save the
	// edit in place — it must never silently pull a live article off the
	// public site. Only an explicit Publish/Unpublish action changes
	// live status.
	const publishStatus: "draft" | "published" =
		requestedStatus === "draft" && existing?.publishStatus === "published"
			? "published"
			: requestedStatus;

	const values = {
		slug,
		title: state.title,
		category: state.category,
		categoryLabel: state.categoryLabel,
		excerpt: state.excerpt,
		content: state.content,
		coverImageSrc: state.coverImageSrc || null,
		coverImageAlt: state.coverImageAlt,
		relatedProjectSlug: state.relatedProjectSlug || null,
		relatedProjectName: state.relatedProjectName || null,
		readTimeMinutes: state.readTimeMinutes,
		publishedAt:
			publishStatus === "published"
				? state.publishedAt
					? new Date(state.publishedAt)
					: (existing?.publishedAt ?? new Date())
				: state.publishedAt
					? new Date(state.publishedAt)
					: null,
		seoTitle: state.seoTitle || null,
		seoDescription: state.seoDescription || null,
		focusKeyword: state.focusKeyword || null,
		publishStatus,
		...authorSnapshot,
		updatedAt: new Date(),
	};

	if (existing) {
		await db.update(insights).set(values).where(eq(insights.id, existing.id));
	} else {
		await db.insert(insights).values(values);
	}

	return { slug, publishStatus };
}

export async function saveDraftArticle(
	payload: ArticleEditorPayload,
	pendingImageDeletions: string[] = [],
): Promise<ArticleActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };
		if (!payload.title.trim())
			return { success: false, message: "Article title is required." };

		// content arrives as a JSON string over the Server Action boundary —
		// see ArticleEditorShell — to avoid Next/Turbopack silently dropping
		// nested "attrs" keys on image nodes and link marks when a plain
		// object graph crosses this boundary. Parse it back into a real doc
		// before it touches anything else.
		const parsedState = parsePayload(payload);

		const authorSnapshot = await resolveAuthorSnapshot(parsedState.authorId || null);
		const { slug, publishStatus } = await upsertInsight(parsedState, "draft", authorSnapshot);
		await cleanupImages(pendingImageDeletions);

		revalidatePath("/admin/news-insights", "layout");
		// The edit may have kept (or landed on) a LIVE article — e.g. adding a
		// body image via "Save Draft" on something already published. Without
		// this, the public page keeps serving its stale ISR cache until the
		// next natural revalidation window, which looks exactly like "the
		// image never saved" even though the database already has it.
		if (publishStatus === "published") {
			revalidatePath("/insights", "layout");
			revalidatePath(`/insights/${slug}`);
		}

		return { success: true, message: "Draft saved.", slug };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error.";
		console.error("[saveDraftArticle]", message);
		return { success: false, message };
	}
}

export async function publishArticle(
	payload: ArticleEditorPayload,
	pendingImageDeletions: string[] = [],
): Promise<ArticleActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };
		if (!payload.title.trim())
			return { success: false, message: "Article title is required before publishing." };
		if (!payload.excerpt.trim())
			return { success: false, message: "An excerpt is required before publishing." };
		if (!payload.category.trim() || !payload.categoryLabel.trim())
			return { success: false, message: "Select a category before publishing." };
		if (!payload.authorId.trim())
			return { success: false, message: "Select an author before publishing." };

		const parsedState = parsePayload(payload);

		// Re-resolve against the database rather than trusting
		// parsedState.authorName/authorAvatarUrl — those are just whatever
		// the client last had in memory, and could be stale if the admin was
		// renamed, had their photo changed, or was deleted since the editor
		// loaded. This also catches the case the earlier checks can't: an
		// authorId that was valid when selected but no longer resolves to a
		// real admin by the time Publish is clicked.
		const authorSnapshot = await resolveAuthorSnapshot(parsedState.authorId);
		if (!authorSnapshot.authorId) {
			return {
				success: false,
				message: "The selected author could not be found. Please choose an author again.",
			};
		}

		const { slug } = await upsertInsight(parsedState, "published", authorSnapshot);
		await cleanupImages(pendingImageDeletions);

		revalidatePath("/insights", "layout");
		revalidatePath(`/insights/${slug}`);
		revalidatePath("/admin/news-insights", "layout");
		return { success: true, message: "Article published.", slug };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error.";
		console.error("[publishArticle]", message);
		return { success: false, message };
	}
}

/** Unpublish only flips status back to draft — images stay on Cloudinary
 * so republishing later doesn't need re-uploading anything. */
export async function unpublishArticle(
	slug: string,
): Promise<ArticleActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		const existing = await db.query.insights.findFirst({
			where: eq(insights.slug, slug),
		});
		if (!existing) return { success: false, message: "Article not found." };

		await db
			.update(insights)
			.set({ publishStatus: "draft", updatedAt: new Date() })
			.where(eq(insights.id, existing.id));

		revalidatePath("/insights", "layout");
		revalidatePath(`/insights/${slug}`);
		revalidatePath("/admin/news-insights", "layout");
		return {
			success: true,
			message: "Article unpublished and moved to drafts.",
		};
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		console.error("[unpublishArticle]", message);
		return { success: false, message };
	}
}

/** Only path that permanently destroys images — removes the DB row AND
 * every Cloudinary asset the article referenced (cover + inline body
 * images, walked out of the Tiptap JSON doc), matching the confirm-dialog
 * warning shown before this runs. */
export async function deleteArticle(
	slug: string,
): Promise<ArticleActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		const existing = await db.query.insights.findFirst({
			where: eq(insights.slug, slug),
		});
		if (!existing) return { success: false, message: "Article not found." };

		await db.delete(insights).where(eq(insights.id, existing.id));

		const imageUrls = [
			existing.coverImageSrc,
			...extractImageUrls(existing.content as JSONContent | null),
		].filter((u): u is string => Boolean(u));

		await cleanupImages(imageUrls);

		revalidatePath("/insights", "layout");
		revalidatePath("/admin/news-insights", "layout");
		return { success: true, message: `"${existing.title}" deleted.` };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		console.error("[deleteArticle]", message);
		return { success: false, message };
	}
}