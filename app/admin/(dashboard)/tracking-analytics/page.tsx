import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TrackingStatCards } from "@/components/admin/tracking/TrackingStatCards";
import { ConversionEventsPanel } from "@/components/admin/tracking/ConversionEventsPanel";
import { TrackingIntegrationsPanel } from "@/components/admin/tracking/TrackingIntegrationsPanel";
import { TrackingEventsTable } from "@/components/admin/tracking/TrackingEventsTable";
import { TrackingPageActions } from "@/components/admin/tracking/TrackingPageActions";
import {
	mockConversionEvents,
	mockTrackingEventRows,
	mockTrackingIntegrations,
	mockTrackingStats,
} from "@/lib/data/admin/tracking-analytics";

export const metadata: Metadata = {
	title: "Tracking & Analytics | Jimo Command Centre",
};

export const dynamic = 'force-dynamic';


export default function AdminTrackingAnalyticsPage() {
	return (
		<div className="space-y-6">
			<AdminPageHeader
				title="Tracking & Analytics"
				description="Manage tracking setup, conversion events, pixels and campaign performance measurement."
				action={<TrackingPageActions />}
			/>

			<TrackingStatCards stats={mockTrackingStats} />

			<div className="grid gap-5 lg:grid-cols-[1fr_340px]">
				<ConversionEventsPanel events={mockConversionEvents} />
				<TrackingIntegrationsPanel integrations={mockTrackingIntegrations} />
			</div>

			<TrackingEventsTable events={mockTrackingEventRows} />
		</div>
	);
}
