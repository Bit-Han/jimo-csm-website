// export const siteConfig = {
// 	name: "Jimo",
// 	legalName: "Jimo Property Development Limited",
// 	tagline: "Property Development",
// 	description:
// 		"Premium residential, hospitality, and investment-led real estate developments built with structure, insight, and long-term value.",
// 	email: "info@jimopropertydevelopment.com",
// 	instagramHandle: "@Jimopropertydevelopment",
// 	address: "32 Sholanke Street, Akoka, Lagos",
// 	registerInterestHref: "/contact",
// };

// export const companyLinks: NavLink[] = [
// 	{ label: "About Us", href: "/about" },
// 	{ label: "Projects", href: "/projects" },
// 	{ label: "Why Choose Us", href: "/about#why-choose-us" },
// 	{ label: "Contact Us", href: "/contact" },
// ];

export interface NavLink {
	label: string;
	href: string;
}

export const siteConfig = {
	name: "Jimo",
	legalName: "Jimo Property Development Limited",
	tagline: "Property Development",
	description:
		"Premium residential, hospitality, and investment-led real estate developments built with structure, insight, and long-term value.",
	email: "info@jimopropertydevelopment.com",
	phone: "+234 000 000 0000",
	phoneHref: "tel:+2340000000000",
	whatsappHref: "https://wa.me/2349009009051",
	instagramHandle: "@Jimopropertydevelopment",
	address: "32 Sholanke Street, Akoka, Lagos",
	registerInterestHref: "/contact",
	responseTimeNote: "We aim to respond within 24 hours.",
};

export const companyLinks: NavLink[] = [
	{ label: "About Us", href: "/about" },
	{ label: "Services", href: "/services" },
	{ label: "Projects", href: "/projects" },
	{ label: "Why Choose Us", href: "/about#why-choose-us" },
	{ label: "Contact Us", href: "/contact" },
];