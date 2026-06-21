// lib/db/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// Drizzle client — single instance shared across the app.
// Uses the postgres package with `prepare: false` because Supabase uses
// PgBouncer transaction pooling which doesn't support prepared statements.
// ─────────────────────────────────────────────────────────────────────────────
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as relations from "./relations";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL environment variable is not set.");
}

// `prepare: false` is required for Supabase transaction pooler (pgbouncer)
const queryClient = postgres(process.env.DATABASE_URL, {
	prepare: false,
	// Supabase pooler supports max 10 concurrent connections on free tier
	max: 10,
});

export const db = drizzle(queryClient, {
	schema: { ...schema, ...relations },
	logger: process.env.NODE_ENV === "development",
});

export type Database = typeof db;
