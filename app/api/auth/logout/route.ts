// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/server";

export async function POST() {
	try {
		const supabase = await createSupabaseServerClient();
		await supabase.auth.signOut();
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("POST /api/auth/logout error:", error);
		return NextResponse.json({ error: "Logout failed" }, { status: 500 });
	}
}
