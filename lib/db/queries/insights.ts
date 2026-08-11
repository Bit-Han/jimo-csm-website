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
	console.info("[admin:getAdminArticleRows] Loading admin article list");
  const rows = await withTimeout(
    db.query.insights.findMany({ orderBy: [desc(insights.updatedAt)] }),
    DB_TIMEOUT_MS,
    "getAdminArticleRows",
  );
	console.info(`[admin:getAdminArticleRows] Loaded ${rows.length} articles`);

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
	console.info(`[admin:getAdminArticleEditorState] Loading article editor state for slug: ${slug}`);
	const article = await withTimeout(
    db.query.insights.findFirst({ where: eq(insights.slug, slug) }),
    DB_TIMEOUT_MS,
    "getAdminArticleEditorState",
  );
	console.info(
		`[admin:getAdminArticleEditorState] ${article ? "Loaded" : "No article found for"} slug: ${slug}`,
	);
	return article;
});

/** For the author picker in the article editor — limited to active admins. */
export async function getActiveAdminUsersForAuthorSelect(): Promise<AuthorOption[]> {
	console.info("[admin:getActiveAdminUsersForAuthorSelect] Loading active admin authors");
  const rows = await withTimeout(
    db
      .select({ id: adminUsers.id, fullName: adminUsers.fullName, avatarUrl: adminUsers.avatarUrl, role: adminUsers.role })
      .from(adminUsers)
      .where(eq(adminUsers.status, "active"))
      .orderBy(asc(adminUsers.fullName)),
    DB_TIMEOUT_MS,
    "getActiveAdminUsersForAuthorSelect",
  );
	console.info(`[admin:getActiveAdminUsersForAuthorSelect] Loaded ${rows.length} active admin authors`);

  return rows.map((r) => ({ id: r.id, fullName: r.fullName, avatarUrl: r.avatarUrl, role: r.role }));
}
