
import Link from "next/link";
import { AtSign, Mail, MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { Container } from "@/components/ui/Container";
import { companyLinks, siteConfig } from "@/lib/data/site";

export function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="bg-ink-950 text-white/70">
			<Container className="grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr_1fr]">
				<div className="space-y-4">
					<Logo surface="on-dark" />
					<p className="max-w-sm text-sm leading-relaxed text-white/60">
						{siteConfig.description}
					</p>
				</div>

				<div>
					<h3 className="text-sm font-semibold text-white">Company</h3>
					<ul className="mt-4 space-y-3 text-sm">
						{companyLinks.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									className="text-white/60 transition-colors hover:text-white"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>

				<div>
					<h3 className="text-sm font-semibold text-white">Contact</h3>
					<ul className="mt-4 space-y-3 text-sm text-white/60">
						<li className="flex items-center gap-2">
							<Mail className="h-4 w-4 text-red-400" />
							<Link
								href={`mailto:${siteConfig.email}`}
								className="hover:text-white"
							>
								{siteConfig.email}
							</Link>
						</li>
						<li className="flex items-center gap-2">
							<AtSign className="h-4 w-4 text-red-400" />
							<span>{siteConfig.instagramHandle}</span>
						</li>
						<li className="flex items-center gap-2">
							<MapPin className="h-4 w-4 text-red-400" />
							<span>{siteConfig.address}</span>
						</li>
					</ul>
				</div>
			</Container>

			<div className="border-t border-white/10">
				<Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/40 sm:flex-row">
					<p>
						© {year} {siteConfig.legalName}. All rights reserved.
					</p>
				</Container>
			</div>
		</footer>
	);
}

