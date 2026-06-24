"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/helpers";

export interface NavLink {
  label: string;
  href: string;
}


export interface NavLinksProps {
	links: NavLink[];
	className?: string;
}

export function NavLinks({ links, className }: NavLinksProps) {
	const pathname = usePathname();

	return (
		<nav className={cn("hidden items-center gap-1 lg:flex", className)}>
			{links.map((link) => {
				const isActive =
					pathname === link.href || pathname.startsWith(`${link.href}/`);

				return (
					<Link
						key={link.href}
						href={link.href}
						className={cn(
							"rounded-full px-3 py-2 text-sm font-medium transition-colors",
							isActive
								? "bg-red-50 text-red-700"
								: "text-stone-600 hover:bg-red-50 hover:text-red-700",
						)}
					>
						{link.label}
					</Link>
				);
			})}
		</nav>
	);
}
