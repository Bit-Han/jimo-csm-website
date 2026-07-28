// components/admin/landing-pages/NewLandingPageLink.tsx
"use client";
import Link from "next/link";
import { Plus } from "lucide-react";

export function NewLandingPageLink() {
	return (
		<Link
			href="/admin/landing-pages/new"
			prefetch={false}
			className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
		>
			<Plus className="h-4 w-4" />
			Create Landing Page
		</Link>
	);
}
