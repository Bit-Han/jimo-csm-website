// lib/db/queries/landing-pages.ts
import { asc, desc, eq } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/lib/db";
import { landingPages, forms, projects } from "@/lib/db/schema";
import { withTimeout } from "@/lib/utils/timeout";
import type { PublicLandingPage } from "@/lib/types/landing-page";
import type {
	AdminLandingPageListRow,
	FormPickerOption,
	ProjectPickerOption,
} from "@/lib/types/admin/landing-page";

const DB_TIMEOUT_MS = 8000;

function formatUpdatedAt(date: Date): string {
	return date.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

export async function getAdminLandingPageRows(): Promise<AdminLandingPageListRow[]> {
	console.info("[admin:getAdminLandingPageRows] Loading admin landing page list");
	const rows = await withTimeout(
		db.query.landingPages.findMany({
			orderBy: [desc(landingPages.updatedAt)],
			with: { linkedProject: { columns: { name: true } } },
		}),
		DB_TIMEOUT_MS,
		"getAdminLandingPageRows",
	);
	console.info(`[admin:getAdminLandingPageRows] Loaded ${rows.length} landing pages`);

	return rows.map((row) => ({
		id: row.id,
		slug: row.slug,
		title: row.title,
		campaignType: row.campaignType,
		audience: row.audience,
		crmTag: row.crmTag,
		linkedProjectName: row.linkedProject?.name ?? row.linkedProjectSlug ?? null,
		publishStatus: row.publishStatus as "draft" | "published",
		updatedAt: formatUpdatedAt(row.updatedAt),
	}));
}

// Cached per-request — the edit page and generateMetadata both need this
// row, same pattern as getAdminArticleEditorState.
export const getLandingPageEditorState = cache(async (slug: string) => {
	console.info(`[admin:getLandingPageEditorState] Loading landing page editor state for slug: ${slug}`);
	const page = await withTimeout(
		db.query.landingPages.findFirst({ where: eq(landingPages.slug, slug) }),
		DB_TIMEOUT_MS,
		"getLandingPageEditorState",
	);
	console.info(
		`[admin:getLandingPageEditorState] ${page ? "Loaded" : "No landing page found for"} slug: ${slug}`,
	);
	return page;
});

/** Only active forms — a CTA wired to a draft/review form would silently
 * break for real visitors, so those are excluded from the picker outright
 * rather than shown with a warning. */
export async function getFormOptionsForPicker(): Promise<FormPickerOption[]> {
	console.info("[admin:getFormOptionsForPicker] Loading active form picker options");
	const rows = await withTimeout(
		db
			.select({ id: forms.id, title: forms.title, status: forms.status })
			.from(forms)
			.where(eq(forms.status, "active"))
			.orderBy(asc(forms.title)),
		DB_TIMEOUT_MS,
		"getFormOptionsForPicker",
	);
	console.info(`[admin:getFormOptionsForPicker] Loaded ${rows.length} active form options`);
	return rows;
}

export async function getProjectOptionsForPicker(): Promise<ProjectPickerOption[]> {
	console.info("[admin:getProjectOptionsForPicker] Loading project picker options");
	const rows = await withTimeout(
		db
			.select({ slug: projects.slug, name: projects.name })
			.from(projects)
			.orderBy(asc(projects.name)),
		DB_TIMEOUT_MS,
		"getProjectOptionsForPicker",
	);
	console.info(`[admin:getProjectOptionsForPicker] Loaded ${rows.length} project options`);
	return rows;
}



export async function getPublicLandingPageBySlug(
	slug: string,
): Promise<PublicLandingPage | null> {
	const page = await withTimeout(
		db.query.landingPages.findFirst({ where: eq(landingPages.slug, slug) }),
		DB_TIMEOUT_MS,
		"getPublicLandingPageBySlug",
	);

	if (!page || page.publishStatus !== "published") return null;

	const formIds = Array.from(
		new Set(
			[page.hero.primaryCta.formId, page.hero.secondaryCta?.formId].filter(
				(id): id is string => Boolean(id),
			),
		),
	);

	let resolvedForms: PublicLandingPage["primaryForm"][] = [];

	if (formIds.length > 0) {
		const formRows = await withTimeout(
			db.query.forms.findMany({
				where: (f, { inArray, eq: eqOp, and }) =>
					and(inArray(f.id, formIds), eqOp(f.status, "active")),
				with: {
					fields: { orderBy: (ff, { asc: ascOp }) => [ascOp(ff.position)] },
				},
			}),
			DB_TIMEOUT_MS,
			"getPublicLandingPageBySlug:forms",
		);

		resolvedForms = formRows.map((f) => ({
			id: f.id,
			title: f.title,
			fields: f.fields.map((ff) => ({
				id: ff.id,
				type: ff.type,
				label: ff.label,
				placeholder: ff.placeholder,
				required: ff.required,
				options: ff.options,
			})),
		}));
	}

	const primaryForm =
		resolvedForms.find((f) => f?.id === page.hero.primaryCta.formId) ?? null;
	const secondaryForm = page.hero.secondaryCta
		? resolvedForms.find((f) => f?.id === page.hero.secondaryCta!.formId) ?? null
		: null;

	return {
		slug: page.slug,
		title: page.title,
		hero: page.hero,
		primaryForm,
		secondaryForm,
	};
}
