import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
	var __dbClient: postgres.Sql | undefined;
}

function createClient() {
	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) {
		throw new Error("DATABASE_URL environment variable is not set.");
	}

	const isProduction = process.env.NODE_ENV === "production";
	const databaseHost = new URL(databaseUrl).hostname;
	const isSupabaseConnection = databaseHost.endsWith(".supabase.com");

	return postgres(databaseUrl, {
		// Serverless prod (Vercel): each function instance gets its own process,
		// so keep this at 1 — Supabase's pooler multiplies this by however many
		// instances are running concurrently.
		// Dev (`next dev`) uses a larger local pool so independent requests do
		// not wait behind one another.
		max: isProduction ? 3 : 10,

		prepare: false, // required for Supabase pgbouncer in transaction mode
		// Supabase pooler endpoints require TLS. The local DATABASE_URL omits
		// `sslmode=require`, so enforce it here without affecting non-Supabase
		// development databases.
		...(isSupabaseConnection ? { ssl: "require" as const } : {}),

		// Without these, a connection that silently dies (pooler-side idle
		// drop, network blip) sits in the pool looking "available" forever,
		// and every query after it hangs until you restart the server.
		idle_timeout: 20, // seconds — close connections idle this long
		// max_lifetime: 60 * 30, // seconds — recycle connections every 30 min regardless
		connect_timeout: 10, // seconds — fail fast if Postgres is unreachable, don't hang
		max_lifetime: 60 * 30,
		connection: {
			statement_timeout: 8000, // ms
		},
		onnotice: () => {}, // suppress noisy Postgres NOTICE logs in dev
	});
}

const client = globalThis.__dbClient ?? createClient();

if (process.env.NODE_ENV !== "production") {
	globalThis.__dbClient = client;
}

export const db = drizzle(client, { schema });
export type Db = typeof db;
