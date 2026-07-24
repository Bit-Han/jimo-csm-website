// lib/utils/timed.ts
export async function timed<T>(label: string, promise: Promise<T>): Promise<T> {
	const start = Date.now();
	console.log(`[timing] ${label} — started`);
	try {
		const result = await promise;
		console.log(`[timing] ${label} — done in ${Date.now() - start}ms`);
		return result;
	} catch (err) {
		console.error(
			`[timing] ${label} — FAILED after ${Date.now() - start}ms:`,
			err,
		);
		throw err;
	}
}
