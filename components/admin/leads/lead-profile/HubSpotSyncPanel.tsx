"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine, Loader2, WifiOff } from "lucide-react";
import type { LeadDetail } from "@/lib/types/admin/lead";

export function HubSpotSyncPanel({ lead }: { lead: LeadDetail }) {
  const [pushPending, startPush] = useTransition();
  const [pullPending, startPull] = useTransition();
  const [pushResult, setPushResult] = useState<string | null>(null);
  const [pullResult, setPullResult] = useState<string | null>(null);

  // These call the real actions once HubSpot is connected.
  // Currently both return "not connected" — the UI makes this clear.
  async function handlePush() {
    startPush(async () => {
      const { syncCrm } = await import("@/lib/actions/admin/leads");
      const result = await syncCrm();
      setPushResult(result.message);
      setTimeout(() => setPushResult(null), 4000);
    });
  }

  async function handlePull() {
    startPull(async () => {
      // TODO (HubSpot integration): pull contact data from HubSpot by email
      // const contact = await hubspot.crm.contacts.basicApi.getById(...)
      // Then update the lead row in Supabase
      setPullResult("HubSpot not connected yet. Configure in Settings → CRM Integration.");
      setTimeout(() => setPullResult(null), 4000);
    });
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <WifiOff className="h-5 w-5 text-stone-400" />
        <div>
          <h2 className="text-sm font-bold text-ink-950">CRM Integration</h2>
          <p className="text-xs text-stone-400">
            HubSpot not connected. Connect it in{" "}
            <Link
              href="/admin/settings"
              className="font-medium text-red-600 hover:underline"
            >
              Settings → CRM Integration
            </Link>{" "}
            to enable two-way sync.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {/* Push to HubSpot */}
        <button
          type="button"
          onClick={handlePush}
          disabled={pushPending || pullPending}
          className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-stone-50 disabled:opacity-50"
        >
          {pushPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowUpFromLine className="h-4 w-4" />
          )}
          Push to HubSpot
        </button>

        {/* Pull from HubSpot */}
        <button
          type="button"
          onClick={handlePull}
          disabled={pushPending || pullPending}
          className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-stone-50 disabled:opacity-50"
        >
          {pullPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowDownToLine className="h-4 w-4" />
          )}
          Pull from HubSpot
        </button>
      </div>

      {/* Result message */}
      {(pushResult ?? pullResult) ? (
        <p className="mt-3 text-xs font-medium text-amber-600">
          {pushResult ?? pullResult}
        </p>
      ) : null}

      {/* What these buttons will do once connected */}
      <div className="mt-5 rounded-xl border border-stone-100 bg-stone-50 p-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
          Once connected
        </p>
        <div className="flex items-start gap-2 text-xs text-stone-500">
          <ArrowUpFromLine className="mt-0.5 h-3.5 w-3.5 shrink-0 text-stone-400" />
          <span>
            <strong className="font-semibold text-ink-950">Push to HubSpot</strong>
            {" "}— creates or updates a HubSpot contact with this lead&apos;s name, email,
            phone, project interest, budget, and source. Associates with the matching
            deal pipeline.
          </span>
        </div>
        <div className="flex items-start gap-2 text-xs text-stone-500">
          <ArrowDownToLine className="mt-0.5 h-3.5 w-3.5 shrink-0 text-stone-400" />
          <span>
            <strong className="font-semibold text-ink-950">Pull from HubSpot</strong>
            {" "}— fetches the latest contact record from HubSpot by email address and
            updates the lead status, notes, and last activity here. Useful after
            your sales team has worked a deal in HubSpot.
          </span>
        </div>
      </div>
    </div>
  );
}