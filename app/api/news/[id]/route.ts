// app/api/news/[id]/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	ok,
	notFound,
	noContent,
	unauthorized,
	forbidden,
	serverError,
} from "@/lib/utils/api-response";
import {
	getArticleById,
	updateArticle,
	publishArticle,
	deleteArticle,
} from "@/lib/services/articles.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "view_articles")) return forbidden();
		const { id } = await params;
		const article = await getArticleById(id);
		if (!article) return notFound("Article not found.");
		return ok(article);
	} catch (err) {
		return serverError("Failed to load article.", err);
	}
}

export async function PUT(req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "edit_articles")) return forbidden();
		const { id } = await params;
		const body = await req.json();
		// Special action: publish
		if (body._action === "publish") {
			const published = await publishArticle(id);
			if (!published) return notFound("Article not found.");
			return ok(published);
		}
		const updated = await updateArticle(id, body);
		if (!updated) return notFound("Article not found.");
		return ok(updated);
	} catch (err) {
		return serverError("Failed to update article.", err);
	}
}

export async function DELETE(_req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "edit_articles")) return forbidden();
		const { id } = await params;
		await deleteArticle(id);
		return noContent();
	} catch (err) {
		return serverError("Failed to delete article.", err);
	}
}
