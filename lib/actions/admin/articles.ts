"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { insights } from "@/lib/db/schema";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import type { ArticleEditorState } from "@/lib/types/admin/article";

export interface ArticleActionResult {
  success: boolean;
  message: string;
  slug?: string;
}

function buildSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function upsertInsight(
  state: ArticleEditorState,
  publishStatus: "draft" | "published",
): Promise<string> {
  const slug = state.slug || buildSlug(state.title);

  const values = {
    slug,
    title: state.title,
    category: state.category,
    categoryLabel: state.categoryLabel,
    excerpt: state.excerpt,
    body: state.body.filter(Boolean),
    coverImageSrc: state.coverImageSrc || null,
    coverImageAlt: state.coverImageAlt,
    relatedProjectSlug: state.relatedProjectSlug || null,
    relatedProjectName: state.relatedProjectName || null,
    readTimeMinutes: state.readTimeMinutes,
    publishedAt:
      publishStatus === "published"
        ? state.publishedAt
          ? new Date(state.publishedAt)
          : new Date()
        : state.publishedAt
          ? new Date(state.publishedAt)
          : null,
    seoTitle: state.seoTitle || null,
    seoDescription: state.seoDescription || null,
    publishStatus,
    updatedAt: new Date(),
  };

  const existing = state.slug
    ? await db.query.insights.findFirst({
        where: eq(insights.slug, state.slug),
      })
    : null;

  if (existing) {
    await db.update(insights).set(values).where(eq(insights.id, existing.id));
  } else {
    await db.insert(insights).values(values);
  }

  return slug;
}

export async function saveDraftArticle(
  state: ArticleEditorState,
): Promise<ArticleActionResult> {
  try {
    const adminUser = await getAdminUser();
    if (!adminUser) return { success: false, message: "Not authenticated." };

    if (!state.title.trim()) {
      return { success: false, message: "Article title is required." };
    }

    const slug = await upsertInsight(state, "draft");

    revalidatePath("/admin/news-insights", "layout");

    return { success: true, message: "Draft saved.", slug };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    console.error("[saveDraftArticle]", message);
    return { success: false, message };
  }
}

export async function publishArticle(
  state: ArticleEditorState,
): Promise<ArticleActionResult> {
  try {
    const adminUser = await getAdminUser();
    if (!adminUser) return { success: false, message: "Not authenticated." };

    if (!state.title.trim()) {
      return { success: false, message: "Article title is required before publishing." };
    }
    if (!state.excerpt.trim()) {
      return { success: false, message: "An excerpt is required before publishing." };
    }

    const slug = await upsertInsight(state, "published");

    revalidatePath("/insights", "layout");
    revalidatePath(`/insights/${slug}`);
    revalidatePath("/admin/news-insights", "layout");

    return { success: true, message: "Article published.", slug };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    console.error("[publishArticle]", message);
    return { success: false, message };
  }
}

export async function deleteArticle(
  slug: string,
): Promise<ArticleActionResult> {
  try {
    const adminUser = await getAdminUser();
    if (!adminUser) return { success: false, message: "Not authenticated." };

    const existing = await db.query.insights.findFirst({
      where: eq(insights.slug, slug),
    });

    if (!existing) {
      return { success: false, message: "Article not found." };
    }

    await db.delete(insights).where(eq(insights.id, existing.id));

    revalidatePath("/insights", "layout");
    revalidatePath("/admin/news-insights", "layout");

    return { success: true, message: `"${existing.title}" deleted.` };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    return { success: false, message };
  }
}