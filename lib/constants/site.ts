// lib/constants/site.ts
// ─────────────────────────────────────────────────────────────────────────────
// Global site constants used across public pages.
// These are the default values. The real values are editable via the CMS
// and stored in app_settings in the DB.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE_NAME = "Jimo Property Development Limited";

export const SITE_TAGLINE =
	"Developing Premium Real Estate with Structure, Insight, and Long-Term Value";

export const CONTACT = {
	email: "info@jimopropertydevelopment.com",
	whatsapp: "+2348000000000", // replace with real number
	phone: "+2348000000000", // replace with real number
	address: "32 Sholake Street, Akoka, Lagos",
	instagram: "@Jimopropertydevelopment",
	instagramUrl: "https://instagram.com/jimopropertydevelopment",
};

export const NAV_LINKS = [
	{
		label: "Company",
		href: "#",
		dropdown: [
			{ label: "About Us", href: "/about" },
			{ label: "Services", href: "/services" },
		],
	},
	{ label: "Projects", href: "/projects" },
	{ label: "News & Updates", href: "/news" },
];

export const FOOTER_LINKS = [
	{ label: "About Us", href: "/about" },
	{ label: "Projects", href: "/projects" },
	{ label: "Why Choose Us", href: "/about#why-us" },
	{ label: "Contact Us", href: "/contact" },
];

export const BRAND = {
	primary: "#CC1718", // Jimo red
	dark: "#1a1a1a",
	gray: "#6b7280",
	lightGray: "#f5f5f5",
};
