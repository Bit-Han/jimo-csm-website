// // components/public/header.tsx
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Menu, X } from "lucide-react";

// const NAV_LINKS = [
// 	{ label: "Company", href: "/about" },
// 	{ label: "Projects", href: "/projects" },
// 	{ label: "News & Updates", href: "/news" },
// ];

// export function PublicHeader() {
// 	const [open, setOpen] = useState(false);

// 	return (
// 		<header className="bg-white border-b border-gray-100 sticky top-0 z-40">
// 			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
// 				<Link href="/" className="flex items-center gap-2">
// 					{/* Placeholder logo mark — replace with the real Jimo asset */}
// 					<svg
// 						width="32"
// 						height="32"
// 						viewBox="0 0 32 32"
// 						fill="none"
// 						xmlns="http://www.w3.org/2000/svg"
// 					>
// 						<path
// 							d="M20 4 L12 16 L20 16 L12 28"
// 							stroke="#C8102E"
// 							strokeWidth="4"
// 							strokeLinecap="round"
// 							strokeLinejoin="round"
// 						/>
// 					</svg>
// 					<div>
// 						<p className="text-lg font-extrabold text-brand-red leading-none">
// 							Jimo
// 						</p>
// 						<p className="text-[10px] text-gray-500 leading-none mt-0.5 tracking-wide">
// 							Property Development
// 						</p>
// 					</div>
// 				</Link>

// 				<nav className="hidden md:flex items-center gap-8">
// 					{NAV_LINKS.map((link) => (
// 						<Link
// 							key={link.href}
// 							href={link.href}
// 							className="text-sm font-medium text-gray-600 hover:text-brand-red transition"
// 						>
// 							{link.label}
// 						</Link>
// 					))}
// 				</nav>

// 				<button
// 					onClick={() => setOpen(true)}
// 					className="md:hidden p-2 text-gray-700"
// 					aria-label="Open menu"
// 				>
// 					<Menu size={22} />
// 				</button>
// 			</div>

// 			{open && (
// 				<div className="md:hidden fixed inset-0 z-50 bg-white">
// 					<div className="flex items-center justify-between px-4 h-20 border-b border-gray-100">
// 						<p className="text-lg font-extrabold text-brand-red">Jimo</p>
// 						<button onClick={() => setOpen(false)} aria-label="Close menu">
// 							<X size={22} />
// 						</button>
// 					</div>
// 					<nav className="flex flex-col p-6 gap-5">
// 						{NAV_LINKS.map((link) => (
// 							<Link
// 								key={link.href}
// 								href={link.href}
// 								onClick={() => setOpen(false)}
// 								className="text-lg font-medium text-gray-800"
// 							>
// 								{link.label}
// 							</Link>
// 						))}
// 					</nav>
// 				</div>
// 			)}
// 		</header>
// 	);
// }
// components/public/layout/Header.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "@/lib/constants/site";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change / resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/images/logo.png"
              alt="Jimo Property Development"
              width={140}
              height={52}
              priority
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) =>
              link.dropdown ? (
                <div
                  key={link.label}
                  className="relative"
                  ref={dropdownRef}
                >
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[#CC1718] transition-colors"
                  >
                    {link.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#CC1718] transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-gray-700 hover:text-[#CC1718] transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-[#CC1718] hover:bg-gray-50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <nav className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) =>
              link.dropdown ? (
                <div key={link.label}>
                  <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {link.label}
                  </p>
                  {link.dropdown.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#CC1718] hover:bg-gray-50 rounded-md transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#CC1718] hover:bg-gray-50 rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}