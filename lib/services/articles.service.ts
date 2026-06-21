// lib/services/articles.service.ts
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq, ilike, sql, desc, and } from "drizzle-orm";
import { slugify, buildPaginationMeta } from "@/lib/utils/helpers";
import type { Article, PaginationParams } from "@/lib/types";

export type ArticleFilters = {
	search?: string;
	status?: string;
	category?: string;
	projectId?: string;
};

export async function getArticles(
	filters: ArticleFilters = {},
	pagination: PaginationParams = {},
) {
	const { page = 1, pageSize = 25 } = pagination;
	const offset = (page - 1) * pageSize;

	const conditions = [];
	if (filters.search)
		conditions.push(ilike(articles.title, `%${filters.search}%`));
	if (filters.status)
		conditions.push(eq(articles.status, filters.status as Article["status"]));
	if (filters.category)
		conditions.push(
			eq(articles.category, filters.category as Article["category"]),
		);
	if (filters.projectId)
		conditions.push(eq(articles.projectId, filters.projectId));

	const where = conditions.length ? and(...conditions) : undefined;

	const [{ total }] = await db
		.select({ total: sql<number>`count(*)::int` })
		.from(articles)
		.where(where);

	const rows = await db.query.articles.findMany({
		where,
		with: {
			project: { columns: { name: true } },
			author: { columns: { name: true } },
		},
		orderBy: [desc(articles.updatedAt)],
		limit: pageSize,
		offset,
	});

	return { data: rows, meta: buildPaginationMeta(total, page, pageSize) };
}

export async function getArticleById(id: string) {
	return (
		db.query.articles.findFirst({
			where: eq(articles.id, id),
			with: {
				project: { columns: { id: true, name: true } },
				featuredImage: { columns: { cloudinaryUrl: true, altText: true } },
				author: { columns: { id: true, name: true } },
			},
		}) ?? null
	);
}

export async function createArticle(
	input: {
		title: string;
		slug?: string;
		category: Article["category"];
		projectId?: string;
		content?: Record<string, unknown>;
		excerpt?: string;
		featuredImageId?: string;
		featuredImageUrl?: string;
		status?: Article["status"];
		metaTitle?: string;
		metaDescription?: string;
		focusKeyword?: string;
	},
	createdBy: string,
): Promise<Article> {
	const slug = input.slug ?? slugify(input.title);
	const existing = await db
		.select({ id: articles.id })
		.from(articles)
		.where(eq(articles.slug, slug))
		.limit(1);

	const finalSlug = existing.length
		? `${slug}-${Date.now().toString(36)}`
		: slug;

	const [article] = await db
		.insert(articles)
		.values({ ...input, slug: finalSlug, createdBy })
		.returning();

	return article;
}

export async function updateArticle(
	id: string,
	input: Partial<Parameters<typeof createArticle>[0]>,
): Promise<Article | null> {
	const [updated] = await db
		.update(articles)
		.set({ ...input, updatedAt: new Date() })
		.where(eq(articles.id, id))
		.returning();
	return updated ?? null;
}

export async function publishArticle(id: string): Promise<Article | null> {
	const [updated] = await db
		.update(articles)
		.set({
			status: "published",
			publishedAt: new Date(),
			updatedAt: new Date(),
		})
		.where(eq(articles.id, id))
		.returning();
	return updated ?? null;
}

export async function deleteArticle(id: string): Promise<void> {
	await db.delete(articles).where(eq(articles.id, id));
}
