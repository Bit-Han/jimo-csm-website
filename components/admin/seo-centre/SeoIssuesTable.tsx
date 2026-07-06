"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { dismissSeoIssue } from "@/lib/actions/admin/seo-centre";
import { cn } from "@/lib/utils/helpers";
import type {
  AdminSeoIssueRow,
  SeoIssueType,
} from "@/lib/types/admin/seo-centre";

const ISSUE_TYPE_CONFIG: Record<SeoIssueType, { label: string; className: string }> = {
  meta: { label: "Meta", className: "bg-orange-50 text-orange-600" },
  content: { label: "Content", className: "bg-blue-50 text-blue-600" },
  images: { label: "Images", className: "bg-blue-50 text-blue-600" },
  seo: { label: "SEO", className: "bg-orange-50 text-orange-600" },
  technical: { label: "Technical", className: "bg-red-50 text-red-600" },
};

const TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "Type — All" },
  { value: "meta", label: "Meta" },
  { value: "content", label: "Content" },
  { value: "images", label: "Images" },
  { value: "seo", label: "SEO" },
  { value: "technical", label: "Technical" },
];

export function SeoIssuesTable({ issues }: { issues: AdminSeoIssueRow[] }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return issues
      .filter((i) => !dismissed.has(i.id))
      .filter((i) => {
        const matchSearch =
          !search ||
          i.pageTitle.toLowerCase().includes(search.toLowerCase()) ||
          i.issue.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === "all" || i.issueType === typeFilter;
        return matchSearch && matchType;
      });
  }, [issues, search, typeFilter, dismissed]);

  function handleDismiss(id: string) {
    startTransition(async () => {
      await dismissSeoIssue(id);
      setDismissed((prev) => new Set([...prev, id]));
    });
  }

  return (
    <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search issues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-stone-200 bg-white py-2 pl-9 pr-4 text-sm placeholder:text-stone-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:border-red-600 focus:outline-none"
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-stone-100">
              {["Page", "Type", "Issue", "Focus Keyword", "Action"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500"
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
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-stone-400"
                >
                  No issues found.
                </td>
              </tr>
            ) : (
              filtered.map((issue) => {
                const typeConfig = ISSUE_TYPE_CONFIG[issue.issueType];
                return (
                  <tr
                    key={issue.id}
                    className="border-b border-stone-100 last:border-none hover:bg-stone-50"
                  >
                    <td className="px-4 py-4">
                      <p className="font-semibold text-ink-950">
                        {issue.pageTitle}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] text-stone-400">
                        {issue.pageUrl}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-semibold",
                          typeConfig.className,
                        )}
                      >
                        {typeConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-stone-600">{issue.issue}</td>
                    <td className="px-4 py-4 text-stone-600">
                      {issue.focusKeyword}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={issue.actionHref}
                          className="text-sm font-medium text-red-600 hover:text-red-700"
                        >
                          {issue.actionLabel}
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDismiss(issue.id)}
                          disabled={isPending}
                          className="text-xs text-stone-400 hover:text-stone-600 disabled:opacity-50"
                        >
                          Dismiss
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}