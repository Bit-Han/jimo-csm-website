//@/components/layout/footer.tsx
import Link from "next/link";
import { AtSign, Mail, MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { Container } from "@/components/ui/Container";
import { companyLinks } from "@/lib/data/site";
import { getPublicSiteSettings } from "@/lib/db/queries/site-settings";
// import { siteConfig } from "@/lib/data/site";

export async function Footer() {
	const year = new Date().getFullYear();
	const settings = await getPublicSiteSettings();

	return (
		<footer className="bg-ink-950 text-white/70">
			<Container className="grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr_1fr]">
				<div className="space-y-4">
					<Logo surface="on-dark" />
					{/* siteConfig.description has no home in Settings yet — see note
					    below. Kept static intentionally rather than guessing a new
					    DB field to invent. */}
					<p className="max-w-sm text-sm leading-relaxed text-white/60">
						{settings.description}
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
								href={`mailto:${settings.email}`}
								className="hover:text-white"
							>
								{settings.email}
							</Link>
						</li>
						<li className="flex items-center gap-2">
							<AtSign className="h-4 w-4 text-red-400" />
							<span>{settings.instagramHandle}</span>
						</li>
						<li className="flex items-center gap-2">
							<MapPin className="h-4 w-4 text-red-400" />
							<span>{settings.address}</span>
						</li>
					</ul>
				</div>
			</Container>

			<div className="border-t border-white/10">
				<Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/40 sm:flex-row">
					<p>
						©{year} {settings.legalName}. All rights reserved.
					</p>
				</Container>
			</div>
		</footer>
	);
}