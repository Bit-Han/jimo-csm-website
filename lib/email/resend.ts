
// //@/lib/email/resend.ts

// Server-only — never import in client components
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "brochures@jimopropertydevelopment.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://jimopropertydevelopment.com";

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

// ── Brochure delivery ───────────────────────────────────────────────────────

export interface BrochureEmailPayload {
	to: string;
	recipientName: string;
	projectName: string;
	brochureDownloadUrl: string;
	whatsappHref: string;
}

export async function sendBrochureEmail(
	payload: BrochureEmailPayload,
): Promise<{ success: boolean; message: string }> {
	const { error } = await resend.emails.send({
		from: `Jimo Property Development <${FROM}>`,
		to: payload.to,
		subject: `Your ${payload.projectName} Brochure`,
		html: buildBrochureEmailHtml(payload),
	});

	if (error) {
		console.error("[sendBrochureEmail] error:", error.message);
		return { success: false, message: error.message };
	}
	return { success: true, message: "Brochure email sent." };
}

function buildBrochureEmailHtml(payload: BrochureEmailPayload): string {
	const recipientName = escapeHtml(payload.recipientName);
	const projectName = escapeHtml(payload.projectName);

	return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Your Brochure</title></head>
<body style="margin:0;padding:0;background:#f4e9e1;font-family:sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden">
    <div style="background:#15110e;padding:32px 40px;display:flex;align-items:center;gap:16px">
      <div style="width:44px;height:44px;background:#c8102e;border-radius:12px;display:flex;align-items:center;justify-content:center">
        <span style="color:white;font-size:20px;font-weight:700;display:block;text-align:center;line-height:44px;width:44px">J</span>
      </div>
      <div>
        <p style="margin:0;color:white;font-size:15px;font-weight:700">Jimo Property Development</p>
        <p style="margin:0;color:rgba(255,255,255,0.5);font-size:12px">Premium Real Estate</p>
      </div>
    </div>
    <div style="padding:40px">
      <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#15110e">Hi ${recipientName},</p>
      <p style="margin:0 0 24px;font-size:15px;color:#78716c;line-height:1.6">
        Thank you for your interest in <strong style="color:#15110e">${projectName}</strong>.
        Your brochure is ready — click the button below to download it directly to your device.
      </p>
      <a href="${payload.brochureDownloadUrl}" style="display:inline-block;background:#c8102e;color:white;font-size:14px;font-weight:600;padding:14px 28px;border-radius:12px;text-decoration:none;margin-bottom:32px">
        Download Brochure →
      </a>
      <div style="border-top:1px solid #f0ede8;padding-top:24px">
        <p style="margin:0 0 12px;font-size:14px;color:#78716c;line-height:1.6">
          Have questions about the project, pricing, or payment plans? Our team is available to help.
        </p>
        <a href="${payload.whatsappHref}" style="display:inline-block;background:#15110e;color:white;font-size:13px;font-weight:600;padding:10px 20px;border-radius:10px;text-decoration:none">
          Chat on WhatsApp
        </a>
      </div>
    </div>
    <div style="background:#f4e9e1;padding:24px 40px">
      <p style="margin:0;font-size:11px;color:#a8a29e;line-height:1.6">
        Jimo Property Development Limited · 32 Sholanke Street, Akoka, Lagos<br>
        You received this email because you requested a brochure from our website.
      </p>
    </div>
  </div>
</body>
</html>`.trim();
}

// ── Lead auto-response ──────────────────────────────────────────────────────

export async function sendLeadAutoResponse(params: {
	to: string;
	leadName: string;
	projectName?: string;
}): Promise<{ success: boolean; message: string }> {
	const leadName = escapeHtml(params.leadName);
	const projectName = params.projectName ? escapeHtml(params.projectName) : undefined;

	const { error } = await resend.emails.send({
		from: `Jimo Property <${FROM}>`,
		to: params.to,
		subject: `Thank you for your enquiry${projectName ? ` – ${projectName}` : ""}`,
		html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #15110e;">Thank you, ${leadName}!</h2>
        <p>We have received your enquiry${projectName ? ` about <strong>${projectName}</strong>` : ""} and a member of our team will be in touch with you shortly.</p>
        <p>In the meantime, feel free to explore our current projects on our website.</p>
        <br/>
        <p>Warm regards,</p>
        <p><strong>Jimo Property Development Limited</strong></p>
      </div>`,
	});

	if (error) {
		console.error("[sendLeadAutoResponse] error:", error.message);
		return { success: false, message: error.message };
	}
	return { success: true, message: "Auto-response sent." };
}

// ── Internal sales alert ────────────────────────────────────────────────────

export async function sendSalesAlert(params: {
	leadName: string;
	leadPhone: string;
	leadEmail?: string | null;
	projectName?: string | null;
	budgetRange?: string | null;
	source?: string | null;
}): Promise<{ success: boolean; message: string }> {
	const salesEmail = process.env.SALES_NOTIFICATION_EMAIL ?? FROM;
	const leadName = escapeHtml(params.leadName);
	const leadPhone = escapeHtml(params.leadPhone);
	const leadEmail = params.leadEmail ? escapeHtml(params.leadEmail) : "—";
	const projectName = params.projectName ? escapeHtml(params.projectName) : "—";
	const budgetRange = params.budgetRange ? escapeHtml(params.budgetRange) : "—";
	const source = params.source ? escapeHtml(params.source) : "—";

	const { error } = await resend.emails.send({
		from: `Jimo CMS <${FROM}>`,
		to: salesEmail,
		subject: `New Lead: ${leadName}`,
		html: `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h2>New Lead Received</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Name</strong></td><td style="padding: 8px; border: 1px solid #eee;">${leadName}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Phone</strong></td><td style="padding: 8px; border: 1px solid #eee;">${leadPhone}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #eee;">${leadEmail}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Project</strong></td><td style="padding: 8px; border: 1px solid #eee;">${projectName}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Budget</strong></td><td style="padding: 8px; border: 1px solid #eee;">${budgetRange}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Source</strong></td><td style="padding: 8px; border: 1px solid #eee;">${source}</td></tr>
        </table>
        <p><a href="${APP_URL}/admin/leads">View in CMS →</a></p>
      </div>`,
	});

	if (error) {
		console.error("[sendSalesAlert] error:", error.message);
		return { success: false, message: error.message };
	}
	return { success: true, message: "Sales alert sent." };
}