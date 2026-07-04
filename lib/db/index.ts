import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Singleton pattern prevents connection proliferation during Next.js hot reloads.
declare global {
	// eslint-disable-next-line no-var
	var __dbClient: postgres.Sql | undefined;
}

function createClient() {
	return postgres(process.env.DATABASE_URL!, {
		max: 1, // Supabase pooler handles the real pooling; keep this low.
		prepare: false, // Required for pgBouncer in transaction mode.
	});
}

const client = globalThis.__dbClient ?? createClient();

if (process.env.NODE_ENV !== "production") {
	globalThis.__dbClient = client;
}

export const db = drizzle(client, { schema });
export type Db = typeof db;