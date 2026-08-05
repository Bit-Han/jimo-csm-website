//@/lib/utils/with-query-time.ts
export class QueryTimeoutError extends Error {
	constructor(
		message = "The database took too long to respond. Please try again.",
	) {
		super(message);
		this.name = "QueryTimeoutError";
	}
}

/**
 * Bounds how long a page will wait on a database call. Important honest
 * limitation: this does NOT cancel the underlying query or free a stuck
 * connection — postgres.js has no clean way to abort an in-flight query.
 * It only stops the PAGE from waiting on it indefinitely, turning a
 * silent multi-minute hang into a fast, clear, catchable error.
 */
export async function withQueryTimeout<T>(
	promise: Promise<T>,
	ms = 15000,
): Promise<T> {
	let timer: ReturnType<typeof setTimeout>;
	const timeout = new Promise<never>((_, reject) => {
		timer = setTimeout(() => reject(new QueryTimeoutError()), ms);
	});

	try {
		return await Promise.race([promise, timeout]);
	} finally {
		clearTimeout(timer!);
	}
}
