"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AuthorAvatar } from "@/components/admin/ui/AuthorAvatar";
import type { AuthorOption } from "@/lib/types/admin/article";

export function AuthorPicker({
	authors,
	value,
	onChange,
}: {
	authors: AuthorOption[];
	value: string;
	onChange: (author: AuthorOption) => void;
}) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const current = authors.find((a) => a.id === value) ?? null;

	useEffect(() => {
		if (!open) return;
		function onClick(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node))
				setOpen(false);
		}
		document.addEventListener("mousedown", onClick);
		return () => document.removeEventListener("mousedown", onClick);
	}, [open]);

	return (
		<div className="relative" ref={ref}>
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="flex w-full items-center gap-2.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-left hover:bg-stone-50"
			>
				{current ? (
					<>
						<AuthorAvatar
							name={current.fullName}
							avatarUrl={current.avatarUrl}
							size={28}
						/>
						<span className="flex-1 text-sm font-medium text-ink-950">
							{current.fullName}
						</span>
					</>
				) : (
					<span className="flex-1 text-sm text-stone-400">
						Select an author
					</span>
				)}
				<ChevronDown className="h-4 w-4 text-stone-400" />
			</button>

			{open ? (
				<div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-xl border border-stone-200 bg-white py-1 shadow-lg">
					{authors.length === 0 ? (
						<p className="px-3 py-2 text-xs text-stone-400">
							No active admins found.
						</p>
					) : (
						authors.map((author) => (
							<button
								key={author.id}
								type="button"
								onClick={() => {
									onChange(author);
									setOpen(false);
								}}
								className="flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-stone-50"
							>
								<AuthorAvatar
									name={author.fullName}
									avatarUrl={author.avatarUrl}
									size={28}
								/>
								<div>
									<p className="text-sm font-medium text-ink-950">
										{author.fullName}
									</p>
									<p className="text-[11px] text-stone-400">{author.role}</p>
								</div>
							</button>
						))
					)}
				</div>
			) : null}
		</div>
	);
}
