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
const url =
	process.env.DIRECT_URL ??
	process.env.DATABASE_URL

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