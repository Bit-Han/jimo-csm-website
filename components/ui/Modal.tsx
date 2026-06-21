// src/components/ui/Modal.tsx
// Pure Tailwind modal — uses React portal pattern via a fixed overlay
// DATA FLOW: parent controls open state via isOpen/onClose props
"use client";
import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/helpers";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	description?: string;
	children: ReactNode;
	size?: "sm" | "md" | "lg" | "xl";
	className?: string;
}

const SIZE_CLASSES = {
	sm: "max-w-sm",
	md: "max-w-lg",
	lg: "max-w-2xl",
	xl: "max-w-4xl",
};

export function Modal({
	isOpen,
	onClose,
	title,
	description,
	children,
	size = "md",
	className,
}: ModalProps) {
	// Close on Escape key
	useEffect(() => {
		if (!isOpen) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [isOpen, onClose]);

	// Lock body scroll when open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
				onClick={onClose}
			/>
			{/* Panel */}
			<div
				className={cn(
					"relative w-full rounded-xl bg-white shadow-xl animate-scale-in",
					"max-h-[90vh] flex flex-col",
					SIZE_CLASSES[size],
					className,
				)}
			>
				{/* Header */}
				{(title || description) && (
					<div className="flex items-start justify-between border-b border-gray-100 px-6 py-4 shrink-0">
						<div>
							{title && (
								<h2 className="text-base font-semibold text-gray-900">
									{title}
								</h2>
							)}
							{description && (
								<p className="mt-0.5 text-sm text-gray-500">{description}</p>
							)}
						</div>
						<button
							onClick={onClose}
							className="ml-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
				)}
				{/* Body */}
				<div className="flex-1 overflow-y-auto">{children}</div>
			</div>
		</div>
	);
}

// Convenience sub-components
export function ModalBody({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return <div className={cn("px-6 py-5", className)}>{children}</div>;
}

export function ModalFooter({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 shrink-0",
				className,
			)}
		>
			{children}
		</div>
	);
}
