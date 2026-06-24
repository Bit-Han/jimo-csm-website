"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export interface NavLink {
  label: string;
  href: string;
}
export interface MobileNavProps {
	links: NavLink[];
	registerHref: string;
}

export function MobileNav({ links, registerHref }: MobileNavProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="lg:hidden">
			<button
				type="button"
				aria-label={isOpen ? "Close menu" : "Open menu"}
				aria-expanded={isOpen}
				onClick={() => setIsOpen((open) => !open)}
				className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-ink-950"
			>
				{isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
			</button>

			{isOpen ? (
				<div className="absolute inset-x-0 top-20 z-40 border-b border-stone-200 bg-cream-50 px-4 pb-6 shadow-lg sm:px-6">
					<nav className="flex flex-col gap-1 pt-2">
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setIsOpen(false)}
								className="rounded-xl px-3 py-3 text-base font-medium text-stone-700 transition-colors hover:bg-red-50 hover:text-red-700"
							>
								{link.label}
							</Link>
						))}
					</nav>
					<ButtonLink
						href={registerHref}
						variant="accent"
						size="md"
						className="mt-3 w-full"
						onClick={() => setIsOpen(false)}
					>
						Register Interest
					</ButtonLink>
				</div>
			) : null}
		</div>
	);
}
