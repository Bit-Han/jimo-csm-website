//@lib/db/mappers/project.ts

import type { Project, ProjectCategory } from "@/lib/types/project";
import type { ProjectDetail } from "@/lib/types/project-detail";
import type { ProjectAmenityIcon } from "@/lib/types/amenity";

// ─── Minimal shape summary queries fetch ─────────────────────────────────
// Only categories + tags are loaded — no facts, units, amenities, or media.
// TypeScript structural typing means the full detail row also satisfies this,
// so mapProjectRowToSummary accepts both summary and detail rows.
export interface ProjectSummaryRow {
	id: string;
	slug: string;
	name: string;
	location: string;
	status: "completed" | "under-development";
	statusLabel: string;
	developerLabel: string;
	typeLabel: string;
	description: string;
	coverImageSrc: string;
	coverImageAlt: string;
	categories: { category: string }[];
	tags: { id: string; label: string }[];
}

// ─── Full shape the detail query fetches ─────────────────────────────────
export interface ProjectDetailRow extends ProjectSummaryRow {
	categoryLabel: string;
	overview: string[];
	contactCtaTitle: string;
	contactCtaDescription: string;
	facts: { label: string; value: string }[];
	units: {
		id: string;
		name: string;
		icon: string;
		priceLabel: string;
		availabilityLabel: string;
	}[];
	checklistItems: { id: string; kind: string; label: string }[];
	amenities: { id: string; label: string; icon: string }[];
	media: {
		id: string;
		type: string;
		src: string;
		poster: string | null;
		alt: string;
	}[];
}

// ─── Mappers ──────────────────────────────────────────────────────────────

export function mapProjectRowToSummary(row: ProjectSummaryRow): Project {
	return {
		id: row.id,
		slug: row.slug,
		name: row.name,
		location: row.location,
		status: row.status,
		statusLabel: row.statusLabel,
		category: row.categories.map((c) => c.category as ProjectCategory),
		developerLabel: row.developerLabel,
		typeLabel: row.typeLabel,
		description: row.description,
		tags: row.tags.map((t) => ({ id: t.id, label: t.label })),
		primaryCta: {
			label: "View Project",
			href: `/projects/${row.slug}`,
		},
		secondaryCta: {
			label: "Register Interest",
			href: `/contact?project=${row.slug}`,
		},
		coverImage: {
			src: row.coverImageSrc,
			alt: row.coverImageAlt,
		},
	};
}

export function mapProjectRowToDetail(row: ProjectDetailRow): ProjectDetail {
	const summary = mapProjectRowToSummary(row);

	const investmentHighlights = row.checklistItems
		.filter((item) => item.kind === "investment_highlight")
		.map((item) => ({ id: item.id, label: item.label }));

	const paymentPlan = row.checklistItems
		.filter((item) => item.kind === "payment_plan")
		.map((item) => ({ id: item.id, label: item.label }));

	return {
		...summary,
		categoryLabel: row.categoryLabel,
		facts: row.facts.map((f) => ({ label: f.label, value: f.value })),
		overview: row.overview,
		units: row.units.map((u) => ({
			id: u.id,
			name: u.name,
			icon: u.icon as "home" | "building",
			priceLabel: u.priceLabel,
			availabilityLabel: u.availabilityLabel,
		})),
		investmentHighlights,
		paymentPlan,
		amenities: row.amenities.map((a) => ({
			id: a.id,
			label: a.label,
			icon: a.icon as ProjectAmenityIcon,
		})),
		media: row.media.map((m) => ({
			id: m.id,
			type: m.type as "image" | "video",
			src: m.src,
			poster: m.poster ?? undefined,
			alt: m.alt,
		})),
		contactCtaTitle: row.contactCtaTitle,
		contactCtaDescription: row.contactCtaDescription,
	};
}