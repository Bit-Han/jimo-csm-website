import type { LeadDetail } from "@/lib/types/admin/lead";

const DETAIL_LABEL =
	"text-xs font-semibold uppercase tracking-wide text-stone-500";
const DETAIL_VALUE = "mt-1 text-sm font-semibold text-ink-950";

export function EnquiryDetailsPanel({ lead }: { lead: LeadDetail }) {
	return (
		<div className="rounded-2xl border border-stone-200 bg-white p-6">
			<h2 className="text-base font-bold text-ink-950">Enquiry Details</h2>
			<dl className="mt-4 grid gap-4 sm:grid-cols-2">
				<div>
					<dt className={DETAIL_LABEL}>Project Interest</dt>
					<dd className={DETAIL_VALUE}>{lead.projectPage.split(" · ")[0]}</dd>
				</div>
				<div>
					<dt className={DETAIL_LABEL}>Unit Interest</dt>
					<dd className={DETAIL_VALUE}>{lead.unitInterest}</dd>
				</div>
				<div>
					<dt className={DETAIL_LABEL}>Budget</dt>
					<dd className={DETAIL_VALUE}>{lead.budget}</dd>
				</div>
				<div>
					<dt className={DETAIL_LABEL}>Buying Purpose</dt>
					<dd className={DETAIL_VALUE}>{lead.buyingPurpose}</dd>
				</div>
				<div>
					<dt className={DETAIL_LABEL}>Preferred Plan</dt>
					<dd className={DETAIL_VALUE}>{lead.preferredPlan}</dd>
				</div>
			</dl>
			{lead.message ? (
				<div className="mt-4 border-t border-stone-100 pt-4">
					<dt className={`${DETAIL_LABEL} mb-1`}>Message</dt>
					<p className="text-sm leading-relaxed text-stone-600">
						{lead.message}
					</p>
				</div>
			) : null}
		</div>
	);
}
