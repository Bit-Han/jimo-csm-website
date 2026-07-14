// import type { LeadDetail } from "@/lib/types/admin/lead";

// const ROW_LABEL =
// 	"text-xs font-semibold uppercase tracking-wide text-stone-500";
// const ROW_VALUE = "mt-0.5 text-sm font-medium text-ink-950 font-mono";

// export function SourceTrackingPanel({ lead }: { lead: LeadDetail }) {
// 	return (
// 		<div className="rounded-2xl border border-stone-200 bg-white p-6">
// 			<h2 className="text-base font-bold text-ink-950">Source & Tracking</h2>
// 			<dl className="mt-4 space-y-3">
// 				<div>
// 					<dt className={ROW_LABEL}>Source Page</dt>
// 					<dd className={ROW_VALUE}>{lead.sourcePage}</dd>
// 				</div>
// 				{lead.utmSource ? (
// 					<div>
// 						<dt className={ROW_LABEL}>UTM Source</dt>
// 						<dd className={ROW_VALUE}>{lead.utmSource}</dd>
// 					</div>
// 				) : null}
// 				{lead.utmMedium ? (
// 					<div>
// 						<dt className={ROW_LABEL}>UTM Medium</dt>
// 						<dd className={ROW_VALUE}>{lead.utmMedium}</dd>
// 					</div>
// 				) : null}
// 				{lead.utmCampaign ? (
// 					<div>
// 						<dt className={ROW_LABEL}>UTM Campaign</dt>
// 						<dd className={ROW_VALUE}>{lead.utmCampaign}</dd>
// 					</div>
// 				) : null}
// 				<div>
// 					<dt className={ROW_LABEL}>Device</dt>
// 					<dd className={ROW_VALUE}>{lead.device}</dd>
// 				</div>
// 				<div>
// 					<dt className={ROW_LABEL}>Referrer</dt>
// 					<dd className={ROW_VALUE}>{lead.referrer}</dd>
// 				</div>
// 			</dl>
// 		</div>
// 	);
// }

import type { LeadDetail } from "@/lib/types/admin/lead";

const ROW_LABEL =
	"text-xs font-semibold uppercase tracking-wide text-stone-500";
const ROW_VALUE = "mt-0.5 text-sm font-medium text-ink-950 font-mono";

export function SourceTrackingPanel({ lead }: { lead: LeadDetail }) {
	return (
		<div className="rounded-2xl border border-stone-200 bg-white p-6">
			<h2 className="text-base font-bold text-ink-950">Source & Tracking</h2>
			<dl className="mt-4 space-y-3">
				<div>
					<dt className={ROW_LABEL}>Source</dt>
					<dd className={`${ROW_VALUE} capitalize`}>
						{lead.source.replace(/_/g, " ")}
					</dd>
				</div>
				<div>
					<dt className={ROW_LABEL}>Source Page</dt>
					<dd className={ROW_VALUE}>{lead.sourcePage || "—"}</dd>
				</div>
				{lead.enquiryType ? (
					<div>
						<dt className={ROW_LABEL}>Enquiry Type</dt>
						<dd className={`${ROW_VALUE} capitalize`}>
							{lead.enquiryType.replace(/-/g, " ")}
						</dd>
					</div>
				) : null}
				{lead.utmSource ? (
					<div>
						<dt className={ROW_LABEL}>UTM Source</dt>
						<dd className={ROW_VALUE}>{lead.utmSource}</dd>
					</div>
				) : null}
				{lead.utmMedium ? (
					<div>
						<dt className={ROW_LABEL}>UTM Medium</dt>
						<dd className={ROW_VALUE}>{lead.utmMedium}</dd>
					</div>
				) : null}
				{lead.utmCampaign ? (
					<div>
						<dt className={ROW_LABEL}>UTM Campaign</dt>
						<dd className={ROW_VALUE}>{lead.utmCampaign}</dd>
					</div>
				) : null}
			</dl>
		</div>
	);
}