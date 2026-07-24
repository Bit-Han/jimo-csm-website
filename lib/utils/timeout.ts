// lib/utils/timeout.ts
/** Wrap any external call so a stalled network/DB operation fails loudly
 * and quickly instead of hanging until the platform's own outer timeout
 * (e.g. Vercel's 300s Hobby ceiling) is the only thing that stops it. */
export function withTimeout<T>(
	promise: Promise<T>,
	ms: number,
	label: string,
): Promise<T> {
	return Promise.race([
		promise,
		new Promise<T>((_, reject) =>
			setTimeout(
				() => reject(new Error(`${label} timed out after ${ms}ms`)),
				ms,
			),
		),
	]);
}
