// app/api/news/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	ok,
	created,
	unauthorized,
	forbidden,
	badRequest,
	serverError,
} from "@/lib/utils/api-response";
import { getArticles, createArticle } from "@/lib/services/articles.service";
import { parseIntParam } from "@/lib/utils/helpers";
import { z } from "zod";

const createArticleSchema = z.object({
	title: z.string().min(2),
	category: z.enum([
		"location_analysis",
		"investment_education",
		"project_update",
		"market_insight",
		"construction_update",
	]),
	projectId: z.string().uuid().optional(),
	content: z.record(z.unknown()).optional(),
	excerpt: z.string().optional(),
	featuredImageId: z.string().uuid().optional(),
	featuredImageUrl: z.string().optional(),
	status: z.enum(["published", "draft", "archived"]).default("draft"),
	metaTitle: z.string().max(60).optional(),
	metaDescription: z.string().max(160).optional(),
	focusKeyword: z.string().optional(),
});

export async function GET(req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "view_articles")) return forbidden();
		const { searchParams } = req.nextUrl;
		const { data, meta } = await getArticles(
			{
				search: searchParams.get("search") ?? undefined,
				status: searchParams.get("status") ?? undefined,
				category: searchParams.get("category") ?? undefined,
			},
			{ page: parseIntParam(searchParams.get("page"), 1) },
		);
		return ok(data, meta);
	} catch (err) {
		return serverError("Failed to load articles.", err);
	}
}

export async function POST(req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "edit_articles")) return forbidden();
		const body = await req.json();
		const parsed = createArticleSchema.safeParse(body);
		if (!parsed.success)
			return badRequest(parsed.error.issues[0]?.message ?? "Validation failed");
		const article = await createArticle(parsed.data, auth.profile.id);
		return created(article);
	} catch (err) {
		return serverError("Failed to create article.", err);
	}
}