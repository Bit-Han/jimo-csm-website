export class QueryTimeoutError extends Error {
	constructor(message = "Database query timed out.") {
		super(message);
		this.name = "QueryTimeoutError";
	}
}

/**
 * Executes a query with a strict server-side timeout.
 * Automatically triggers a PostgreSQL CANCEL command if the timeout is reached.
 */
export async function withQueryTimeout<T>(
	queryFactory: (signal: AbortSignal) => Promise<T>,
	ms = 8000,
): Promise<T> {
	const controller = new AbortController();

	const timeoutPromise = new Promise<never>((_, reject) => {
		const timer = setTimeout(() => {
			controller.abort(); // 💥 Closes the database socket pipeline instantly
			reject(new QueryTimeoutError());
		}, ms);

		// Clean up memory if the query beats the timeout
		controller.signal.addEventListener("abort", () => clearTimeout(timer));
	});

	try {
		// Pass the signal down into the database driver execution context
		return await Promise.race([
			queryFactory(controller.signal),
			timeoutPromise,
		]);
	} finally {
		// Safeguard to clear any remaining timeout timers
		controller.abort();
	}
}
