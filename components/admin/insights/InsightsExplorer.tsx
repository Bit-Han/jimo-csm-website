"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import type { AdminBadgeVariant } from "@/components/admin/ui/AdminBadge";
import { cn } from "@/lib/utils/helpers";
import type {
  AdminArticleListRow,
  ArticleFilterState,
  ArticlePublishStatus,
  ArticleSeoStatus,
} from "@/lib/types/admin/article";

const PUBLISH_BADGE: Record<ArticlePublishStatus, AdminBadgeVariant> = {
  published: "published",
  draft: "draft",
};

const SEO_STATUS_CONFIG: Record<ArticleSeoStatus, { label: string; className: string }> = {
  good: { label: "Good", className: "text-emerald-600" },
  "needs-attention": {
    label: "Needs attention",
    className: "text-orange-500",
  },
  "needs-internal-links": {
    label: "Needs internal links",
    className: "text-orange-500",
  },
};

const STATUS_OPTIONS = [
  { value: "all", label: "Status — All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

const TYPE_OPTIONS = [
  { value: "all", label: "Type — All" },
  { value: "Location Analysis", label: "Location Analysis" },
  { value: "Investment Education", label: "Investment Education" },
  { value: "Project Update", label: "Project Update" },
];

const selectCn =
  "rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20";

export function InsightsExplorer({ articles }: { articles: AdminArticleListRow[] }) {
  const [filters, setFilters] = useState<ArticleFilterState>({
    search: "",
    status: "all",
    type: "all",
    sort: "newest",
  });

  const filtered = useMemo(() => {
    let rows = articles.filter((a) => {
      const matchSearch =
        !filters.search ||
        a.title.toLowerCase().includes(filters.search.toLowerCase());
      const matchStatus =
        filters.status === "all" || a.publishStatus === filters.status;
      const matchType =
        filters.type === "all" || a.categoryLabel === filters.type;
      return matchSearch && matchStatus && matchType;
    });

    if (filters.sort === "oldest") {
      rows = [...rows].reverse();
    }

    return rows;
  }, [articles, filters]);

  function set<K extends keyof ArticleFilterState>(
    key: K,
    value: ArticleFilterState[K],
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
            className="rounded-lg border border-stone-200 bg-white py-2 pl-9 pr-4 text-sm placeholder:text-stone-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => set("status", e.target.value)}
          className={selectCn}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={filters.type}
          onChange={(e) => set("type", e.target.value)}
          className={selectCn}
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={filters.sort}
          onChange={(e) =>
            set("sort", e.target.value as ArticleFilterState["sort"])
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
          <table className="w-full min-w-[680px] text-left text-sm">
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
                    No articles match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((article) => {
                  const seoConfig = SEO_STATUS_CONFIG[article.seoStatus];
                  return (
                    <tr
                      key={article.id}
                      className="border-b border-stone-100 transition-colors last:border-none hover:bg-stone-50"
                    >
                      <td className="px-6 py-4 font-semibold text-ink-950">
                        {article.title}
                      </td>
                      <td className="px-6 py-4 text-stone-600">
                        {article.categoryLabel}
                      </td>
                      <td className="px-6 py-4 text-stone-600">
                        {article.relatedProjectName ?? (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <AdminBadge
                          variant={PUBLISH_BADGE[article.publishStatus]}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "text-sm font-semibold",
                            seoConfig.className,
                          )}
                        >
                          {seoConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/news-insights/${article.slug}/edit`}
                          className="text-sm font-medium text-red-600 hover:text-red-700"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}