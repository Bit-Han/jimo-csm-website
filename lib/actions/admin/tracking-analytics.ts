"use server";

export interface TrackingActionResult {
	success: boolean;
	message: string;
}

export async function saveIntegrationConfig(
	platform: string,
	configValue: string,
): Promise<TrackingActionResult> {
	// TODO (integration stage):
	// 1. Validate configValue format per platform (GTM-XXXXX, G-XXXXXXXX, etc.)
	// 2. db.update(trackingIntegrations)
	//      .set({ config: { [configKey]: configValue }, isConnected: configValue.trim().length > 0, updatedAt: new Date() })
	//      .where(eq(trackingIntegrations.platform, platform))
	console.log("[saveIntegrationConfig]", platform, configValue);
	await new Promise((res) => setTimeout(res, 400));
	return { success: true, message: `${platform} configuration saved.` };
}

export async function testTrackingEvents(): Promise<TrackingActionResult> {
	// TODO (integration stage):
	// 1. For each connected integration, fire a test_event via their respective APIs
	// 2. GTM: push to dataLayer in a server context (or return a client-side script)
	// 3. GA4: Measurement Protocol test hit
	// 4. Meta: Test event via Conversions API with test_event_code
	await new Promise((res) => setTimeout(res, 800));
	return {
		success: false,
		message:
			"No integrations connected yet. Enter pixel IDs in the integrations panel first.",
	};
}

export async function saveAllIntegrations(
	configs: Record<string, string>,
): Promise<TrackingActionResult> {
	// TODO (integration stage):
	// Bulk upsert all integration configs
	console.log("[saveAllIntegrations]", configs);
	await new Promise((res) => setTimeout(res, 600));
	return { success: true, message: "All integration settings saved." };
}
