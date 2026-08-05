// lib/actions/admin/landing-pages.ts
"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { landingPages, projects } from "@/lib/db/schema";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import { deleteCloudinaryAssetSafe } from "@/lib/integrations/cloudinary";
import { withTimeout } from "@/lib/utils/timeout";
import type { LandingPageEditorState } from "@/lib/types/admin/landing-page";

export interface LandingPageActionResult {
	success: boolean;
	message: string;
	slug?: string;
}

const DB_TIMEOUT_MS = 8000;

function buildSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

function computeMissingForPublish(state: LandingPageEditorState): string[] {
	const missing: string[] = [];
	if (!state.title.trim()) missing.push("an internal title");
	if (!state.slug.trim()) missing.push("a URL slug");
	if (!state.hero.headline.trim()) missing.push("a headline");
	if (!state.hero.primaryCta.label.trim()) missing.push("a primary CTA label");
	if (!state.hero.primaryCta.formId.trim())
		missing.push("a form linked to the primary CTA");
	return missing;
}

async function upsertLandingPage(
	state: LandingPageEditorState,
	publishStatus: "draft" | "published",
): Promise<string> {
	const slug = state.slug.trim() || buildSlug(state.title);

	// Resolve the linked project fresh from the DB rather than trusting
	// state.linkedProjectName — same reasoning as resolveAuthorSnapshot in
	// articles.ts: it may be stale if the project was renamed since load.
	let linkedProjectId: string | null = null;
	if (state.linkedProjectSlug) {
		const project = await withTimeout(
			db.query.projects.findFirst({
				where: eq(projects.slug, state.linkedProjectSlug),
				columns: { id: true },
			}),
			DB_TIMEOUT_MS,
			"upsertLandingPage:resolveProject",
		);
		linkedProjectId = project?.id ?? null;
	}

	const values = {
		slug,
		title: state.title,
		campaignType: state.campaignType || null,
		audience: state.audience || null,
		crmTag: state.crmTag || null,
		linkedProjectId,
		linkedProjectSlug: state.linkedProjectSlug || null,
		hero: state.hero,
		// Denormalised convenience column mirroring the primary CTA's form —
		// the JSONB hero content remains the actual source of truth for
		// which CTA opens which form (primary and secondary can differ).
		formId: state.hero.primaryCta.formId || null,
		publishStatus,
		updatedAt: new Date(),
	};

	const existing = state.id
		? await withTimeout(
				db.query.landingPages.findFirst({ where: eq(landingPages.id, state.id) }),
				DB_TIMEOUT_MS,
				"upsertLandingPage:findExisting",
			)
		: null;

	if (existing) {
		await withTimeout(
			db.update(landingPages).set(values).where(eq(landingPages.id, existing.id)),
			DB_TIMEOUT_MS,
			"upsertLandingPage:update",
		);
	} else {
		await withTimeout(
			db.insert(landingPages).values({ ...values, createdByUserId: null }),
			DB_TIMEOUT_MS,
			"upsertLandingPage:insert",
		);
	}

	return slug;
}

export async function saveDraftLandingPage(
	state: LandingPageEditorState,
): Promise<LandingPageActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };
		if (!state.title.trim())
			return { success: false, message: "Internal title is required." };

		const slug = await upsertLandingPage(state, "draft");

		revalidatePath("/admin/landing-pages", "layout");
		return { success: true, message: "Draft saved.", slug };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error.";
		console.error("[saveDraftLandingPage]", message);
		return { success: false, message };
	}
}

export async function publishLandingPage(
	state: LandingPageEditorState,
): Promise<LandingPageActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		const missing = computeMissingForPublish(state);
		if (missing.length > 0) {
			return {
				success: false,
				message: `Before publishing, add ${missing.join(", ")}.`,
			};
		}

		const slug = await upsertLandingPage(state, "published");

		revalidatePath("/admin/landing-pages", "layout");
		revalidatePath(`/lp/${slug}`);
		return { success: true, message: "Landing page published.", slug };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error.";
		console.error("[publishLandingPage]", message);
		return { success: false, message };
	}
}

export async function unpublishLandingPage(
	slug: string,
): Promise<LandingPageActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		const existing = await withTimeout(
			db.query.landingPages.findFirst({ where: eq(landingPages.slug, slug) }),
			DB_TIMEOUT_MS,
			"unpublishLandingPage:find",
		);
		if (!existing) return { success: false, message: "Landing page not found." };

		await withTimeout(
			db
				.update(landingPages)
				.set({ publishStatus: "draft", updatedAt: new Date() })
				.where(eq(landingPages.id, existing.id)),
			DB_TIMEOUT_MS,
			"unpublishLandingPage:update",
		);

		revalidatePath("/admin/landing-pages", "layout");
		revalidatePath(`/lp/${slug}`);
		return { success: true, message: "Landing page unpublished and moved to drafts." };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error.";
		console.error("[unpublishLandingPage]", message);
		return { success: false, message };
	}
}

export async function deleteLandingPage(
	slug: string,
): Promise<LandingPageActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		const existing = await withTimeout(
			db.query.landingPages.findFirst({ where: eq(landingPages.slug, slug) }),
			DB_TIMEOUT_MS,
			"deleteLandingPage:find",
		);
		if (!existing) return { success: false, message: "Landing page not found." };

		await withTimeout(
			db.delete(landingPages).where(eq(landingPages.id, existing.id)),
			DB_TIMEOUT_MS,
			"deleteLandingPage:delete",
		);

		await deleteCloudinaryAssetSafe(existing.hero?.backgroundImageUrl ?? null, "image");

		revalidatePath("/admin/landing-pages", "layout");
		return { success: true, message: `"${existing.title}" deleted.` };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error.";
		console.error("[deleteLandingPage]", message);
		return { success: false, message };
	}
}