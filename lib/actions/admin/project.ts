// //lib/actions/admin/project.ts
// "use server";

// import { deleteCloudinaryAssetSafe } from "@/lib/integrations/cloudinary"; // add to imports

// import { eq } from "drizzle-orm";
// import { revalidatePath } from "next/cache";
// import { db } from "@/lib/db";
// import {
// 	projectAmenities,
// 	projectCategories,
// 	projectChecklistItems,
// 	projectFacts,
// 	projectMedia,
// 	projects,
// 	projectTags,
// 	projectUnits,
// } from "@/lib/db/schema";
// import { getAdminUser } from "@/lib/auth/get-admin-user";
// import type { ProjectEditorState } from "@/lib/types/admin/project-editor";

// export interface ProjectActionResult {
// 	success: boolean;
// 	message: string;
// 	slug?: string;
// }

// function buildSlug(name: string): string {
// 	return name
// 		.toLowerCase()
// 		.replace(/[^a-z0-9]+/g, "-")
// 		.replace(/^-|-$/g, "");
// }

// // ─── Core child-table upsert ───────────────────────────────────────────────
// // Delete all child rows then re-insert from current editor state.
// // Simple and correct at this scale; no row-level diffing needed.

// async function upsertProjectRows(
// 	projectId: string,
// 	state: ProjectEditorState,
// ): Promise<void> {
// 	// Categories
// 	await db
// 		.delete(projectCategories)
// 		.where(eq(projectCategories.projectId, projectId));
// 	if (state.categories.length > 0) {
// 		await db
// 			.insert(projectCategories)
// 			.values(state.categories.map((cat) => ({ projectId, category: cat })));
// 	}

// 	// Tags (editor doesn't have a tags UI yet — preserve whatever is in DB)
// 	// We don't touch tags here so existing ones aren't wiped unintentionally.

// 	// Facts
// 	await db.delete(projectFacts).where(eq(projectFacts.projectId, projectId));
// 	if (state.facts.length > 0) {
// 		await db.insert(projectFacts).values(
// 			state.facts.map((f, i) => ({
// 				projectId,
// 				label: f.label,
// 				value: f.value,
// 				position: i,
// 			})),
// 		);
// 	}

// 	// Units
// 	await db.delete(projectUnits).where(eq(projectUnits.projectId, projectId));
// 	if (state.units.length > 0) {
// 		await db.insert(projectUnits).values(
// 			state.units.map((u, i) => ({
// 				projectId,
// 				name: u.name,
// 				icon: u.icon,
// 				priceLabel: u.priceLabel,
// 				availabilityLabel: u.availabilityLabel,
// 				position: i,
// 			})),
// 		);
// 	}

// 	// Checklist items (investment highlights + payment plan)
// 	await db
// 		.delete(projectChecklistItems)
// 		.where(eq(projectChecklistItems.projectId, projectId));

// 	const highlightItems = state.investmentHighlights.map((item, i) => ({
// 		projectId,
// 		kind: "investment_highlight" as const,
// 		label: item.label,
// 		position: i,
// 	}));

// 	const paymentItems = state.paymentPlan.map((item, i) => ({
// 		projectId,
// 		kind: "payment_plan" as const,
// 		label: item.label,
// 		position: i,
// 	}));

// 	if (highlightItems.length > 0 || paymentItems.length > 0) {
// 		await db
// 			.insert(projectChecklistItems)
// 			.values([...highlightItems, ...paymentItems]);
// 	}

// 	// Amenities ← THIS WAS MISSING — was deleted but never re-inserted
// 	await db
// 		.delete(projectAmenities)
// 		.where(eq(projectAmenities.projectId, projectId));
// 	if (state.amenities.length > 0) {
// 		await db.insert(projectAmenities).values(
// 			state.amenities.map((a, i) => ({
// 				projectId,
// 				label: a.label,
// 				icon: a.icon,
// 				position: i,
// 			})),
// 		);
// 	}

// 	// Gallery media
// 	await db.delete(projectMedia).where(eq(projectMedia.projectId, projectId));
// 	if (state.media.length > 0) {
// 		await db.insert(projectMedia).values(
// 			state.media.map((m, i) => ({
// 				projectId,
// 				type: m.type,
// 				cloudinaryPublicId: m.cloudinaryPublicId ?? `pending-${m.id}`,
// 				src: m.src,
// 				poster: m.poster ?? null,
// 				alt: m.alt,
// 				position: i,
// 			})),
// 		);
// 	}
// }

// // ─── Save Draft ────────────────────────────────────────────────────────────

// export async function saveDraftProject(
// 	currentSlug: string | null,
// 	state: ProjectEditorState,
// ): Promise<ProjectActionResult> {
// 	try {
// 		const adminUser = await getAdminUser();
// 		if (!adminUser) {
// 			return { success: false, message: "Not authenticated." };
// 		}

// 		if (!state.name.trim()) {
// 			return {
// 				success: false,
// 				message: "Project name is required before saving.",
// 			};
// 		}

// 		const slug = currentSlug ?? buildSlug(state.name);

// 		const baseValues = {
// 			slug,
// 			name: state.name,
// 			location: state.location,
// 			status: state.status,
// 			statusLabel: state.statusLabel,
// 			categoryLabel: state.categoryLabel,
// 			developerLabel: state.developerLabel,
// 			typeLabel: state.typeLabel,
// 			description: state.description,
// 			overview: state.overview.filter(Boolean),
// 			coverImageSrc: state.coverImageSrc,
// 			coverImageAlt: state.coverImageAlt,
// 			contactCtaTitle: state.contactCtaTitle,
// 			contactCtaDescription: state.contactCtaDescription,
// 			publishStatus: "draft" as const,
// 			lastUpdatedByUserId: adminUser.id,
// 			updatedAt: new Date(),
// 		};

// 		const existing = currentSlug
// 			? await db.query.projects.findFirst({
// 					where: eq(projects.slug, currentSlug),
// 				})
// 			: null;

// 		let projectId: string;

// 		if (existing) {
// 			await db
// 				.update(projects)
// 				.set(baseValues)
// 				.where(eq(projects.id, existing.id));
// 			projectId = existing.id;
// 		} else {
// 			const [inserted] = await db
// 				.insert(projects)
// 				.values(baseValues)
// 				.returning({ id: projects.id });
// 			projectId = inserted!.id;
// 		}

// 		await upsertProjectRows(projectId, state);

// 		revalidatePath("/admin/projects", "layout");

// 		return { success: true, message: "Draft saved.", slug };
// 	} catch (error) {
// 		const message =
// 			error instanceof Error ? error.message : "An unexpected error occurred.";
// 		console.error("[saveDraftProject]", message);
// 		return { success: false, message };
// 	}
// }

// // ─── Publish ───────────────────────────────────────────────────────────────

// export async function publishProject(
// 	currentSlug: string | null,
// 	state: ProjectEditorState,
// ): Promise<ProjectActionResult> {
// 	try {
// 		const adminUser = await getAdminUser();
// 		if (!adminUser) {
// 			return { success: false, message: "Not authenticated." };
// 		}

// 		if (!state.name.trim()) {
// 			return {
// 				success: false,
// 				message: "Project name is required before publishing.",
// 			};
// 		}

// 		if (!state.coverImageSrc.trim()) {
// 			return {
// 				success: false,
// 				message: "A cover image URL is required before publishing.",
// 			};
// 		}

// 		if (!state.description.trim()) {
// 			return {
// 				success: false,
// 				message: "A project description is required before publishing.",
// 			};
// 		}

// 		const slug = currentSlug ?? buildSlug(state.name);

// 		const baseValues = {
// 			slug,
// 			name: state.name,
// 			location: state.location,
// 			status: state.status,
// 			statusLabel: state.statusLabel,
// 			categoryLabel: state.categoryLabel,
// 			developerLabel: state.developerLabel,
// 			typeLabel: state.typeLabel,
// 			description: state.description,
// 			overview: state.overview.filter(Boolean),
// 			coverImageSrc: state.coverImageSrc,
// 			coverImageAlt: state.coverImageAlt,
// 			contactCtaTitle: state.contactCtaTitle,
// 			contactCtaDescription: state.contactCtaDescription,
// 			publishStatus: "published" as const,
// 			featured: true,
// 			lastUpdatedByUserId: adminUser.id,
// 			updatedAt: new Date(),
// 		};

// 		const existing = currentSlug
// 			? await db.query.projects.findFirst({
// 					where: eq(projects.slug, currentSlug),
// 				})
// 			: null;

// 		let projectId: string;

// 		if (existing) {
// 			await db
// 				.update(projects)
// 				.set(baseValues)
// 				.where(eq(projects.id, existing.id));
// 			projectId = existing.id;
// 		} else {
// 			const [inserted] = await db
// 				.insert(projects)
// 				.values(baseValues)
// 				.returning({ id: projects.id });
// 			projectId = inserted!.id;
// 		}

// 		await upsertProjectRows(projectId, state);

// 		// Invalidate all public-facing pages that show project data
// 		revalidatePath("/", "layout");
// 		revalidatePath("/admin/projects", "layout");

// 		return { success: true, message: "Project published to website.", slug };
// 	} catch (error) {
// 		const message =
// 			error instanceof Error ? error.message : "An unexpected error occurred.";
// 		console.error("[publishProject]", message);
// 		return { success: false, message };
// 	}
// }

// // ─── Delete ────────────────────────────────────────────────────────────────

// export async function deleteProject(
// 	slug: string,
// ): Promise<ProjectActionResult> {
// 	try {
// 		const adminUser = await getAdminUser();
// 		if (!adminUser) {
// 			return { success: false, message: "Not authenticated." };
// 		}

// 		// Only super-admin and website-manager can delete
// 		if (!["super-admin", "website-manager"].includes(adminUser.role)) {
// 			return {
// 				success: false,
// 				message: "You do not have permission to delete projects.",
// 			};
// 		}

// 		const existing = await db.query.projects.findFirst({
// 			where: eq(projects.slug, slug),
// 		});

// 		if (!existing) {
// 			return { success: false, message: "Project not found." };
// 		}

// 		// All child rows cascade-delete automatically (onDelete: "cascade" in schema)
// 		await db.delete(projects).where(eq(projects.id, existing.id));

// 		// Invalidate public pages so deleted project no longer appears
// 		revalidatePath("/", "layout");
// 		revalidatePath("/admin/projects", "layout");

// 		return { success: true, message: `"${existing.name}" has been deleted.` };
// 	} catch (error) {
// 		const message =
// 			error instanceof Error ? error.message : "An unexpected error occurred.";
// 		console.error("[deleteProject]", message);
// 		return { success: false, message };
// 	}
// }

// // ─── Unpublish (set back to draft without deleting) ───────────────────────

// export async function unpublishProject(
// 	slug: string,
// ): Promise<ProjectActionResult> {
// 	try {
// 		const adminUser = await getAdminUser();
// 		if (!adminUser) {
// 			return { success: false, message: "Not authenticated." };
// 		}

// 		const existing = await db.query.projects.findFirst({
// 			where: eq(projects.slug, slug),
// 		});

// 		if (!existing) {
// 			return { success: false, message: "Project not found." };
// 		}

// 		await db
// 			.update(projects)
// 			.set({ publishStatus: "draft", updatedAt: new Date() })
// 			.where(eq(projects.id, existing.id));

// 		revalidatePath("/", "layout");
// 		revalidatePath("/admin/projects", "layout");

// 		return {
// 			success: true,
// 			message: `"${existing.name}" moved back to draft.`,
// 		};
// 	} catch (error) {
// 		const message =
// 			error instanceof Error ? error.message : "An unexpected error occurred.";
// 		console.error("[unpublishProject]", message);
// 		return { success: false, message };
// 	}
// }

"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
	projectAmenities,
	projectCategories,
	projectChecklistItems,
	projectFacts,
	projectMedia,
	projects,
	projectTags,
	projectUnits,
} from "@/lib/db/schema";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import { deleteCloudinaryAssetSafe } from "@/lib/integrations/cloudinary";
import type { ProjectEditorState } from "@/lib/types/admin/project-editor";

export interface ProjectActionResult {
	success: boolean;
	message: string;
	slug?: string;
}

function buildSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

/** Never throws — a Cloudinary cleanup failure must not surface as a
 * save/publish/delete failure, since the DB write already succeeded by
 * the time this runs. */
async function cleanupImages(urls: string[]): Promise<void> {
	await Promise.all(
		urls.filter(Boolean).map((url) => deleteCloudinaryAssetSafe(url, "image")),
	);
}

/** Revalidates every public surface a project can appear on — the list,
 * its own detail page, and the home page's featured section — plus the
 * admin list. Called from every action that can change what's publicly
 * visible. */
function revalidateProjectPaths(slug: string) {
	revalidatePath("/", "layout");
	revalidatePath("/projects");
	revalidatePath(`/projects/${slug}`);
	revalidatePath("/admin/projects", "layout");
}

// ─── Core child-table upsert ───────────────────────────────────────────────
// Delete all child rows then re-insert from current editor state.
// Simple and correct at this scale; no row-level diffing needed.

async function upsertProjectRows(
	projectId: string,
	state: ProjectEditorState,
): Promise<void> {
	// Categories
	await db
		.delete(projectCategories)
		.where(eq(projectCategories.projectId, projectId));
	if (state.categories.length > 0) {
		await db
			.insert(projectCategories)
			.values(state.categories.map((cat) => ({ projectId, category: cat })));
	}

	// Tags (editor doesn't have a tags UI yet — preserve whatever is in DB)
	// We don't touch tags here so existing ones aren't wiped unintentionally.

	// Facts
	await db.delete(projectFacts).where(eq(projectFacts.projectId, projectId));
	if (state.facts.length > 0) {
		await db.insert(projectFacts).values(
			state.facts.map((f, i) => ({
				projectId,
				label: f.label,
				value: f.value,
				position: i,
			})),
		);
	}

	// Units
	await db.delete(projectUnits).where(eq(projectUnits.projectId, projectId));
	if (state.units.length > 0) {
		await db.insert(projectUnits).values(
			state.units.map((u, i) => ({
				projectId,
				name: u.name,
				icon: u.icon,
				priceLabel: u.priceLabel,
				availabilityLabel: u.availabilityLabel,
				position: i,
			})),
		);
	}

	// Checklist items (investment highlights + payment plan)
	await db
		.delete(projectChecklistItems)
		.where(eq(projectChecklistItems.projectId, projectId));

	const highlightItems = state.investmentHighlights.map((item, i) => ({
		projectId,
		kind: "investment_highlight" as const,
		label: item.label,
		position: i,
	}));

	const paymentItems = state.paymentPlan.map((item, i) => ({
		projectId,
		kind: "payment_plan" as const,
		label: item.label,
		position: i,
	}));

	if (highlightItems.length > 0 || paymentItems.length > 0) {
		await db
			.insert(projectChecklistItems)
			.values([...highlightItems, ...paymentItems]);
	}

	// Amenities
	await db
		.delete(projectAmenities)
		.where(eq(projectAmenities.projectId, projectId));
	if (state.amenities.length > 0) {
		await db.insert(projectAmenities).values(
			state.amenities.map((a, i) => ({
				projectId,
				label: a.label,
				icon: a.icon,
				position: i,
			})),
		);
	}

	// Gallery media
	await db.delete(projectMedia).where(eq(projectMedia.projectId, projectId));
	if (state.media.length > 0) {
		await db.insert(projectMedia).values(
			state.media.map((m, i) => ({
				projectId,
				type: m.type,
				cloudinaryPublicId: m.cloudinaryPublicId ?? `pending-${m.id}`,
				src: m.src,
				poster: m.poster ?? null,
				alt: m.alt,
				position: i,
			})),
		);
	}
}

// ─── Save Draft ────────────────────────────────────────────────────────────

export async function saveDraftProject(
	currentSlug: string | null,
	state: ProjectEditorState,
	pendingImageDeletions: string[] = [],
): Promise<ProjectActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) {
			return { success: false, message: "Not authenticated." };
		}

		if (!state.name.trim()) {
			return {
				success: false,
				message: "Project name is required before saving.",
			};
		}

		const slug = currentSlug ?? buildSlug(state.name);

		const existing = currentSlug
			? await db.query.projects.findFirst({
					where: eq(projects.slug, currentSlug),
				})
			: null;

		const baseValues = {
			slug,
			name: state.name,
			location: state.location,
			status: state.status,
			statusLabel: state.statusLabel,
			categoryLabel: state.categoryLabel,
			developerLabel: state.developerLabel,
			typeLabel: state.typeLabel,
			description: state.description,
			overview: state.overview.filter(Boolean),
			coverImageSrc: state.coverImageSrc,
			coverImageAlt: state.coverImageAlt,
			contactCtaTitle: state.contactCtaTitle,
			contactCtaDescription: state.contactCtaDescription,
			// FIX: previously hardcoded to "draft" unconditionally, which
			// meant editing and clicking "Save Draft" on an
			// ALREADY-PUBLISHED project silently pulled it off the live
			// site with no warning. A brand-new project still correctly
			// starts as "draft"; an existing project keeps whatever
			// publishStatus it already had.
			publishStatus: existing?.publishStatus ?? ("draft" as const),
			lastUpdatedByUserId: adminUser.id,
			updatedAt: new Date(),
		};

		let projectId: string;

		if (existing) {
			await db
				.update(projects)
				.set(baseValues)
				.where(eq(projects.id, existing.id));
			projectId = existing.id;
		} else {
			const [inserted] = await db
				.insert(projects)
				.values(baseValues)
				.returning({ id: projects.id });
			projectId = inserted!.id;
		}

		await upsertProjectRows(projectId, state);
		await cleanupImages(pendingImageDeletions);

		revalidateProjectPaths(slug);

		return { success: true, message: "Draft saved.", slug };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unexpected error occurred.";
		console.error("[saveDraftProject]", message);
		return { success: false, message };
	}
}

// ─── Publish ───────────────────────────────────────────────────────────────

export async function publishProject(
	currentSlug: string | null,
	state: ProjectEditorState,
	pendingImageDeletions: string[] = [],
): Promise<ProjectActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) {
			return { success: false, message: "Not authenticated." };
		}

		if (!state.name.trim()) {
			return {
				success: false,
				message: "Project name is required before publishing.",
			};
		}

		if (!state.coverImageSrc.trim()) {
			return {
				success: false,
				message: "A cover image URL is required before publishing.",
			};
		}

		if (!state.description.trim()) {
			return {
				success: false,
				message: "A project description is required before publishing.",
			};
		}

		const slug = currentSlug ?? buildSlug(state.name);

		const baseValues = {
			slug,
			name: state.name,
			location: state.location,
			status: state.status,
			statusLabel: state.statusLabel,
			categoryLabel: state.categoryLabel,
			developerLabel: state.developerLabel,
			typeLabel: state.typeLabel,
			description: state.description,
			overview: state.overview.filter(Boolean),
			coverImageSrc: state.coverImageSrc,
			coverImageAlt: state.coverImageAlt,
			contactCtaTitle: state.contactCtaTitle,
			contactCtaDescription: state.contactCtaDescription,
			publishStatus: "published" as const,
			featured: true,
			lastUpdatedByUserId: adminUser.id,
			updatedAt: new Date(),
		};

		const existing = currentSlug
			? await db.query.projects.findFirst({
					where: eq(projects.slug, currentSlug),
				})
			: null;

		let projectId: string;

		if (existing) {
			await db
				.update(projects)
				.set(baseValues)
				.where(eq(projects.id, existing.id));
			projectId = existing.id;
		} else {
			const [inserted] = await db
				.insert(projects)
				.values(baseValues)
				.returning({ id: projects.id });
			projectId = inserted!.id;
		}

		await upsertProjectRows(projectId, state);
		await cleanupImages(pendingImageDeletions);

		revalidateProjectPaths(slug);

		return { success: true, message: "Project published to website.", slug };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unexpected error occurred.";
		console.error("[publishProject]", message);
		return { success: false, message };
	}
}

// ─── Delete ────────────────────────────────────────────────────────────────

export async function deleteProject(
	slug: string,
): Promise<ProjectActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) {
			return { success: false, message: "Not authenticated." };
		}

		// Only super-admin and website-manager can delete
		if (!["super-admin", "website-manager"].includes(adminUser.role)) {
			return {
				success: false,
				message: "You do not have permission to delete projects.",
			};
		}

		const existing = await db.query.projects.findFirst({
			where: eq(projects.slug, slug),
			with: { media: true },
		});

		if (!existing) {
			return { success: false, message: "Project not found." };
		}

		// Gather every Cloudinary asset this project owns BEFORE deleting —
		// once the row is gone (cascade), there's nothing left to query.
		const mediaUrls = [
			existing.coverImageSrc,
			...existing.media.map((m) => m.src),
		].filter((u): u is string => Boolean(u));

		// All child rows cascade-delete automatically (onDelete: "cascade" in schema)
		await db.delete(projects).where(eq(projects.id, existing.id));

		await cleanupImages(mediaUrls);

		revalidateProjectPaths(slug);

		return { success: true, message: `"${existing.name}" has been deleted.` };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unexpected error occurred.";
		console.error("[deleteProject]", message);
		return { success: false, message };
	}
}

// ─── Unpublish (set back to draft without deleting) ───────────────────────

export async function unpublishProject(
	slug: string,
): Promise<ProjectActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) {
			return { success: false, message: "Not authenticated." };
		}

		const existing = await db.query.projects.findFirst({
			where: eq(projects.slug, slug),
		});

		if (!existing) {
			return { success: false, message: "Project not found." };
		}

		await db
			.update(projects)
			.set({ publishStatus: "draft", updatedAt: new Date() })
			.where(eq(projects.id, existing.id));

		revalidateProjectPaths(slug);

		return {
			success: true,
			message: `"${existing.name}" moved back to draft.`,
		};
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unexpected error occurred.";
		console.error("[unpublishProject]", message);
		return { success: false, message };
	}
}