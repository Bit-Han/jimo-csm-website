// // //@lib/db/queries/insights
// import { asc, desc, eq } from "drizzle-orm";
// import { cache } from "react";
// import { db } from "@/lib/db";
// import { insights, adminUsers } from "@/lib/db/schema";
// import { mapInsightRowToDetail, mapInsightRowToSummary } from "@/lib/db/mappers/insights";
// import type { InsightDetail, InsightSummary } from "@/lib/types/insight";
// import type { AdminArticleListRow, AuthorOption } from "@/lib/types/admin/article";

// // ─── Public ───────────────────────────────────────────────────────────────

// export async function getPublishedInsights(): Promise<InsightSummary[]> {
//   const rows = await db.query.insights.findMany({
//     where: eq(insights.publishStatus, "published"),
//     orderBy: [desc(insights.publishedAt)],
//   });
//   return rows.map(mapInsightRowToSummary);
// }

// export async function getPublishedInsightBySlug(slug: string): Promise<InsightDetail | null> {
//   const row = await db.query.insights.findFirst({ where: eq(insights.slug, slug) });
//   if (!row) return null;
//   return mapInsightRowToDetail(row);
// }

// export async function getPublishedInsightSlugs(): Promise<string[]> {
//   const rows = await db.select({ slug: insights.slug }).from(insights).where(eq(insights.publishStatus, "published"));
//   return rows.map((r) => r.slug);
// }

// // ─── Admin ────────────────────────────────────────────────────────────────

// export async function getAdminArticleRows(): Promise<AdminArticleListRow[]> {
//   const rows = await db.query.insights.findMany({ orderBy: [desc(insights.updatedAt)] });

//   return rows.map((row) => ({
//     id: row.id,
//     slug: row.slug,
//     title: row.title,
//     categoryLabel: row.categoryLabel,
//     relatedProjectName: row.relatedProjectName,
//     publishStatus: row.publishStatus as "draft" | "published",
//     seoStatus: row.seoTitle && row.seoDescription ? ("good" as const) : ("needs-attention" as const),
//     seoStatusNote: row.seoTitle && row.seoDescription ? "Good" : "Needs attention",
//     readTimeMinutes: row.readTimeMinutes,
//   }));
// }

// // The edit page and generateMetadata both need this row. React's request cache
// // makes those consumers share one query during a single navigation.
// export const getAdminArticleEditorState = cache(async (slug: string) => {
//   return db.query.insights.findFirst({ where: eq(insights.slug, slug) });
// });

// /** For the author picker in the article editor — limited to active admins. */
// export async function getActiveAdminUsersForAuthorSelect(): Promise<AuthorOption[]> {
//   const rows = await db
//     .select({ id: adminUsers.id, fullName: adminUsers.fullName, avatarUrl: adminUsers.avatarUrl, role: adminUsers.role })
//     .from(adminUsers)
//     .where(eq(adminUsers.status, "active"))
//     .orderBy(asc(adminUsers.fullName));

//   return rows.map((r) => ({ id: r.id, fullName: r.fullName, avatarUrl: r.avatarUrl, role: r.role }));
// }


// lib/db/queries/insights.ts
import { asc, desc, eq } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/lib/db";
import { insights, adminUsers } from "@/lib/db/schema";
import { mapInsightRowToDetail, mapInsightRowToSummary } from "@/lib/db/mappers/insights";
import { withTimeout } from "@/lib/utils/timeout";
import type { InsightDetail, InsightSummary } from "@/lib/types/insight";
import type { AdminArticleListRow, AuthorOption } from "@/lib/types/admin/article";

const DB_TIMEOUT_MS = 8000;

// ─── Public ───────────────────────────────────────────────────────────────

export async function getPublishedInsights(): Promise<InsightSummary[]> {
  const rows = await withTimeout(
    db.query.insights.findMany({
      where: eq(insights.publishStatus, "published"),
      orderBy: [desc(insights.publishedAt)],
    }),
    DB_TIMEOUT_MS,
    "getPublishedInsights",
  );
  return rows.map(mapInsightRowToSummary);
}

export async function getPublishedInsightBySlug(slug: string): Promise<InsightDetail | null> {
  const row = await withTimeout(
    db.query.insights.findFirst({ where: eq(insights.slug, slug) }),
    DB_TIMEOUT_MS,
    "getPublishedInsightBySlug",
  );
  if (!row) return null;
  return mapInsightRowToDetail(row);
}

export async function getPublishedInsightSlugs(): Promise<string[]> {
  const rows = await withTimeout(
    db.select({ slug: insights.slug }).from(insights).where(eq(insights.publishStatus, "published")),
    DB_TIMEOUT_MS,
    "getPublishedInsightSlugs",
  );
  return rows.map((r) => r.slug);
}

// ─── Admin ────────────────────────────────────────────────────────────────

export async function getAdminArticleRows(): Promise<AdminArticleListRow[]> {
  const rows = await withTimeout(
    db.query.insights.findMany({ orderBy: [desc(insights.updatedAt)] }),
    DB_TIMEOUT_MS,
    "getAdminArticleRows",
  );

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    categoryLabel: row.categoryLabel,
    relatedProjectName: row.relatedProjectName,
    publishStatus: row.publishStatus as "draft" | "published",
    seoStatus: row.seoTitle && row.seoDescription ? ("good" as const) : ("needs-attention" as const),
    seoStatusNote: row.seoTitle && row.seoDescription ? "Good" : "Needs attention",
    readTimeMinutes: row.readTimeMinutes,
  }));
}

export const getAdminArticleEditorState = cache(async (slug: string) => {
  return withTimeout(
    db.query.insights.findFirst({ where: eq(insights.slug, slug) }),
    DB_TIMEOUT_MS,
    "getAdminArticleEditorState",
  );
});

/** For the author picker in the article editor — limited to active admins. */
export async function getActiveAdminUsersForAuthorSelect(): Promise<AuthorOption[]> {
  const rows = await withTimeout(
    db
      .select({ id: adminUsers.id, fullName: adminUsers.fullName, avatarUrl: adminUsers.avatarUrl, role: adminUsers.role })
      .from(adminUsers)
      .where(eq(adminUsers.status, "active"))
      .orderBy(asc(adminUsers.fullName)),
    DB_TIMEOUT_MS,
    "getActiveAdminUsersForAuthorSelect",
  );

  return rows.map((r) => ({ id: r.id, fullName: r.fullName, avatarUrl: r.avatarUrl, role: r.role }));
}