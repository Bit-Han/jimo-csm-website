// export type LeadSource =
// 	| "website"
// 	| "landing_page"
// 	| "whatsapp"
// 	| "instagram"
// 	| "google"
// 	| "referral"
// 	| "brochure";

// export type LeadStatus =
// 	| "new"
// 	| "contacted"
// 	| "qualified"
// 	| "inspection"
// 	| "negotiation"
// 	| "won"
// 	| "lost";

// export interface LeadListRow {
// 	id: string;
// 	name: string;
// 	phone: string;
// 	projectPage: string;
// 	projectSlug: string;
// 	budget: string;
// 	source: LeadSource;
// 	status: LeadStatus;
// 	assignedTo: string | null;
// 	date: string;
// 	time: string;
// }

// export interface LeadActivityEvent {
// 	id: string;
// 	label: string;
// 	timestamp: string;
// 	isCurrent?: boolean;
// }

// export interface LeadDetail extends LeadListRow {
// 	initials: string;
// 	email: string;
// 	location: string;
// 	enquiredAt: string;
// 	unitInterest: string;
// 	buyingPurpose: string;
// 	preferredPlan: string;
// 	message: string;
// 	sourcePage: string;
// 	utmSource: string;
// 	utmMedium: string;
// 	utmCampaign: string;
// 	device: string;
// 	referrer: string;
// 	activityTimeline: LeadActivityEvent[];
// }

// export interface LeadSummaryStats {
// 	newLeadsCount: number;
// 	newLeadsNote: string;
// 	qualifiedLeadsCount: number;
// 	qualifiedLeadsChange: string;
// 	crmConnected: boolean;
// 	crmSyncNote: string;
// 	totalSynced: number;
// 	totalLeads: number;
// }

// export interface LeadFilterState {
// 	project: string;
// 	budget: string;
// 	status: string;
// 	search: string;
// 	sort: "newest" | "oldest";
// }

// export type LeadColumnKey =
// 	| "phone"
// 	| "projectPage"
// 	| "budget"
// 	| "source"
// 	| "assignedTo"
// 	| "date";

export type LeadSource =
	| "website"
	| "landing_page"
	| "whatsapp"
	| "instagram"
	| "google"
	| "referral"
	| "brochure";

export type LeadStatus =
	| "new"
	| "contacted"
	| "qualified"
	| "inspection"
	| "negotiation"
	| "won"
	| "lost";

export interface LeadListRow {
	id: string;
	name: string;
	phone: string;
	projectPage: string;
	projectSlug: string;
	budget: string;
	source: LeadSource;
	status: LeadStatus;
	assignedTo: string | null;
	assignedToId: string | null;
	date: string;
	time: string;
}

export interface LeadActivityEvent {
	id: string;
	label: string;
	timestamp: string;
	isCurrent?: boolean;
}

// AssignableUser — admin users shown in the assign rep dropdown
export interface AssignableUser {
	id: string;
	fullName: string;
	role: string;
}

export interface LeadDetail extends LeadListRow {
	initials: string;
	email: string;
	enquiredAt: string;
	enquiryType: string;
	message: string;
	notes: string | null; // ← saved sales notes, nullable
	sourcePage: string;
	utmSource: string;
	utmMedium: string;
	utmCampaign: string;
	activityTimeline: LeadActivityEvent[];
}

export interface LeadSummaryStats {
	newLeadsCount: number;
	newLeadsNote: string;
	qualifiedLeadsCount: number;
	qualifiedLeadsChange: string;
	crmConnected: boolean;
	crmSyncNote: string;
	totalSynced: number;
	totalLeads: number;
}

export interface LeadFilterState {
	project: string;
	budget: string;
	status: string;
	search: string;
	sort: "newest" | "oldest";
}

export type LeadColumnKey =
	| "phone"
	| "projectPage"
	| "budget"
	| "source"
	| "assignedTo"
	| "date";