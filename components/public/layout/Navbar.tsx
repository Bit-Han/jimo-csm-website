import {Logo}from "./Logo";
import { ButtonLink } from "@/components/ui/Button";
import { MobileNav } from "./MobileNav";
import { siteConfig } from "@/lib/data/site";
import { NavLinks } from "./NavLinks";

export interface NavLink {
	label: string;
	href: string;
}

export const mainNavLinks: NavLink[] = [
	{ label: "About Us", href: "/about" },
	{ label: "Projects", href: "/projects" },
	{ label: "Insights", href: "/insights" },
	{ label: "Contact Us", href: "/contact" },
];

export function Navbar() {
	return (
		<header className="sticky top-0 z-50 border-b border-stone-200 bg-cream-50/90 backdrop-blur">
			<div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<Logo />
				<NavLinks links={mainNavLinks} />
				<div className="hidden lg:block">
					<ButtonLink
						href={siteConfig.registerInterestHref}
						variant="accent"
						size="md"
					>
						Register Interest
					</ButtonLink>
				</div>

				<MobileNav
					links={mainNavLinks}
					registerHref={siteConfig.registerInterestHref}
				/>
			</div>
		</header>
	);
}
