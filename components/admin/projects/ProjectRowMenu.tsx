// components/admin/projects/ProjectRowMenu.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
	ExternalLink,
	Loader2,
	MoreHorizontal,
	Pencil,
	Trash2,
} from "lucide-react";
import type { AdminProjectListRow } from "@/lib/types/admin/project";

const MENU_WIDTH = 192; // px — matches w-48

export function ProjectRowMenu({
	project,
	onUnpublish,
	onDelete,
	busy,
}: {
	project: AdminProjectListRow;
	onUnpublish: () => void;
	onDelete: () => void;
	busy: boolean;
}) {
	const [open, setOpen] = useState(false);
	const [coords, setCoords] = useState<{ top: number; left: number } | null>(
		null,
	);
	const buttonRef = useRef<HTMLButtonElement>(null);

	function computeCoords() {
		const rect = buttonRef.current?.getBoundingClientRect();
		if (!rect) return;
		setCoords({
			top: rect.bottom + window.scrollY + 4,
			left: Math.max(8, rect.right + window.scrollX - MENU_WIDTH),
		});
	}

	function toggle() {
		if (open) {
			setOpen(false);
			return;
		}
		computeCoords();
		setOpen(true);
	}

	useEffect(() => {
		if (!open) return;
		function reposition() {
			computeCoords();
		}
		window.addEventListener("scroll", reposition, true);
		window.addEventListener("resize", reposition);
		return () => {
			window.removeEventListener("scroll", reposition, true);
			window.removeEventListener("resize", reposition);
		};
	}, [open]);

	return (
		<div className="relative">
			<button
				ref={buttonRef}
				type="button"
				onClick={toggle}
				disabled={busy}
				aria-label={`More options for ${project.name}`}
				aria-expanded={open}
				className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-100 hover:text-ink-950 disabled:opacity-50"
			>
				{busy ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<MoreHorizontal className="h-4 w-4" />
				)}
			</button>

			{open && coords
				? createPortal(
						<>
							<button
								type="button"
								aria-label="Close menu"
								onClick={() => setOpen(false)}
								className="fixed inset-0 z-40"
							/>
							<div
								style={{
									position: "absolute",
									top: coords.top,
									left: coords.left,
									width: MENU_WIDTH,
								}}
								className="z-50 overflow-hidden rounded-xl border border-stone-200 bg-white py-1 shadow-lg"
							>
								<Link
									href={`/admin/projects/${project.slug}/edit`}
									onClick={() => setOpen(false)}
									className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-ink-950 hover:bg-stone-50"
								>
									<Pencil className="h-3.5 w-3.5" />
									Edit
								</Link>

								<Link
									href={`/projects/${project.slug}`}
									target="_blank"
									rel="noopener noreferrer"
									onClick={() => setOpen(false)}
									className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-stone-600 hover:bg-stone-50"
								>
									<ExternalLink className="h-3.5 w-3.5" />
									Preview
								</Link>

								{project.publishStatus === "published" ? (
									<button
										type="button"
										onClick={() => {
											setOpen(false);
											onUnpublish();
										}}
										className="flex w-full px-3 py-2 text-left text-xs font-medium text-amber-600 hover:bg-amber-50"
									>
										Unpublish
									</button>
								) : null}

								<button
									type="button"
									onClick={() => {
										setOpen(false);
										onDelete();
									}}
									className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-red-500 hover:bg-red-50"
								>
									<Trash2 className="h-3.5 w-3.5" />
									Delete
								</button>
							</div>
						</>,
						document.body,
					)
				: null}
		</div>
	);
}
