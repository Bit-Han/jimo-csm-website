// lib/utils/rate-limit.ts

// In-memory only — resets on cold start, not shared across serverless
// instances. Treat this as a speed bump against a single naive script, not
// a hard guarantee. For real protection once this matters more, swap in
// Upstash Redis (free tier, works fine from serverless/edge) — see below.

interface RateLimitRecord {
	count: number;
	windowReset: number;
}

const store = new Map<string, RateLimitRecord>();
const MAX_ENTRIES = 5000; // caps memory growth from one-off IPs

export function checkIpRateLimit(
	key: string,
	options: { limit: number; windowInSeconds: number },
): { success: boolean } {
	const now = Date.now();
	const record = store.get(key);

	if (!record || now > record.windowReset) {
		if (store.size >= MAX_ENTRIES) store.clear();
		store.set(key, {
			count: 1,
			windowReset: now + options.windowInSeconds * 1000,
		});
		return { success: true };
	}

	if (record.count >= options.limit) return { success: false };

	record.count += 1;
	return { success: true };
}

/*
Upstash upgrade path (recommended once traffic grows):

	import { Ratelimit } from "@upstash/ratelimit";
	import { Redis } from "@upstash/redis";

	const ratelimit = new Ratelimit({
		redis: Redis.fromEnv(),
		limiter: Ratelimit.slidingWindow(8, "60 s"),
	});
	const { success } = await ratelimit.limit(ip);

Needs UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN from a free Upstash
Redis database — no server to manage, shared across all instances correctly.
*/
