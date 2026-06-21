// lib/integrations/resend.ts
// ─────────────────────────────────────────────────────────────────────────────
// Email sending via Resend.
// All templates are inline (no external template engine needed at this scale).
// ─────────────────────────────────────────────────────────────────────────────
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "hello@jimoproperty.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://jimoproperty.com";

// ─────────────────────────────────────────────────────────────────────────────
// Lead auto-response: sent to the lead immediately after form submission
// ─────────────────────────────────────────────────────────────────────────────
export async function sendLeadAutoResponse(params: {
	to: string;
	leadName: string;
	projectName?: string;
}): Promise<void> {
	await resend.emails.send({
		from: `Jimo Property <${FROM}>`,
		to: params.to,
		subject: `Thank you for your enquiry${params.projectName ? ` – ${params.projectName}` : ""}`,
		html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1b2d4f;">Thank you, ${params.leadName}!</h2>
        <p>We have received your enquiry${params.projectName ? ` about <strong>${params.projectName}</strong>` : ""} and a member of our team will be in touch with you shortly.</p>
        <p>In the meantime, feel free to explore our current projects on our website.</p>
        <br/>
        <p>Warm regards,</p>
        <p><strong>Jimo Property Development Limited</strong><br/>Building tomorrow, today.</p>
      </div>
    `,
	});
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal sales alert: notifies the sales team of a new lead
// ─────────────────────────────────────────────────────────────────────────────
export async function sendSalesAlert(params: {
	leadName: string;
	leadPhone: string;
	leadEmail?: string | null;
	projectName?: string | null;
	budgetRange?: string | null;
	source?: string | null;
}): Promise<void> {
	const salesEmail = process.env.SALES_NOTIFICATION_EMAIL ?? FROM;
	await resend.emails.send({
		from: `Jimo CMS <${FROM}>`,
		to: salesEmail,
		subject: `🔔 New Lead: ${params.leadName}`,
		html: `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h2>New Lead Received</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Name</strong></td><td style="padding: 8px; border: 1px solid #eee;">${params.leadName}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Phone</strong></td><td style="padding: 8px; border: 1px solid #eee;">${params.leadPhone}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #eee;">${params.leadEmail ?? "—"}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Project</strong></td><td style="padding: 8px; border: 1px solid #eee;">${params.projectName ?? "—"}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Budget</strong></td><td style="padding: 8px; border: 1px solid #eee;">${params.budgetRange ?? "—"}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Source</strong></td><td style="padding: 8px; border: 1px solid #eee;">${params.source ?? "—"}</td></tr>
        </table>
        <p><a href="${APP_URL}/dashboard/leads">View in CMS →</a></p>
      </div>
    `,
	});
}

// ─────────────────────────────────────────────────────────────────────────────
// Brochure delivery: sends the brochure download link to the lead
// ─────────────────────────────────────────────────────────────────────────────
export async function sendBrochureEmail(params: {
	to: string;
	leadName: string;
	projectName: string;
	brochureUrl: string;
}): Promise<void> {
	await resend.emails.send({
		from: `Jimo Property <${FROM}>`,
		to: params.to,
		subject: `Your ${params.projectName} Brochure`,
		html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1b2d4f;">Here is your brochure, ${params.leadName}!</h2>
        <p>Please find the <strong>${params.projectName}</strong> brochure attached via the link below:</p>
        <p><a href="${params.brochureUrl}" style="background: #c8a84b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Download Brochure</a></p>
        <p>The link will be available for 7 days. Our team will be in touch to discuss further.</p>
        <br/>
        <p>Warm regards,</p>
        <p><strong>Jimo Property Development Limited</strong></p>
      </div>
    `,
	});
}
