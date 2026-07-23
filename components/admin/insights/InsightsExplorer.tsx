

// components/admin/insights/InsightsExplorer.tsx
"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, MoreVertical, Search, Trash2 } from "lucide-react";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import type { AdminBadgeVariant } from "@/components/admin/ui/AdminBadge";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { deleteArticle, unpublishArticle } from "@/lib/actions/admin/articles";
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
  "needs-attention": { label: "Needs attention", className: "text-orange-500" },
  "needs-internal-links": { label: "Needs internal links", className: "text-orange-500" },
};

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

const TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "Location Analysis", label: "Location Analysis" },
  { value: "Investment Education", label: "Investment Education" },
  { value: "Project Update", label: "Project Update" },
];

const selectCn =
  "rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20";

const MENU_WIDTH = 176; // px — matches w-44

// Rendered via portal into document.body rather than absolutely positioned
// inside the row — a menu positioned inside the table's overflow-x-auto
// wrapper can get silently clipped by the vertical overflow that CSS forces
// alongside horizontal auto-scroll. Real screen coordinates sidestep that
// entirely, and it works identically for the mobile card layout too.
function RowMenu({
  article,
  onUnpublish,
  onDelete,
  busy,
}: {
  article: AdminArticleListRow;
  onUnpublish: () => void;
  onDelete: () => void;
  busy: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function computeCoords() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCoords({
      top: rect.bottom + window.scrollY + 4,
      left: Math.max(8, rect.right + window.scrollX - MENU_WIDTH),
    });
  }

  function toggle() {
    if (open) {
      setOpen(false);
      return;
    }
    computeCoords();
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function reposition() {
      computeCoords();
    }
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        disabled={busy}
        aria-label="More actions"
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-ink-950 disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
      </button>

      {open && coords
        ? createPortal(
            <>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-40"
              />
              <div
                style={{ position: "absolute", top: coords.top, left: coords.left, width: MENU_WIDTH }}
                className="z-50 overflow-hidden rounded-xl border border-stone-200 bg-white py-1 shadow-lg"
              >
                {article.publishStatus === "published" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onUnpublish();
                    }}
                    className="flex w-full px-3 py-2 text-left text-xs font-medium text-amber-600 hover:bg-amber-50"
                  >
                    Unpublish
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onDelete();
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </>,
            document.body,
          )
        : null}
    </div>
  );
}

export function InsightsExplorer({ articles: initialArticles }: { articles: AdminArticleListRow[] }) {
  const router = useRouter();
  const [articles, setArticles] = useState(initialArticles);
  const [filters, setFilters] = useState<ArticleFilterState>({
    search: "",
    status: "all",
    type: "all",
    sort: "newest",
  });
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AdminArticleListRow | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    let rows = articles.filter((a) => {
      const matchSearch = !filters.search || a.title.toLowerCase().includes(filters.search.toLowerCase());
      const matchStatus = filters.status === "all" || a.publishStatus === filters.status;
      const matchType = filters.type === "all" || a.categoryLabel === filters.type;
      return matchSearch && matchStatus && matchType;
    });
    if (filters.sort === "oldest") rows = [...rows].reverse();
    return rows;
  }, [articles, filters]);

  function set<K extends keyof ArticleFilterState>(key: K, value: ArticleFilterState[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function handleUnpublish(article: AdminArticleListRow) {
    setBusyId(article.id);
    startTransition(async () => {
      const result = await unpublishArticle(article.slug);
      if (result.success) {
        setArticles((prev) => prev.map((a) => (a.id === article.id ? { ...a, publishStatus: "draft" } : a)));
      }
      setBusyId(null);
    });
  }

  function handleConfirmDelete() {
    if (!confirmDelete) return;
    setBusyId(confirmDelete.id);
    startTransition(async () => {
      const result = await deleteArticle(confirmDelete.slug);
      if (result.success) setArticles((prev) => prev.filter((a) => a.id !== confirmDelete.id));
      setConfirmDelete(null);
      setBusyId(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-auto">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
            className="w-full rounded-lg border border-stone-200 bg-white py-2 pl-9 pr-4 text-sm placeholder:text-stone-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 sm:w-56"
          />
        </div>
        <select value={filters.status} onChange={(e) => set("status", e.target.value)} className={selectCn}>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select value={filters.type} onChange={(e) => set("type", e.target.value)} className={selectCn}>
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={filters.sort}
          onChange={(e) => set("sort", e.target.value as ArticleFilterState["sort"])}
          className={selectCn}
        >
          <option value="newest">Date — Newest</option>
          <option value="oldest">Date — Oldest</option>
        </select>
      </div>

      {/* Mobile — stacked cards below md */}
      <div className="space-y-3 md:hidden">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-10 text-center text-sm text-stone-400">
            No articles match your filters.
          </div>
        ) : (
          filtered.map((article) => {
            const seoConfig = SEO_STATUS_CONFIG[article.seoStatus];
            return (
              <div key={article.id} className="rounded-2xl border border-stone-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink-950">{article.title}</p>
                    <p className="mt-0.5 text-xs text-stone-500">{article.categoryLabel}</p>
                  </div>
                  <AdminBadge variant={PUBLISH_BADGE[article.publishStatus]} />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
                  {article.relatedProjectName ? (
                    <span>
                      Related: <span className="text-stone-700">{article.relatedProjectName}</span>
                    </span>
                  ) : null}
                  <span className={cn("font-semibold", seoConfig.className)}>{seoConfig.label}</span>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-3">
                  <Link
                    href={`/admin/news-insights/${article.slug}/edit`}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Edit
                  </Link>
                  <RowMenu
                    article={article}
                    busy={busyId === article.id && isPending}
                    onUnpublish={() => handleUnpublish(article)}
                    onDelete={() => setConfirmDelete(article)}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop — table from md up */}
      <div className="hidden overflow-hidden rounded-2xl border border-stone-200 bg-white md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/60">
                {["Title", "Type", "Related", "Status", "SEO / CRM", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-stone-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-stone-400">
                    No articles match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((article) => {
                  const seoConfig = SEO_STATUS_CONFIG[article.seoStatus];
                  return (
                    <tr key={article.id} className="border-b border-stone-100 transition-colors last:border-none hover:bg-stone-50">
                      <td className="px-6 py-4 font-semibold text-ink-950">{article.title}</td>
                      <td className="px-6 py-4 text-stone-600">{article.categoryLabel}</td>
                      <td className="px-6 py-4 text-stone-600">
                        {article.relatedProjectName ?? <span className="text-stone-400">—</span>}
                      </td>
                      <td className="px-6 py-4">
                        <AdminBadge variant={PUBLISH_BADGE[article.publishStatus]} />
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("text-sm font-semibold", seoConfig.className)}>{seoConfig.label}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/news-insights/${article.slug}/edit`}
                            className="text-sm font-medium text-red-600 hover:text-red-700"
                          >
                            Edit
                          </Link>
                          <RowMenu
                            article={article}
                            busy={busyId === article.id && isPending}
                            onUnpublish={() => handleUnpublish(article)}
                            onDelete={() => setConfirmDelete(article)}
                          />
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

      <ConfirmDialog
        open={confirmDelete !== null}
        title={confirmDelete ? `Delete "${confirmDelete.title}"?` : ""}
        description="This permanently deletes the article and its cover and inline images from Cloudinary. This can't be undone."
        confirmLabel="Delete permanently"
        variant="danger"
        isLoading={isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}