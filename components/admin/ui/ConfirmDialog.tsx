"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

export interface ConfirmDialogProps {
	open: boolean;
	title: string;
	description: string;
	confirmLabel?: string;
	cancelLabel?: string;
	variant?: "danger" | "default";
	isLoading?: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export function ConfirmDialog({
	open,
	title,
	description,
	confirmLabel = "Confirm",
	cancelLabel = "Cancel",
	variant = "default",
	isLoading = false,
	onConfirm,
	onCancel,
}: ConfirmDialogProps) {
	const confirmBtnRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (open) confirmBtnRef.current?.focus();
	}, [open]);

	useEffect(() => {
		if (!open) return;
		function onKey(e: KeyboardEvent) {
			if (e.key === "Escape" && !isLoading) onCancel();
		}
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [open, isLoading, onCancel]);

	if (!open) return null;

	return (
		<>
			<button
				type="button"
				aria-label="Close"
				onClick={() => !isLoading && onCancel()}
				className="fixed inset-0 z-[60] bg-black/50"
			/>
			<div
				role="alertdialog"
				aria-modal="true"
				className="fixed left-1/2 top-1/2 z-[61] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl"
			>
				<div className="flex items-start gap-3">
					<span
						className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
							variant === "danger"
								? "bg-red-50 text-red-600"
								: "bg-amber-50 text-amber-600"
						}`}
					>
						<AlertTriangle className="h-5 w-5" />
					</span>
					<div>
						<p className="text-sm font-bold text-ink-950">{title}</p>
						<p className="mt-1 text-sm text-stone-500">{description}</p>
					</div>
				</div>
				<div className="mt-6 flex justify-end gap-3">
					<button
						type="button"
						onClick={onCancel}
						disabled={isLoading}
						className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-stone-50 disabled:opacity-50"
					>
						{cancelLabel}
					</button>
					<button
						ref={confirmBtnRef}
						type="button"
						onClick={onConfirm}
						disabled={isLoading}
						className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${
							variant === "danger"
								? "bg-red-600 hover:bg-red-700"
								: "bg-ink-950 hover:bg-ink-900"
						}`}
					>
						{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
						{confirmLabel}
					</button>
				</div>
			</div>
		</>
	);
}
