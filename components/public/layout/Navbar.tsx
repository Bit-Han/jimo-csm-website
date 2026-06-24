// // src/components/public/Navbar.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import { Menu, X } from 'lucide-react'
// import { cn } from '@/lib/utils/helpers'

// const NAV_LINKS = [
//   { label: 'About Us',   href: '/about' },
//   { label: 'Projects',   href: '/projects' },
//   { label: 'Insights',   href: '/insights' },
//   { label: 'Contact Us', href: '/contact' },
// ]

// export default function Navbar() {
//   const [open,     setOpen]     = useState(false)
//   const [scrolled, setScrolled] = useState(false)
//   const pathname = usePathname()
//   const isHome   = pathname === '/'
//   const ghost    = isHome && !scrolled

//   // Only one useEffect — syncing scrolled state with the browser scroll position
//   // which is a genuine external system. No setState cascade because the handler
//   // only fires on user scroll events, not synchronously inside the effect body.
//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 20)
//     // Read initial position directly — no setState on mount, avoids cascade
//     setScrolled(window.scrollY > 20)
//     window.addEventListener('scroll', onScroll, { passive: true })
//     return () => window.removeEventListener('scroll', onScroll)
//   }, [])

//   return (
//     <header
//       className={cn(
//         'fixed inset-x-0 top-0 z-50 transition-all duration-300',
//         ghost ? 'bg-transparent' : 'bg-white/95 backdrop-nav shadow-sm'
//       )}
//     >
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between">

//           {/* Logo */}
//           <Link
//             href="/"
//             className="flex shrink-0 items-center gap-2.5"
//             aria-label="Jimo Property Development"
//           >
//             <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[--color-red] text-sm font-bold text-white">
//               J
//             </span>
//             <span className="leading-none">
//               <span
//                 className={cn(
//                   'block font-display text-[15px] font-bold transition-colors duration-300',
//                   ghost ? 'text-white' : 'text-[--color-navy]'
//                 )}
//               >
//                 Jimo
//               </span>
//               <span
//                 className={cn(
//                   'block text-[10px] tracking-wide transition-colors duration-300',
//                   ghost ? 'text-white/60' : 'text-[--color-navy]/50'
//                 )}
//               >
//                 Property Development
//               </span>
//             </span>
//           </Link>

//           {/* Desktop nav */}
//           <nav className="hidden items-center gap-0.5 lg:flex">
//             {NAV_LINKS.map(({ label, href }) => {
//               const active = pathname === href || pathname.startsWith(href + '/')
//               return (
//                 <Link
//                   key={href}
//                   href={href}
//                   className={cn(
//                     'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
//                     active
//                       ? ghost
//                         ? 'bg-white/20 text-white'
//                         : 'bg-[--color-red]/10 text-[--color-red]'
//                       : ghost
//                       ? 'text-white/85 hover:bg-white/15 hover:text-white'
//                       : 'text-[--color-navy]/65 hover:bg-black/5 hover:text-[--color-navy]'
//                   )}
//                 >
//                   {label}
//                 </Link>
//               )
//             })}
//           </nav>

//           {/* Right side */}
//           <div className="flex items-center gap-3">
//             <Link
//               href="/contact"
//               className="hidden rounded-full bg-[--color-red] px-5 py-2.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[--color-red-dark] lg:inline-flex"
//             >
//               Register Interest
//             </Link>

//             <button
//               type="button"
//               onClick={() => setOpen((prev) => !prev)}
//               className={cn(
//                 'rounded-lg p-2 transition-colors duration-200 lg:hidden',
//                 ghost ? 'text-white hover:bg-white/15' : 'text-[--color-navy] hover:bg-black/5'
//               )}
//               aria-label={open ? 'Close menu' : 'Open menu'}
//               aria-expanded={open}
//             >
//               {open ? <X size={22} /> : <Menu size={22} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       <div
//         className={cn(
//           'overflow-hidden border-t border-black/5 bg-white transition-all duration-300 lg:hidden',
//           open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
//         )}
//       >
//         <nav className="flex flex-col gap-1 px-4 py-3">
//           {NAV_LINKS.map(({ label, href }) => {
//             const active = pathname === href || pathname.startsWith(href + '/')
//             return (
//               <Link
//                 key={href}
//                 href={href}
//                 onClick={() => setOpen(false)}
//                 className={cn(
//                   'rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200',
//                   active
//                     ? 'bg-[--color-red]/8 font-semibold text-[--color-red]'
//                     : 'text-[--color-navy]/65 hover:bg-black/5 hover:text-[--color-navy]'
//                 )}
//               >
//                 {label}
//               </Link>
//             )
//           })}
//           <Link
//             href="/contact"
//             onClick={() => setOpen(false)}
//             className="mt-2 w-full rounded-full bg-[--color-red] py-3 text-center text-sm font-semibold text-white transition-colors duration-200 hover:bg-[--color-red-dark]"
//           >
//             Register Interest
//           </Link>
//         </nav>
//       </div>
//     </header>
//   )
// }


import { Logo } from "./Logo";
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

				{/* <nav className="hidden items-center gap-1 lg:flex">
					{mainNavLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="rounded-full px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-red-50 hover:text-red-700"
						>
							{link.label}
						</Link>
					))}
				</nav> */}
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