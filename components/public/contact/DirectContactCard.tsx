
// // components/public/contact/DirectContactsCard.tsx
// import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
// import { siteConfig } from "@/lib/data/site";
// import Link from "next/link";
// import { TrackedLink } from "@/components/public/tracking/TrackedLink";

// export function DirectContactCard() {
// 	return (
// 		<div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
// 			<h2 className="text-lg font-bold text-ink-950">Direct Contact</h2>
// 			<ul className="mt-5 space-y-4 text-sm">
// 				<li className="flex items-center gap-3">
// 					<Phone className="h-4 w-4 text-red-600" />
// 					<TrackedLink
// 						href={siteConfig.phoneHref}
// 						eventName="phone_click"
// 						metadata={{ sourcePage: "/contact" }}
// 						className="font-medium text-ink-950 hover:text-red-600"
// 					>
// 						{siteConfig.phone}
// 					</TrackedLink>
// 				</li>
// 				<li className="flex items-center gap-3">
// 					<Mail className="h-4 w-4 text-red-600" />
// 					<Link
// 						href={`mailto:${siteConfig.email}`}
// 						className="font-medium text-ink-950 hover:text-red-600"
// 					>
// 						{siteConfig.email}
// 					</Link>
// 				</li>
// 				<li className="flex items-center gap-3">
// 					<MessageCircle className="h-4 w-4 text-red-600" />
// 					<TrackedLink
// 						href={siteConfig.whatsappHref}
// 						eventName="whatsapp_click"
// 						metadata={{ sourcePage: "/contact" }}
// 						className="font-medium text-ink-950 hover:text-red-600"
// 					>
// 						Chat on WhatsApp
// 					</TrackedLink>
// 				</li>
// 				<li className="flex items-center gap-3">
// 					<MapPin className="h-4 w-4 text-red-600" />
// 					<span className="font-medium text-ink-950">{siteConfig.address}</span>
// 				</li>
// 			</ul>
// 			<p className="mt-5 text-xs text-stone-500">{siteConfig.responseTimeNote}</p>
// 		</div>
// 	);
// }


//@components/public/contact/DirectContactsCard.tsx
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getPublicSiteSettings } from "@/lib/db/queries/site-settings";
import { TrackedLink } from "@/components/public/tracking/TrackedLink";

export async function DirectContactCard() {
	const settings = await getPublicSiteSettings();

	return (
		<div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
			<h2 className="text-lg font-bold text-ink-950">Direct Contact</h2>
			<ul className="mt-5 space-y-4 text-sm">
				<li className="flex items-center gap-3">
					<Phone className="h-4 w-4 text-red-600" />
					<TrackedLink
						href={settings.phoneHref}
						eventName="phone_click"
						metadata={{ sourcePage: "/contact" }}
						className="font-medium text-ink-950 hover:text-red-600"
					>
						{settings.phone}
					</TrackedLink>
				</li>
				<li className="flex items-center gap-3">
					<Mail className="h-4 w-4 text-red-600" />
					<Link
						href={`mailto:${settings.email}`}
						className="font-medium text-ink-950 hover:text-red-600"
					>
						{settings.email}
					</Link>
				</li>
				<li className="flex items-center gap-3">
					<MessageCircle className="h-4 w-4 text-red-600" />
					<TrackedLink
						href={settings.whatsappHref}
						eventName="whatsapp_click"
						metadata={{ sourcePage: "/contact" }}
						className="font-medium text-ink-950 hover:text-red-600"
					>
						Chat on WhatsApp
					</TrackedLink>
				</li>
				<li className="flex items-center gap-3">
					<MapPin className="h-4 w-4 text-red-600" />
					<span className="font-medium text-ink-950">{settings.address}</span>
				</li>
			</ul>
			<p className="mt-5 text-xs text-stone-500">{settings.responseTimeNote}</p>
		</div>
	);
}