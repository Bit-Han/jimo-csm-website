// lib/db/seed-client.ts
// ─────────────────────────────────────────────────────────────────────────────
// Direct Postgres connection for CLI seed scripts and migrations ONLY.
// Uses DIRECT_DATABASE_URL (port 5432) — NOT the pooler.
//
// Never import this in Next.js app code (API routes, server components).
// For app code, use lib/db/index.ts instead.
// ─────────────────────────────────────────────────────────────────────────────
// import "dotenv/config"; // loads .env by default

// // dotenv doesn't load .env.local by default — specify the path:
// import dotenv from "dotenv";
// import { resolve } from "path";

// dotenv.config({ path: resolve(process.cwd(), ".env.local") });


// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";
// import * as schema from "./schema";

// const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;


// console.log("=== SEED CONNECTION DEBUG ===");
// console.log(
// 	"DIRECT_URL:",
// 	process.env.DIRECT_URL ? "SET" : "NOT SET",
// );
// console.log("DATABASE_URL:", process.env.DATABASE_URL ? "SET" : "NOT SET");
// console.log("URL being used:", url?.replace(/:([^:@]{8})[^:@]*@/, ":****@")); // masks password
// console.log("Port in URL:", url?.match(/:(\d+)\//)?.[1] ?? "not found");
// console.log("=============================");

// if (!url) {
// 	throw new Error(
// 		"DIRECT_URL is not set. Add it to .env.local — " +
// 			"get the direct connection string (port 5432) from " +
// 			"Supabase Dashboard → Settings → Database → Connection string.",
// 	);
// }

// // Direct connection — no PgBouncer, no transaction pooling.
// // prepare: true is safe here because we are talking directly to Postgres.
// // max: 1 because seed scripts are single-process CLI tools.
// const client = postgres(url, {
// 	max: 1,
// 	prepare: true,
// 	idle_timeout: 20,
// 	connect_timeout: 30,
// 	onnotice: () => {},
// 	ssl: {
// 		rejectUnauthorized: false, // required for Supabase direct connection
// 	}, // suppress NOTICE messages from Postgres
// });

// export const seedDb = drizzle(client, { schema });

// // Explicitly close the connection when the script is done.
// // Call this at the end of your seed index.ts.
// export async function closeSeedDb() {
// 	await client.end();
// }


// lib/db/seed-client.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env") });

// Use DIRECT_URL if resolvable, otherwise fall back to pooler
// On some networks (Nigeria, corporate, VPN) the direct DB hostname
// is unresolvable — the pooler works everywhere
const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!url) {
  throw new Error("Neither DIRECT_URL nor DATABASE_URL is set in .env");
}

const isDirect = url.includes("db.") && url.includes(":5432");

console.log("=== SEED CONNECTION DEBUG ===");
console.log("Using:", isDirect ? "DIRECT (port 5432)" : "POOLER (port 6543)");
console.log("Host:", url.match(/@([^:]+)/)?.[1]);
console.log("Port:", url.match(/:(\d+)\//)?.[1]);
console.log("=============================");

const client = postgres(url, {
  max: 1,
  // prepare: false is required for pooler (PgBouncer transaction mode)
  // prepare: true would be ideal for direct but direct is unreachable
  prepare: false,
  idle_timeout: 20,
  connect_timeout: 30,
  onnotice: () => {},
});

export const seedDb = drizzle(client, { schema });

export async function closeSeedDb() {
  await client.end();
}