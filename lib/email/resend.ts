import { Resend } from "resend";

// Server-only — never import in client components
const resend = new Resend(process.env.RESEND_API_KEY);

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
	const fromAddress =
		process.env.RESEND_FROM_EMAIL ?? "brochures@jimopropertydevelopment.com";

	const { error } = await resend.emails.send({
		from: `Jimo Property Development <${fromAddress}>`,
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
	return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Brochure</title>
</head>
<body style="margin:0;padding:0;background:#f4e9e1;font-family:sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden">

    <!-- Header -->
    <div style="background:#15110e;padding:32px 40px;display:flex;align-items:center;gap:16px">
      <div style="width:44px;height:44px;background:#c8102e;border-radius:12px;display:flex;align-items:center;justify-content:center">
        <span style="color:white;font-size:20px;font-weight:700;display:block;text-align:center;line-height:44px;width:44px">J</span>
      </div>
      <div>
        <p style="margin:0;color:white;font-size:15px;font-weight:700">Jimo Property Development</p>
        <p style="margin:0;color:rgba(255,255,255,0.5);font-size:12px">Premium Real Estate</p>
      </div>
    </div>

    <!-- Body -->
    <div style="padding:40px">
      <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#15110e">
        Hi ${escapeHtml(payload.recipientName)},
      </p>
      <p style="margin:0 0 24px;font-size:15px;color:#78716c;line-height:1.6">
        Thank you for your interest in <strong style="color:#15110e">${escapeHtml(payload.projectName)}</strong>.
        Your brochure is ready — click the button below to download it directly to your device.
      </p>

      <a href="${payload.brochureDownloadUrl}"
         style="display:inline-block;background:#c8102e;color:white;font-size:14px;font-weight:600;padding:14px 28px;border-radius:12px;text-decoration:none;margin-bottom:32px">
        Download Brochure →
      </a>

      <div style="border-top:1px solid #f0ede8;padding-top:24px">
        <p style="margin:0 0 12px;font-size:14px;color:#78716c;line-height:1.6">
          Have questions about the project, pricing, or payment plans? Our team
          is available to help.
        </p>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <a href="${payload.whatsappHref}"
             style="display:inline-block;background:#15110e;color:white;font-size:13px;font-weight:600;padding:10px 20px;border-radius:10px;text-decoration:none">
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f4e9e1;padding:24px 40px">
      <p style="margin:0;font-size:11px;color:#a8a29e;line-height:1.6">
        Jimo Property Development Limited · 32 Sholanke Street, Akoka, Lagos<br>
        You received this email because you requested a brochure from our website.
      </p>
    </div>

  </div>
</body>
</html>
  `.trim();
}

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}
