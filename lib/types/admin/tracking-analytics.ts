export type AdminTrackingPlatform =
	| "google_tag_manager"
	| "google_analytics_4"
	| "meta_pixel"
	| "tiktok_pixel"
	| "linkedin_insight_tag"
	| "x_pixel"
	| "snapchat_pixel";

export type AdminTrackingEventCategory =
	| "awareness"
	| "lead_generation"
	| "engagement"
	| "conversion";

export type AdminTrackingEventStatus = "active" | "inactive" | "testing";

export interface TrackingStatCard {
	id: string;
	label: string;
	value: number;
	changePercent: number;
}

export interface ConversionEventBar {
	id: string;
	eventName: string;
	count: number;
	percentage: number;
}

export interface AdminTrackingIntegration {
	platform: AdminTrackingPlatform;
	label: string;
	isConnected: boolean;
	configKey: string;
	configLabel: string;
	configPlaceholder: string;
	currentValue: string;
}

export interface AdminTrackingEventRow {
	id: string;
	eventName: string;
	trigger: string;
	destinations: string;
	status: AdminTrackingEventStatus;
	category: AdminTrackingEventCategory;
}
