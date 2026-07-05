"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ExternalLink, Search } from "lucide-react";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import type { AdminBadgeVariant } from "@/components/admin/ui/AdminBadge";
import { UploadBrochureModal } from "./UploadBrochureModal";
import { publishBrochure } from "@/lib/actions/admin/brochure";
import { cn } from "@/lib/utils/helpers";
import type {
  AdminBrochureListRow,
  BrochureFilterState,
  BrochureStatus,
} from "@/lib/types/admin/brochure";

const STATUS_BADGE: Record<BrochureStatus, AdminBadgeVariant> = {
  active: "active",
  draft: "draft",
};

const STATUS_OPTIONS = [
  { value: "all", label: "Status — All" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
];

const selectCn =
  "rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20";

export interface BrochuresExplorerProps {
  brochures: AdminBrochureListRow[];
}

type ModalState =
  | { open: false }
  | { open: true; mode: "upload" }
  | { open: true; mode: "replace"; id: string; title: string };

export function BrochuresExplorer({ brochures }: BrochuresExplorerProps) {
  const [filters, setFilters] = useState<BrochureFilterState>({
    search: "",
    status: "all",
    sort: "newest",
  });

  const [modal, setModal] = useState<ModalState>({ open: false });
  const [isPending, startTransition] = useTransition();
  const [publishedId, setPublishedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return brochures.filter((b) => {
      const matchSearch =
        !filters.search ||
        b.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        b.relatedProject.toLowerCase().includes(filters.search.toLowerCase());
      const matchStatus = filters.status === "all" || b.status === filters.status;
      return matchSearch && matchStatus;
    });
  }, [brochures, filters]);

  function handlePublish(id: string) {
    startTransition(async () => {
      const result = await publishBrochure(id);
      if (result.success) {
        setPublishedId(id);
      }
    });
  }

  return (
    <>
      {modal.open ? (
        <UploadBrochureModal
          mode={modal.mode}
          replacingId={modal.mode === "replace" ? modal.id : undefined}
          replacingTitle={modal.mode === "replace" ? modal.title : undefined}
          onClose={() => setModal({ open: false })}
        />
      ) : null}

      <div className="space-y-4">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) =>
                setFilters((p) => ({ ...p, search: e.target.value }))
              }
              className="rounded-lg border border-stone-200 bg-white py-2 pl-9 pr-4 text-sm placeholder:text-stone-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((p) => ({ ...p, status: e.target.value }))
            }
            className={selectCn}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={filters.sort}
            onChange={(e) =>
              setFilters((p) => ({
                ...p,
                sort: e.target.value as BrochureFilterState["sort"],
              }))
            }
            className={selectCn}
          >
            <option value="newest">Date — Newest</option>
            <option value="oldest">Date — Oldest</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/60">
                  {["Title", "Type", "Related", "Status", "SEO / CRM", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-stone-500"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-sm text-stone-400"
                    >
                      No brochures match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((brochure) => (
                    <tr
                      key={brochure.id}
                      className="border-b border-stone-100 transition-colors last:border-none hover:bg-stone-50"
                    >
                      <td className="px-6 py-4 font-semibold text-ink-950">
                        {brochure.title}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs uppercase tracking-wide text-stone-600">
                        {brochure.fileType}
                      </td>
                      <td className="px-6 py-4 text-stone-600">
                        {brochure.relatedProject}
                      </td>
                      <td className="px-6 py-4">
                        <AdminBadge
                          variant={
                            publishedId === brochure.id
                              ? "active"
                              : STATUS_BADGE[brochure.status]
                          }
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            brochure.leadsCount !== null
                              ? "text-emerald-600"
                              : "text-amber-600",
                          )}
                        >
                          {brochure.leadsCount !== null
                            ? `${brochure.leadsCount} leads captured`
                            : brochure.statusNote}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {brochure.status === "active" ||
                          publishedId === brochure.id ? (
                            <>
                             <Link 
                                href={brochure.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-ink-950"
                              >
                                Preview
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                              <button
                                type="button"
                                onClick={() =>
                                  setModal({
                                    open: true,
                                    mode: "replace",
                                    id: brochure.id,
                                    title: brochure.title,
                                  })
                                }
                                className="text-sm font-medium text-red-600 hover:text-red-700"
                              >
                                Replace
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  setModal({
                                    open: true,
                                    mode: "replace",
                                    id: brochure.id,
                                    title: brochure.title,
                                  })
                                }
                                className="text-sm font-medium text-stone-600 hover:text-ink-950"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handlePublish(brochure.id)}
                                disabled={isPending}
                                className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                              >
                                Publish
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}