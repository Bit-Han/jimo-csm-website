// import { and, count, desc, eq, isNull } from "drizzle-orm";
// import { db } from "@/lib/db";
// import { adminUsers, leads, projects } from "@/lib/db/schema";
// import type {
// 	AssignableUser,
// 	LeadDetail,
// 	LeadListRow,
// 	LeadSummaryStats,
// } from "@/lib/types/admin/lead";

// // ─── Helpers ──────────────────────────────────────────────────────────────

// function safeFormatDate(date: Date): string {
// 	try {
// 		return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
// 	} catch {
// 		return "—";
// 	}
// }

// function safeFormatTime(date: Date): string {
// 	try {
// 		return date.toLocaleTimeString("en-GB", {
// 			hour: "2-digit",
// 			minute: "2-digit",
// 		});
// 	} catch {
// 		return "—";
// 	}
// }

// function safeFormatDateTime(date: Date): string {
// 	try {
// 		return date.toLocaleString("en-GB", {
// 			day: "numeric",
// 			month: "short",
// 			year: "numeric",
// 			hour: "2-digit",
// 			minute: "2-digit",
// 		});
// 	} catch {
// 		return "—";
// 	}
// }

// function getInitials(name: string): string {
// 	return name
// 		.split(" ")
// 		.map((p) => p[0] ?? "")
// 		.join("")
// 		.slice(0, 2)
// 		.toUpperCase();
// }

// function buildProjectDisplay(
// 	projectSlug: string | null,
// 	projectName: string | null,
// ): string {
// 	if (projectName) return projectName;
// 	if (projectSlug) {
// 		return projectSlug
// 			.split("-")
// 			.map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`)
// 			.join(" ");
// 	}
// 	return "General Enquiry";
// }

// // ─── Lead list rows ───────────────────────────────────────────────────────

// export async function getAdminLeadListRows(
// 	limit = 200,
// ): Promise<LeadListRow[]> {
// 	try {
// 		// Step 1 — raw leads
// 		const rawLeads = await db
// 			.select()
// 			.from(leads)
// 			.orderBy(desc(leads.createdAt))
// 			.limit(limit);

// 		if (rawLeads.length === 0) return [];

// 		// Step 2 — collect unique FK ids to batch-fetch
// 		const projectIds = [
// 			...new Set(rawLeads.map((l) => l.projectId).filter(Boolean) as string[]),
// 		];
// 		const userIds = [
// 			...new Set(
// 				rawLeads.map((l) => l.assignedToUserId).filter(Boolean) as string[],
// 			),
// 		];

// 		// Step 3 — parallel lookups
// 		const [allProjects, allUsers] = await Promise.all([
// 			projectIds.length > 0
// 				? db.select({ id: projects.id, name: projects.name }).from(projects)
// 				: Promise.resolve([]),
// 			userIds.length > 0
// 				? db
// 						.select({ id: adminUsers.id, fullName: adminUsers.fullName })
// 						.from(adminUsers)
// 				: Promise.resolve([]),
// 		]);

// 		const projectMap = new Map(allProjects.map((p) => [p.id, p.name]));
// 		const userMap = new Map(allUsers.map((u) => [u.id, u.fullName]));

// 		// Step 4 — map
// 		return rawLeads.map((lead): LeadListRow => {
// 			const projectName = lead.projectId
// 				? (projectMap.get(lead.projectId) ?? null)
// 				: null;
// 			const assigneeName = lead.assignedToUserId
// 				? (userMap.get(lead.assignedToUserId) ?? null)
// 				: null;

// 			return {
// 				id: lead.id,
// 				name: lead.fullName,
// 				phone: lead.phoneNumber ?? "—",
// 				projectPage: buildProjectDisplay(lead.projectSlug, projectName),
// 				projectSlug: lead.projectSlug ?? "",
// 				budget: lead.budgetRange ?? "—",
// 				source: lead.source as LeadListRow["source"],
// 				status: lead.status as LeadListRow["status"],
// 				assignedTo: assigneeName,
// 				assignedToId: lead.assignedToUserId,
// 				date: safeFormatDate(lead.createdAt),
// 				time: safeFormatTime(lead.createdAt),
// 			};
// 		});
// 	} catch (error) {
// 		const message = error instanceof Error ? error.message : String(error);
// 		console.error("[getAdminLeadListRows] error:", message);
// 		return [];
// 	}
// }

// // ─── Lead detail ──────────────────────────────────────────────────────────

// export async function getAdminLeadDetail(
// 	id: string,
// ): Promise<LeadDetail | null> {
// 	try {
// 		const lead = await db.query.leads.findFirst({
// 			where: eq(leads.id, id),
// 		});

// 		if (!lead) return null;

// 		// Look up project name
// 		const projectRow = lead.projectId
// 			? await db.query.projects.findFirst({
// 					where: eq(projects.id, lead.projectId),
// 				})
// 			: null;

// 		// Look up assignee
// 		const assigneeRow = lead.assignedToUserId
// 			? await db.query.adminUsers.findFirst({
// 					where: eq(adminUsers.id, lead.assignedToUserId),
// 				})
// 			: null;

// 		const projectName = projectRow?.name ?? null;
// 		const assigneeName = assigneeRow?.fullName ?? null;
// 		const projectDisplay = buildProjectDisplay(lead.projectSlug, projectName);
// 		const createdAt = lead.createdAt;

// 		const activityTimeline = [
// 			{
// 				id: "evt-submit",
// 				label:
// 					lead.source === "brochure" ? "Brochure downloaded" : "Form submitted",
// 				timestamp: safeFormatDateTime(createdAt),
// 			},
// 			{
// 				id: "evt-response",
// 				label: "Auto-response sent",
// 				timestamp: safeFormatDateTime(createdAt),
// 			},
// 			...(assigneeName
// 				? [
// 						{
// 							id: "evt-assigned",
// 							label: `Assigned to ${assigneeName}`,
// 							timestamp: safeFormatDateTime(createdAt),
// 						},
// 					]
// 				: []),
// 			{
// 				id: "evt-current",
// 				label:
// 					{
// 						new: "Awaiting contact",
// 						contacted: "Lead contacted",
// 						qualified: "Lead qualified",
// 						inspection: "Inspection scheduled",
// 						negotiation: "Negotiation in progress",
// 						won: "Deal closed",
// 						lost: "Lead marked as lost",
// 					}[lead.status] ?? "Status updated",
// 				timestamp:
// 					lead.status === "new" && !assigneeName
// 						? "Now"
// 						: safeFormatDateTime(createdAt),
// 				isCurrent: true,
// 			},
// 		];

// 		return {
// 			id: lead.id,
// 			name: lead.fullName,
// 			phone: lead.phoneNumber ?? "—",
// 			projectPage: projectDisplay,
// 			projectSlug: lead.projectSlug ?? "",
// 			budget: lead.budgetRange ?? "—",
// 			source: lead.source as LeadListRow["source"],
// 			status: lead.status as LeadListRow["status"],
// 			assignedTo: assigneeName,
// 			assignedToId: lead.assignedToUserId,
// 			date: safeFormatDate(createdAt),
// 			time: safeFormatTime(createdAt),
// 			initials: getInitials(lead.fullName),
// 			email: lead.email ?? "—",
// 			enquiredAt: safeFormatDateTime(createdAt),
// 			enquiryType: lead.enquiryType ?? "—",
// 			message: lead.message ?? "",
// 			notes: lead.notes,
// 			sourcePage: lead.projectSlug
// 				? `/projects/${lead.projectSlug}`
// 				: "/contact",
// 			utmSource: lead.utmSource ?? "",
// 			utmMedium: lead.utmMedium ?? "",
// 			utmCampaign: lead.utmCampaign ?? "",
// 			activityTimeline,
// 		};
// 	} catch (error) {
// 		const message = error instanceof Error ? error.message : String(error);
// 		console.error("[getAdminLeadDetail] error:", message);
// 		return null;
// 	}
// }

// // ─── Navigation ───────────────────────────────────────────────────────────

// export async function getLeadNavigation(id: string): Promise<{
// 	prevId: string | null;
// 	nextId: string | null;
// 	position: number;
// 	total: number;
// }> {
// 	try {
// 		const allIds = await db
// 			.select({ id: leads.id })
// 			.from(leads)
// 			.orderBy(desc(leads.createdAt));

// 		const index = allIds.findIndex((r) => r.id === id);

// 		return {
// 			prevId: index > 0 ? (allIds[index - 1]?.id ?? null) : null,
// 			nextId:
// 				index < allIds.length - 1 ? (allIds[index + 1]?.id ?? null) : null,
// 			position: index === -1 ? 1 : index + 1,
// 			total: allIds.length,
// 		};
// 	} catch {
// 		return { prevId: null, nextId: null, position: 1, total: 0 };
// 	}
// }

// // ─── Summary stats ────────────────────────────────────────────────────────

// export async function getLeadSummaryStats(): Promise<LeadSummaryStats> {
// 	try {
// 		const [totalResult, newUnassignedResult, qualifiedResult] =
// 			await Promise.all([
// 				db.select({ c: count() }).from(leads),
// 				db
// 					.select({ c: count() })
// 					.from(leads)
// 					.where(and(eq(leads.status, "new"), isNull(leads.assignedToUserId))),
// 				db
// 					.select({ c: count() })
// 					.from(leads)
// 					.where(eq(leads.status, "qualified")),
// 			]);

// 		const total = totalResult[0]?.c ?? 0;
// 		const newUnassigned = newUnassignedResult[0]?.c ?? 0;
// 		const qualified = qualifiedResult[0]?.c ?? 0;

// 		return {
// 			newLeadsCount: newUnassigned,
// 			newLeadsNote: `${newUnassigned} lead${newUnassigned !== 1 ? "s" : ""} not yet assigned.`,
// 			qualifiedLeadsCount: qualified,
// 			qualifiedLeadsChange: "Live from database",
// 			crmConnected: false,
// 			crmSyncNote: "HubSpot not connected. Configure in Settings.",
// 			totalSynced: 0,
// 			totalLeads: total,
// 		};
// 	} catch (error) {
// 		console.error("[getLeadSummaryStats]", error);
// 		return {
// 			newLeadsCount: 0,
// 			newLeadsNote: "Could not load stats.",
// 			qualifiedLeadsCount: 0,
// 			qualifiedLeadsChange: "",
// 			crmConnected: false,
// 			crmSyncNote: "",
// 			totalSynced: 0,
// 			totalLeads: 0,
// 		};
// 	}
// }

// // ─── Assignable users ─────────────────────────────────────────────────────

// export async function getAssignableUsers(): Promise<AssignableUser[]> {
// 	try {
// 		const rows = await db
// 			.select({
// 				id: adminUsers.id,
// 				fullName: adminUsers.fullName,
// 				role: adminUsers.role,
// 			})
// 			.from(adminUsers)
// 			.where(eq(adminUsers.status, "active"))
// 			.orderBy(adminUsers.fullName);

// 		return rows;
// 	} catch {
// 		return [];
// 	}
// }

import { and, count, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { adminUsers, leads, projects } from "@/lib/db/schema";
import type {
	AssignableUser,
	LeadDetail,
	LeadListRow,
	LeadSummaryStats,
} from "@/lib/types/admin/lead";

// ── Formatting helpers ────────────────────────────────────────────────────

function fmtDate(d: Date): string {
	return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function fmtTime(d: Date): string {
	return d.toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
	});
}

function fmtDateTime(d: Date): string {
	return d.toLocaleString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function initials(name: string): string {
	return name
		.split(" ")
		.map((w) => w[0] ?? "")
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

function projectDisplay(slug: string | null, name: string | null): string {
	if (name) return name;
	if (slug) {
		return slug
			.split("-")
			.map((w) => `${w[0]?.toUpperCase() ?? ""}${w.slice(1)}`)
			.join(" ");
	}
	return "General Enquiry";
}

// ── Lead list ─────────────────────────────────────────────────────────────
// Single flat query — no joins, no sequential batches, no mapper.
// Everything resolved in one pass after a simple select.

export async function getAdminLeadListRows(
	limit = 200,
): Promise<LeadListRow[]> {
	// 1. All leads — plain select, no joins
	const rawLeads = await db
		.select()
		.from(leads)
		.orderBy(desc(leads.createdAt))
		.limit(limit);

	if (rawLeads.length === 0) return [];

	// 2. Unique project IDs and user IDs to look up
	const projectIdSet = new Set<string>();
	const userIdSet = new Set<string>();

	for (const l of rawLeads) {
		if (l.projectId) projectIdSet.add(l.projectId);
		if (l.assignedToUserId) userIdSet.add(l.assignedToUserId);
	}

	// 3. Parallel lookups — only if there is something to look up
	const [allProjects, allUsers] = await Promise.all([
		projectIdSet.size > 0
			? db.select({ id: projects.id, name: projects.name }).from(projects)
			: [],
		userIdSet.size > 0
			? db
					.select({ id: adminUsers.id, fullName: adminUsers.fullName })
					.from(adminUsers)
			: [],
	]);

	const projectMap = new Map(allProjects.map((p) => [p.id, p.name]));
	const userMap = new Map(allUsers.map((u) => [u.id, u.fullName]));

	// 4. Build display rows
	return rawLeads.map(
		(l): LeadListRow => ({
			id: l.id,
			name: l.fullName,
			phone: l.phoneNumber ?? "—",
			projectPage: projectDisplay(
				l.projectSlug,
				l.projectId ? (projectMap.get(l.projectId) ?? null) : null,
			),
			projectSlug: l.projectSlug ?? "",
			budget: l.budgetRange ?? "—",
			source: (l.source ?? "website") as LeadListRow["source"],
			status: (l.status ?? "new") as LeadListRow["status"],
			assignedTo: l.assignedToUserId
				? (userMap.get(l.assignedToUserId) ?? null)
				: null,
			assignedToId: l.assignedToUserId,
			date: fmtDate(l.createdAt),
			time: fmtTime(l.createdAt),
		}),
	);
}

// ── Lead detail ───────────────────────────────────────────────────────────

export async function getAdminLeadDetail(
	id: string,
): Promise<LeadDetail | null> {
	const lead = await db.query.leads.findFirst({
		where: eq(leads.id, id),
	});

	if (!lead) return null;

	const [projectRow, assigneeRow] = await Promise.all([
		lead.projectId
			? db.query.projects.findFirst({ where: eq(projects.id, lead.projectId) })
			: null,
		lead.assignedToUserId
			? db.query.adminUsers.findFirst({
					where: eq(adminUsers.id, lead.assignedToUserId),
				})
			: null,
	]);

	const pName = projectRow?.name ?? null;
	const aName = assigneeRow?.fullName ?? null;

	const timeline = [
		{
			id: "t-submit",
			label:
				lead.source === "brochure" ? "Brochure downloaded" : "Form submitted",
			timestamp: fmtDateTime(lead.createdAt),
		},
		{
			id: "t-auto",
			label: "Auto-response sent",
			timestamp: fmtDateTime(lead.createdAt),
		},
		...(aName
			? [
					{
						id: "t-assign",
						label: `Assigned to ${aName}`,
						timestamp: fmtDateTime(lead.createdAt),
					},
				]
			: []),
		{
			id: "t-status",
			label:
				{
					new: "Awaiting contact",
					contacted: "Lead contacted",
					qualified: "Lead qualified",
					inspection: "Inspection scheduled",
					negotiation: "Negotiation in progress",
					won: "Deal closed",
					lost: "Lead marked as lost",
				}[lead.status] ?? "Status updated",
			timestamp:
				lead.status === "new" && !aName ? "Now" : fmtDateTime(lead.createdAt),
			isCurrent: true,
		},
	];

	return {
		id: lead.id,
		name: lead.fullName,
		phone: lead.phoneNumber ?? "—",
		projectPage: projectDisplay(lead.projectSlug, pName),
		projectSlug: lead.projectSlug ?? "",
		budget: lead.budgetRange ?? "—",
		source: (lead.source ?? "website") as LeadListRow["source"],
		status: (lead.status ?? "new") as LeadListRow["status"],
		assignedTo: aName,
		assignedToId: lead.assignedToUserId,
		date: fmtDate(lead.createdAt),
		time: fmtTime(lead.createdAt),
		initials: initials(lead.fullName),
		email: lead.email ?? "—",
		enquiredAt: fmtDateTime(lead.createdAt),
		enquiryType: lead.enquiryType ?? "—",
		message: lead.message ?? "",
		notes: lead.notes,
		sourcePage: lead.projectSlug ? `/projects/${lead.projectSlug}` : "/contact",
		utmSource: lead.utmSource ?? "",
		utmMedium: lead.utmMedium ?? "",
		utmCampaign: lead.utmCampaign ?? "",
		activityTimeline: timeline,
	};
}

// ── Navigation ────────────────────────────────────────────────────────────

export async function getLeadNavigation(id: string): Promise<{
	prevId: string | null;
	nextId: string | null;
	position: number;
	total: number;
}> {
	const allIds = await db
		.select({ id: leads.id })
		.from(leads)
		.orderBy(desc(leads.createdAt));

	const idx = allIds.findIndex((r) => r.id === id);

	return {
		prevId: idx > 0 ? (allIds[idx - 1]?.id ?? null) : null,
		nextId: idx < allIds.length - 1 ? (allIds[idx + 1]?.id ?? null) : null,
		position: idx === -1 ? 1 : idx + 1,
		total: allIds.length,
	};
}

// ── Stats ─────────────────────────────────────────────────────────────────

export async function getLeadSummaryStats(): Promise<LeadSummaryStats> {
	const [totalR, newUnassignedR, qualifiedR] = await Promise.all([
		db.select({ c: count() }).from(leads),
		db
			.select({ c: count() })
			.from(leads)
			.where(and(eq(leads.status, "new"), isNull(leads.assignedToUserId))),
		db.select({ c: count() }).from(leads).where(eq(leads.status, "qualified")),
	]);

	const total = totalR[0]?.c ?? 0;
	const newUnassigned = newUnassignedR[0]?.c ?? 0;
	const qualified = qualifiedR[0]?.c ?? 0;

	return {
		newLeadsCount: newUnassigned,
		newLeadsNote: `${newUnassigned} lead${newUnassigned !== 1 ? "s" : ""} not yet assigned.`,
		qualifiedLeadsCount: qualified,
		qualifiedLeadsChange: "Live from database",
		crmConnected: false,
		crmSyncNote: "HubSpot not connected yet. Configure in Settings.",
		totalSynced: 0,
		totalLeads: total,
	};
}

// ── Assignable users ──────────────────────────────────────────────────────

export async function getAssignableUsers(): Promise<AssignableUser[]> {
	const rows = await db
		.select({
			id: adminUsers.id,
			fullName: adminUsers.fullName,
			role: adminUsers.role,
		})
		.from(adminUsers)
		.where(eq(adminUsers.status, "active"))
		.orderBy(adminUsers.fullName);

	return rows;
}