// lib/utils/api-response.ts
// ─────────────────────────────────────────────────────────────────────────────
// Factory helpers so every API route returns a consistent JSON shape.
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import type { ApiResponse, PaginationMeta } from "@/lib/types";

export function ok<T>(
	data: T,
	meta?: PaginationMeta,
	status = 200,
): NextResponse<ApiResponse<T>> {
	return NextResponse.json({ success: true, data, meta }, { status });
}

export function created<T>(data: T): NextResponse<ApiResponse<T>> {
	return NextResponse.json({ success: true, data }, { status: 201 });
}

export function noContent(): NextResponse {
	return new NextResponse(null, { status: 204 });
}

export function badRequest(
	error: string,
	code?: string,
): NextResponse<ApiResponse> {
	return NextResponse.json({ success: false, error, code }, { status: 400 });
}

export function unauthorized(
	error = "Unauthorized",
): NextResponse<ApiResponse> {
	return NextResponse.json({ success: false, error }, { status: 401 });
}

export function forbidden(
	error = "You do not have permission to perform this action.",
): NextResponse<ApiResponse> {
	return NextResponse.json({ success: false, error }, { status: 403 });
}

export function notFound(
	error = "Resource not found.",
): NextResponse<ApiResponse> {
	return NextResponse.json({ success: false, error }, { status: 404 });
}

export function serverError(
	error = "An unexpected error occurred.",
	cause?: unknown,
): NextResponse<ApiResponse> {
	if (process.env.NODE_ENV === "development") {
		console.error("[SERVER_ERROR]", cause);
	}
	return NextResponse.json({ success: false, error }, { status: 500 });
}
