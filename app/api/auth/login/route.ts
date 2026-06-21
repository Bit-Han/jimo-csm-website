// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { loginSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const parsed = loginSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{
					error: "Invalid credentials",
					issues: parsed.error.flatten().fieldErrors,
				},
				{ status: 400 },
			);
		}

		const supabase = await createSupabaseServerClient();
		const { data, error } = await supabase.auth.signInWithPassword({
			email: parsed.data.email,
			password: parsed.data.password,
		});

		if (error || !data.user) {
			return NextResponse.json(
				{ error: "Invalid email or password" },
				{ status: 401 },
			);
		}

		// Check user exists in DB and is active
		const [dbUser] = await db
			.select({
				id: users.id,
				name: users.name,
				role: users.role,
				status: users.status,
			})
			.from(users)
			.where(eq(users.supabaseId, data.user.id))
			.limit(1);

		if (!dbUser) {
			await supabase.auth.signOut();
			return NextResponse.json(
				{ error: "Account not found. Please contact your administrator." },
				{ status: 403 },
			);
		}

		if (dbUser.status === "inactive" || dbUser.status === "suspended") {
			await supabase.auth.signOut();
			return NextResponse.json(
				{
					error:
						"Your account has been deactivated. Please contact your administrator.",
				},
				{ status: 403 },
			);
		}

		if (dbUser.status === "pending") {
			// First login — activate user
			await db
				.update(users)
				.set({ status: "active", lastActiveAt: new Date() })
				.where(eq(users.id, dbUser.id));
		}

		return NextResponse.json({
			data: {
				user: { id: dbUser.id, name: dbUser.name, role: dbUser.role },
				session: data.session,
			},
		});
	} catch (error) {
		console.error("POST /api/auth/login error:", error);
		return NextResponse.json(
			{ error: "Authentication failed" },
			{ status: 500 },
		);
	}
}
