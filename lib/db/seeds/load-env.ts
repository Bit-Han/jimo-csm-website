// lib/db/seeds/load-env.ts
// Import this file FIRST in any seed file that needs env vars.
// Uses raw fs read to bypass dotenvx "already set" skipping.
import { readFileSync } from "fs";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env");

try {
	const content = readFileSync(envPath, "utf-8");
	for (const line of content.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const eqIndex = trimmed.indexOf("=");
		if (eqIndex === -1) continue;
		const key = trimmed.slice(0, eqIndex).trim();
		const value = trimmed.slice(eqIndex + 1).trim();
		process.env[key] = value; // force overwrite
	}
} catch {
	// .env not found — ignore
}
