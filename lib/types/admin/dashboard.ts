import type { LucideIcon } from "lucide-react";

export type ChartPeriod = "7" | "30" | "90";

export interface DashboardStat {
	id: string;
	label: string;
	value: number;
	changePercent?: number;
	changeNote?: string;
	icon: LucideIcon;
	iconBgClass: string;
	iconColorClass: string;
}

export interface LeadChartDataPoint {
	date: string;
	leads: number;
}

export type LeadStatus =
	| "new"
	| "contacted"
	| "qualified"
	| "inspection"
	| "negotiation";

export interface RecentEnquiry {
	id: string;
	name: string;
	projectAndBudget: string;
	status: LeadStatus;
}

export type AdminProjectStatus =
	| "under-development"
	| "active"
	| "completed"

export interface ProjectStatRow {
	id: string;
	name: string;
	leads: number;
	leadChangePercent: number;
	brochures: number;
	whatsapp: number;
	status: AdminProjectStatus;
}

export type AlertSeverity = "needs-attention" | "review" | "healthy";

export interface OperationalAlert {
	id: string;
	message: string;
	detail: string;
	severity: AlertSeverity;
	actionLabel?: string;
	actionHref?: string;
}
