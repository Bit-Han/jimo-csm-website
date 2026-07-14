// import Link from "next/link";
// import { ArrowRight } from "lucide-react";
// import { AdminBadge } from "@/components/admin/ui/AdminBadge";
// import type { AdminBadgeVariant } from "@/components/admin/ui/AdminBadge";
// import type { LeadStatus, RecentEnquiry } from "@/lib/types/admin/dashboard";

// const statusVariant: Record<LeadStatus, AdminBadgeVariant> = {
// 	new: "new",
// 	contacted: "contacted",
// 	qualified: "qualified",
// 	inspection: "inspection",
// 	negotiation: "negotiation",
// };

// export interface RecentEnquiriesPanelProps {
// 	enquiries: RecentEnquiry[];
// }

// export function RecentEnquiriesPanel({ enquiries }: RecentEnquiriesPanelProps) {
// 	return (
// 		<div className="flex flex-col rounded-2xl border border-stone-200 bg-white">
// 			<div className="border-b border-stone-100 px-6 py-5">
// 				<h2 className="text-base font-bold text-ink-950">Recent Enquiries</h2>
// 			</div>

// 			<ul className="flex-1 divide-y divide-stone-100">
// 				{enquiries.map((enquiry) => (
// 					<li
// 						key={enquiry.id}
// 						className="flex items-center justify-between gap-3 px-6 py-4"
// 					>
// 						<div className="min-w-0">
// 							<p className="truncate text-sm font-semibold text-ink-950">
// 								{enquiry.name}
// 							</p>
// 							<p className="mt-0.5 truncate text-xs text-stone-500">
// 								{enquiry.projectAndBudget}
// 							</p>
// 						</div>
// 						<AdminBadge
// 							variant={statusVariant[enquiry.status]}
// 							className="shrink-0"
// 						/>
// 					</li>
// 				))}
// 			</ul>

// 			<div className="border-t border-stone-100 p-4">
// 				<Link
// 					href="/admin/leads"
// 					className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-900"
// 				>
// 					View all enquiries
// 					<ArrowRight className="h-4 w-4" />
// 				</Link>
// 			</div>
// 		</div>
// 	);
// }


import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import type { AdminBadgeVariant } from "@/components/admin/ui/AdminBadge";
import type { LeadStatus, RecentEnquiry } from "@/lib/types/admin/dashboard";

const STATUS_VARIANT: Record<LeadStatus, AdminBadgeVariant> = {
  new: "new",
  contacted: "contacted",
  qualified: "qualified",
  inspection: "inspection",
  negotiation: "negotiation",
};

export interface RecentEnquiriesPanelProps {
  enquiries: RecentEnquiry[];
}

export function RecentEnquiriesPanel({ enquiries }: RecentEnquiriesPanelProps) {
  if (enquiries.length === 0) {
    return (
      <div className="flex flex-col rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-100 px-6 py-5">
          <h2 className="text-base font-bold text-ink-950">Recent Enquiries</h2>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
          <p className="text-sm text-stone-400">
            No leads yet. They will appear here as visitors submit forms.
          </p>
        </div>
        <div className="border-t border-stone-100 p-4">
          <Link
            href="/admin/leads"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-900"
          >
            View all leads
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-2xl border border-stone-200 bg-white">
      <div className="border-b border-stone-100 px-6 py-5">
        <h2 className="text-base font-bold text-ink-950">Recent Enquiries</h2>
      </div>

      <ul className="flex-1 divide-y divide-stone-100">
        {enquiries.map((enquiry) => (
          <li
            key={enquiry.id}
            className="flex items-center justify-between gap-3 px-6 py-4"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-950">
                {enquiry.name}
              </p>
              <p className="mt-0.5 truncate text-xs text-stone-500">
                {enquiry.projectAndBudget}
              </p>
            </div>
            <AdminBadge
              variant={
                STATUS_VARIANT[enquiry.status as LeadStatus] ?? "new"
              }
              className="shrink-0"
            />
          </li>
        ))}
      </ul>

      <div className="border-t border-stone-100 p-4">
        <Link
          href="/admin/leads"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-900"
        >
          View all enquiries
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}