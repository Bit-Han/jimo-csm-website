"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { FileText, Loader2, Search, UserCog, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
	globalAdminSearch,
	type AdminSearchResult,
} from "@/lib/actions/admin/search";

const MODULE_ICON: Record<string, LucideIcon> = {
	leads: Users,
	insights: FileText,
	"users-roles": UserCog,
};

export function AdminHeaderSearch() {
	const router = useRouter();
	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const portalRef = useRef<HTMLDivElement>(null);

	const [query, setQuery] = useState("");
	const [results, setResults] = useState<AdminSearchResult[]>([]);
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [coords, setCoords] = useState<{
		top: number;
		left: number;
		width: number;
	} | null>(null);

	function computeCoords() {
		const rect = containerRef.current?.getBoundingClientRect();
		if (!rect) return;
		setCoords({
			top: rect.bottom + window.scrollY + 4,
			left: rect.left + window.scrollX,
			width: rect.width,
		});
	}

	function handleChange(value: string) {
		setQuery(value);
		if (debounceRef.current) clearTimeout(debounceRef.current);

		if (value.trim().length < 2) {
			setResults([]);
			setOpen(false);
			return;
		}

		debounceRef.current = setTimeout(() => {
			computeCoords();
			startTransition(async () => {
				const rows = await globalAdminSearch(value);
				setResults(rows);
				setOpen(true);
			});
		}, 300);
	}

	function handleSelect(result: AdminSearchResult) {
		setOpen(false);
		setQuery("");
		setResults([]);
		router.push(result.href);
	}

	useEffect(() => {
		if (!open) return;
		function onClickOutside(e: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			)
				setOpen(false);
		}
		function reposition() {
			computeCoords();
		}
		document.addEventListener("mousedown", onClickOutside);
		window.addEventListener("scroll", reposition, true);
		window.addEventListener("resize", reposition);
		return () => {
			document.removeEventListener("mousedown", onClickOutside);
			window.removeEventListener("scroll", reposition, true);
			window.removeEventListener("resize", reposition);
		};
	}, [open]);

	// ⌘K / Ctrl+K focuses the box from anywhere in the admin — makes the
	// shortcut badge already shown in the UI actually true, instead of
	// decorative.

useEffect(() => {
	if (!open) return;
	function onClickOutside(e: MouseEvent) {
		const target = e.target as Node;
		// The results panel is portalled into document.body, so it's NOT a
		// DOM descendant of containerRef even though it's a React child of
		// this component. Checking only containerRef treats every click
		// inside the panel as "outside" and closes it on mousedown — before
		// the clicked button's own onClick can fire on the following click
		// event, since by then the element has already been unmounted.
		if (containerRef.current?.contains(target)) return;
		if (portalRef.current?.contains(target)) return;
		setOpen(false);
	}
	function reposition() {
		computeCoords();
	}
	document.addEventListener("mousedown", onClickOutside);
	window.addEventListener("scroll", reposition, true);
	window.addEventListener("resize", reposition);
	return () => {
		document.removeEventListener("mousedown", onClickOutside);
		window.removeEventListener("scroll", reposition, true);
		window.removeEventListener("resize", reposition);
	};
}, [open]);

	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				inputRef.current?.focus();
			}
			if (e.key === "Escape") {
				setOpen(false);
				inputRef.current?.blur();
			}
		}
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	const grouped = results.reduce<
		Record<string, { label: string; items: AdminSearchResult[] }>
	>((acc, r) => {
		if (!acc[r.module]) acc[r.module] = { label: r.moduleLabel, items: [] };
		acc[r.module]!.items.push(r);
		return acc;
	}, {});

	return (
		<div ref={containerRef} className="relative flex flex-1 sm:max-w-md">
			<div className="flex w-full items-center gap-2 rounded-lg border border-stone-200 bg-cream-50 px-3 py-2 text-sm text-stone-400 focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-600/20">
				{isPending ? (
					<Loader2 className="h-4 w-4 shrink-0 animate-spin" />
				) : (
					<Search className="h-4 w-4 shrink-0" />
				)}
				<input
					ref={inputRef}
					type="text"
					value={query}
					onChange={(e) => handleChange(e.target.value)}
					onFocus={() => results.length > 0 && setOpen(true)}
					placeholder="Search leads, articles..."
					className="w-full bg-transparent text-ink-950 placeholder:text-stone-400 focus:outline-none"
				/>
				<span className="ml-auto hidden shrink-0 rounded border border-stone-200 bg-white px-1.5 py-0.5 text-xs sm:inline">
					⌘K
				</span>
			</div>

			{open && coords
				? createPortal(
						<div
							ref={portalRef}
							style={{
								position: "absolute",
								top: coords.top,
								left: coords.left,
								width: coords.width,
							}}
							className="z-50 max-h-96 overflow-y-auto rounded-xl border border-stone-200 bg-white py-2 shadow-xl"
						>
							{results.length === 0 ? (
								<p className="px-4 py-3 text-sm text-stone-400">
									{isPending ? "Searching..." : `No results for "${query}"`}
								</p>
							) : (
								Object.entries(grouped).map(([moduleKey, group]) => {
									const Icon = MODULE_ICON[moduleKey] ?? Search;
									return (
										<div key={moduleKey} className="px-2 py-1">
											<p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-stone-400">
												{group.label}s
											</p>
											{group.items.map((item) => (
												<button
													key={`${item.module}-${item.id}`}
													type="button"
													onClick={() => handleSelect(item)}
													className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-stone-50"
												>
													<Icon className="h-4 w-4 shrink-0 text-stone-400" />
													<span className="min-w-0 flex-1">
														<span className="block truncate text-sm font-medium text-ink-950">
															{item.title}
														</span>
														{item.subtitle ? (
															<span className="block truncate text-xs text-stone-500">
																{item.subtitle}
															</span>
														) : null}
													</span>
												</button>
											))}
										</div>
									);
								})
							)}
						</div>,
						document.body,
					)
				: null}
		</div>
	);
}

