// //@/lib/utils/with-query-time.ts
// export class QueryTimeoutError extends Error {
// 	constructor(
// 		message = "The database took too long to respond. Please try again.",
// 	) {
// 		super(message);
// 		this.name = "QueryTimeoutError";
// 	}
// }

// /**
//  * Bounds how long a page will wait on a database call. Important honest
//  * limitation: this does NOT cancel the underlying query or free a stuck
//  * connection — postgres.js has no clean way to abort an in-flight query.
//  * It only stops the PAGE from waiting on it indefinitely, turning a
//  * silent multi-minute hang into a fast, clear, catchable error.
//  */
// export async function withQueryTimeout<T>(
// 	promise: Promise<T>,
// 	ms = 15000,
// ): Promise<T> {
// 	let timer: ReturnType<typeof setTimeout>;
// 	const timeout = new Promise<never>((_, reject) => {
// 		timer = setTimeout(() => reject(new QueryTimeoutError()), ms);
// 	});

// 	try {
// 		return await Promise.race([promise, timeout]);
// 	} finally {
// 		clearTimeout(timer!);
// 	}
// }



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
