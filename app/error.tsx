"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("[public error boundary]", error);
	}, [error]);

	return (
		<section className="flex min-h-[60vh] items-center justify-center bg-cream-50 px-6 py-20">
			<div className="mx-auto max-w-md text-center">
				<span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
					<AlertTriangle className="h-7 w-7" />
				</span>
				<h1 className="mt-6 text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">
					Something went wrong
				</h1>
				<p className="mt-3 text-base leading-relaxed text-stone-600">
					We hit an unexpected problem loading this page. This is usually
					temporary — please try again in a moment.
				</p>
				{error.digest ? (
					<p className="mt-2 text-xs text-stone-400">
						Reference: {error.digest}
					</p>
				) : null}
				<div className="mt-8 flex flex-wrap items-center justify-center gap-4">
					<button
						type="button"
						onClick={() => reset()}
						className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
					>
						<RefreshCw className="h-4 w-4" />
						Try again
					</button>
					<Link
						href="/"
						className="rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink-950 hover:bg-stone-50"
					>
						Back to home
					</Link>
				</div>
			</div>
		</section>
	);
}
