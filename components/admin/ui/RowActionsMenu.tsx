// // Add to imports at the top of BrochuresExplorer.tsx
// import { useEffect,useState, useRef } from "react";
// import { MoreVertical, RefreshCw, Trash2 } from "lucide-react";
// import type { AdminBrochureListRow } from "@/lib/types/admin/brochure";

// // New small component — put this above the BrochuresExplorer export,
// // or in its own file components/admin/ui/RowActionsMenu.tsx and import it.
// export function RowActionsMenu({
// 	brochure,
// 	isActioning,
// 	actionPending,
// 	onPublish,
// 	onUnpublish,
// 	onReplace,
// 	onDelete,
// }: {
// 	brochure: AdminBrochureListRow;
// 	isActioning: boolean;
// 	actionPending: boolean;
// 	onPublish: () => void;
// 	onUnpublish: () => void;
// 	onReplace: () => void;
// 	onDelete: () => void;
// }) {
// 	const [open, setOpen] = useState(false);
// 	const menuRef = useRef<HTMLDivElement>(null);

// 	useEffect(() => {
// 		if (!open) return;

// 		function handleClickOutside(e: MouseEvent) {
// 			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
// 				setOpen(false);
// 			}
// 		}
// 		function handleEscape(e: KeyboardEvent) {
// 			if (e.key === "Escape") setOpen(false);
// 		}

// 		document.addEventListener("mousedown", handleClickOutside);
// 		document.addEventListener("keydown", handleEscape);
// 		return () => {
// 			document.removeEventListener("mousedown", handleClickOutside);
// 			document.removeEventListener("keydown", handleEscape);
// 		};
// 	}, [open]);

// 	return (
// 		<div className="relative" ref={menuRef}>
// 			<button
// 				type="button"
// 				onClick={() => setOpen((v) => !v)}
// 				disabled={isActioning}
// 				aria-label="More actions"
// 				aria-expanded={open}
// 				className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-ink-950 disabled:opacity-50"
// 			>
// 				<MoreVertical className="h-4 w-4" />
// 			</button>

// 			{open ? (
// 				<div
// 					role="menu"
// 					className="absolute right-0 top-9 z-20 w-44 overflow-hidden rounded-xl border border-stone-200 bg-white py-1 shadow-lg"
// 				>
// 					{brochure.status === "draft" ? (
// 						<button
// 							type="button"
// 							role="menuitem"
// 							onClick={() => {
// 								setOpen(false);
// 								onPublish();
// 							}}
// 							disabled={actionPending}
// 							className="flex w-full items-center px-3 py-2 text-left text-xs font-medium text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
// 						>
// 							Publish
// 						</button>
// 					) : (
// 						<button
// 							type="button"
// 							role="menuitem"
// 							onClick={() => {
// 								setOpen(false);
// 								onUnpublish();
// 							}}
// 							disabled={actionPending}
// 							className="flex w-full items-center px-3 py-2 text-left text-xs font-medium text-amber-600 hover:bg-amber-50 disabled:opacity-50"
// 						>
// 							Unpublish
// 						</button>
// 					)}

// 					<button
// 						type="button"
// 						role="menuitem"
// 						onClick={() => {
// 							setOpen(false);
// 							onReplace();
// 						}}
// 						disabled={actionPending}
// 						className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50"
// 					>
// 						<RefreshCw className="h-3.5 w-3.5" />
// 						Replace file
// 					</button>

// 					<div className="my-1 border-t border-stone-100" />

// 					<button
// 						type="button"
// 						role="menuitem"
// 						onClick={() => {
// 							setOpen(false);
// 							onDelete();
// 						}}
// 						disabled={actionPending}
// 						className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-50"
// 					>
// 						<Trash2 className="h-3.5 w-3.5" />
// 						Delete
// 					</button>
// 				</div>
// 			) : null}
// 		</div>
// 	);
// }


// components/admin/ui/RowActionsMenu.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MoreVertical, RefreshCw, Trash2 } from "lucide-react";
import type { AdminBrochureListRow } from "@/lib/types/admin/brochure";

interface RowActionsMenuProps {
  brochure: AdminBrochureListRow;
  isActioning: boolean;
  actionPending: boolean;
  onPublish: () => void;
  onUnpublish: () => void;
  onReplace: () => void;
  onDelete: () => void;
}

export function RowActionsMenu({
  brochure,
  isActioning,
  actionPending,
  onPublish,
  onUnpublish,
  onReplace,
  onDelete,
}: RowActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!open) return;

//     function handleClickOutside(e: MouseEvent) {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     }
//     function handleEscape(e: KeyboardEvent) {
//       if (e.key === "Escape") setOpen(false);
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     document.addEventListener("keydown", handleEscape);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", handleEscape);
//     };
//   }, [open]);

//   // If this row starts actioning (e.g. delete confirmed elsewhere) close any open menu
//   useEffect(() => {
//     if (isActioning) setOpen(false);
//   }, [isActioning]);

const handleClickOutside = useCallback((e: MouseEvent) => {
  if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
    setOpen(false);
  }
}, [setOpen]); // Only updates if setOpen changes

const handleEscape = useCallback((e: KeyboardEvent) => {
  if (e.key === 'Escape') setOpen(false);
}, [setOpen]);

useEffect(() => {
  if (!open) return;

  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("keydown", handleEscape);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    document.removeEventListener("keydown", handleEscape);
  };
}, [open, handleClickOutside, handleEscape]);

const isMenuVisible = open && !isActioning;


  return (
		<div className="relative" ref={menuRef}>
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				disabled={isActioning}
				aria-label="More actions"
				aria-haspopup="menu"
				aria-expanded={isMenuVisible}
				className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-ink-950 disabled:opacity-50"
			>
				<MoreVertical className="h-4 w-4" />
			</button>

			{isMenuVisible ? (
				<div
					role="menu"
					className="absolute right-0 top-9 z-20 w-44 overflow-hidden rounded-xl border border-stone-200 bg-white py-1 shadow-lg"
				>
					{brochure.status === "draft" ? (
						<button
							type="button"
							role="menuitem"
							onClick={() => {
								setOpen(false);
								onPublish();
							}}
							disabled={actionPending}
							className="flex w-full items-center px-3 py-2 text-left text-xs font-medium text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
						>
							Publish
						</button>
					) : (
						<button
							type="button"
							role="menuitem"
							onClick={() => {
								setOpen(false);
								onUnpublish();
							}}
							disabled={actionPending}
							className="flex w-full items-center px-3 py-2 text-left text-xs font-medium text-amber-600 hover:bg-amber-50 disabled:opacity-50"
						>
							Unpublish
						</button>
					)}

					<button
						type="button"
						role="menuitem"
						onClick={() => {
							setOpen(false);
							onReplace();
						}}
						disabled={actionPending}
						className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50"
					>
						<RefreshCw className="h-3.5 w-3.5" />
						Replace file
					</button>

					<div className="my-1 border-t border-stone-100" />

					<button
						type="button"
						role="menuitem"
						onClick={() => {
							setOpen(false);
							onDelete();
						}}
						disabled={actionPending}
						className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-50"
					>
						<Trash2 className="h-3.5 w-3.5" />
						Delete
					</button>
				</div>
			) : null}
		</div>
	);
}