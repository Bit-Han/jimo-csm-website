"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import type { AdminBadgeVariant } from "@/components/admin/ui/AdminBadge";
import { publishCompanyPage } from "@/lib/actions/admin/company-pages";
import { cn } from "@/lib/utils/helpers";
import type {
  AdminCompanyPageListRow,
  CompanyPageSeoStatus,
} from "@/lib/types/admin/company-pages";

const PUBLISH_BADGE: Record<string, AdminBadgeVariant> = {
  published: "published",
  draft: "draft",
};

const SEO_LABEL: Record<
  CompanyPageSeoStatus,
  { label: string; cls: string }
> = {
  good: { label: "Good", cls: "text-emerald-600" },
  "needs-seo": { label: "Needs SEO", cls: "text-orange-500" },
};

export function CompanyPagesExplorer({
  pages,
}: {
  pages: AdminCompanyPageListRow[];
}) {
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handlePublish(slug: string) {
    startTransition(async () => {
      const result = await publishCompanyPage(slug);
      if (result.success) setPublishedSlug(slug);
    });
  }

  return (
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
            {pages.map((page) => {
              const isPublished =
                page.publishStatus === "published" ||
                publishedSlug === page.slug;
              const seo = SEO_LABEL[page.seoStatus];

              return (
                <tr
                  key={page.slug}
                  className="border-b border-stone-100 transition-colors last:border-none hover:bg-stone-50"
                >
                  <td className="px-6 py-4 font-semibold text-ink-950">
                    {page.title}
                  </td>
                  <td className="px-6 py-4 text-stone-600">{page.type}</td>
                  <td className="px-6 py-4 text-stone-600">{page.related}</td>
                  <td className="px-6 py-4">
                    <AdminBadge
                      variant={
                        PUBLISH_BADGE[
                          isPublished ? "published" : page.publishStatus
                        ] ?? "draft"
                      }
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn("text-sm font-semibold", seo.cls)}
                    >
                      {seo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/company-pages/${page.slug}/edit`}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        Edit
                      </Link>
                      {isPublished && page.hasPreview ? (
                        <Link
                          href={`/${page.slug === "home" ? "" : page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-ink-950"
                        >
                          Preview
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handlePublish(page.slug)}
                          disabled={isPending}
                          className="text-sm font-medium text-stone-500 hover:text-ink-950 disabled:opacity-50"
                        >
                          Publish
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}