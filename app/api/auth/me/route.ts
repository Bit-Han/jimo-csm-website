// src/app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getUserPermissions } from "@/lib/permissions";

export async function GET() {
	try {
		const user = await getAuthUser();

		if (!user) {
			return NextResponse.json({ data: null }, { status: 401 });
		}

		const permissions = getUserPermissions(user.role);

		return NextResponse.json({
			data: { ...user, permissions },
		});
	} catch (error) {
		console.error("GET /api/auth/me error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch user" },
			{ status: 500 },
		);
	}
}
