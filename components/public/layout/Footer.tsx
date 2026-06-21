// // components/public/footer.tsx
// // Async Server Component — reads settings directly via the service layer,
// // no API round trip needed since this never ships to the client bundle.
// import Link from "next/link";
// import { Mail, MapPin } from "lucide-react";
// import { InstagramIcon } from "./SocialIcon";
// import { getSettings } from "@/lib/services/settings.service";

// export async function PublicFooter() {
//   const settings = await getSettings();

//   return (
//     <footer className="bg-brand-red text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
//         <div className="flex items-center gap-2">
//           <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
//             <path
//               d="M20 4 L12 16 L20 16 L12 28"
//               stroke="white"
//               strokeWidth="4"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//           <div>
//             <p className="text-lg font-extrabold leading-none">Jimo</p>
//             <p className="text-[10px] opacity-80 leading-none mt-0.5">Property Development</p>
//           </div>
//         </div>

//         <div className="flex flex-col gap-2.5 text-sm">
//           <Link href="/about" className="hover:underline">About Us</Link>
//           <Link href="/projects" className="hover:underline">Projects</Link>
//           <Link href="/#why-choose-us" className="hover:underline">Why Choose Us</Link>
//           <Link href="/#contact" className="hover:underline">Contact Us</Link>
//         </div>

//         <div className="flex flex-col gap-2.5 text-sm">
//           {settings?.instagramUrl && (
//             <a
//               href={settings.instagramUrl}
//               target="_blank"
//               rel="noreferrer"
//               className="flex items-center gap-2 hover:underline"
//             >
//               <InstagramIcon size={16} /> @{settings.instagramUrl.split("/").filter(Boolean).pop()}
//             </a>
//           )}
//           {settings?.companyEmail && (
//             <a href={`mailto:${settings.companyEmail}`} className="flex items-center gap-2 hover:underline">
//               <Mail size={16} /> {settings.companyEmail}
//             </a>
//           )}
//           {settings?.officeAddress && (
//             <p className="flex items-center gap-2">
//               <MapPin size={16} className="shrink-0" /> {settings.officeAddress}
//             </p>
//           )}
//         </div>
//       </div>
//       <div className="border-t border-white/15 py-4 text-center text-xs opacity-75">
//         © {new Date().getFullYear()} Jimo Property Development Limited. All rights reserved.
//       </div>
//     </footer>
//   );
// }


// components/public/layout/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin } from "lucide-react";
import { InstagramIcon } from "@/components/public/SocialIcon";
import { CONTACT, FOOTER_LINKS } from "@/lib/constants/site";

export default function Footer() {
  return (
		<footer className="bg-[#CC1718]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
					{/* Logo Column */}
					<div className="flex flex-col items-start">
						<Image
							src="/images/logo.png"
							alt="Jimo Property Development"
							width={140}
							height={52}
							className="h-12 w-auto object-contain brightness-0 invert"
						/>
					</div>

					{/* Navigation Links */}
					<div>
						<ul className="space-y-3">
							{FOOTER_LINKS.map((link) => (
								<li key={link.label}>
									<Link
										href={link.href}
										className="text-sm text-white/90 hover:text-white transition-colors"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contact Info */}
					<div className="space-y-3">
						<Link
							href={CONTACT.instagramUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2.5 text-sm text-white/90 hover:text-white transition-colors"
						>
							<InstagramIcon className="h-4 w-4 shrink-0" />
							<span>{CONTACT.instagram}</span>
						</Link>

						<Link
							href={`mailto:${CONTACT.email}`}
							className="flex items-center gap-2.5 text-sm text-white/90 hover:text-white transition-colors"
						>
							<Mail className="h-4 w-4 shrink-0" />
							<span>{CONTACT.email}</span>
						</Link>

						<div className="flex items-start gap-2.5 text-sm text-white/90">
							<MapPin className="h-4 w-4 shrink-0 mt-0.5" />
							<span>{CONTACT.address}</span>
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="mt-10 pt-6 border-t border-white/20">
					<p className="text-xs text-white/60 text-center">
						©{new Date().getFullYear()} Jimo Property Development Limited. All
						rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}