import type { InsightDetail } from "@/lib/types/insight";

export const insights: InsightDetail[] = [
	{
		id: "why-yaba-is-becoming-premium",
		slug: "why-yaba-is-becoming-premium",
		title: "Why Yaba is Becoming Premium",
		category: "location-analysis",
		categoryLabel: "Location Analysis",
		excerpt:
			"Yaba has moved from a primarily commercial and student district to one of Lagos Mainland's most closely watched residential corridors. Here is what is driving that shift.",
		publishedAt: "2026-05-12",
		readTimeMinutes: 4,
		relatedProject: {
			slug: "jimo-residences-yaba",
			name: "Jimo Residences Yaba",
		},
		coverImage: {
			src: "https://images.unsplash.com/photo-1752293451299-fca611e46389?auto=format&fit=crop&w=1200&q=80",
			alt: "Modern residential towers representative of Yaba's growing skyline",
		},
		body: [
			"For years, Yaba was known mainly for its markets, schools, and proximity to the University of Lagos. That reputation is changing. A growing technology and start-up scene, improved access roads, and steady demand from young professionals and corporate guests have turned Yaba into one of the more closely watched residential corridors on the Lagos Mainland.",
			"Three factors are driving most of this shift. First, location: Yaba sits within easy reach of Lagos's commercial centres on both the Mainland and the Island, which makes it attractive to people who want a shorter commute. Second, demand for serviced and shortlet accommodation has grown as more corporate guests, diaspora visitors, and young professionals look for flexible, well-managed places to stay. Third, ongoing infrastructure improvements in the area continue to support higher-density residential development.",
			"For buyers and investors, this means two things worth paying attention to: rental demand in the area has been rising steadily, and well-positioned developments are starting to command stronger pricing than they did a few years ago. Developments that combine quality finishing with practical security and management structures are best placed to benefit from this shift.",
			"Jimo Residences Yaba was designed with this trend in mind, combining a hospitality-style management approach with a mix of studio, one-bedroom, and penthouse units built for both long-term residents and shortlet guests.",
		],
	},
	{
		id: "shortlet-vs-hotel-management",
		slug: "shortlet-vs-hotel-management",
		title: "Shortlet vs Hotel Management",
		category: "investment-education",
		categoryLabel: "Investment Education",
		excerpt:
			"Shortlet apartments and hotel rooms can look similar to a guest, but they are very different investments. Here is how the two models compare for an investor.",
		publishedAt: "2026-05-28",
		readTimeMinutes: 5,
		relatedProject: {
			slug: "yaba-hospitality-hub",
			name: "Yaba Hospitality Hub",
		},
		coverImage: {
			src: "https://images.unsplash.com/photo-1761535315385-219131cb53e6?auto=format&fit=crop&w=1200&q=80",
			alt: "Modern hospitality building representative of Yaba Hospitality Hub",
		},
		body: [
			"To a guest booking a stay, a serviced shortlet apartment and a hotel room can feel almost identical: both are furnished, cleaned, and ready to move into. To an investor, however, the two models are structured very differently, and that difference affects income, flexibility, and risk.",
			"A shortlet apartment is typically an individually owned unit that is rented out short-term, often through a management company or platform. The owner holds title to the unit, earns income net of management fees, and can usually choose to sell, occupy, or convert the unit to long-term rental later. A hotel room, by contrast, is part of a centrally operated property. Owners, where ownership is even separated from operations, have far less day-to-day control, and income is usually pooled and distributed according to a fixed formula rather than tied to a specific room.",
			"For an investor, shortlet ownership generally offers more flexibility and a clearer line of sight to the income a specific unit generates, but it also means taking on more responsibility for choosing a reliable management partner. Hotel-style ownership offers a more passive, standardised experience, but with less control and typically a longer path to seeing a return.",
			"Yaba Hospitality Hub is designed to sit between these two models: individually held guest suites and serviced studios, with hospitality-style management handling bookings, housekeeping, and guest experience, so investors get clearer unit-level income with professional management behind it.",
		],
	},
	{
		id: "vatican-court-update",
		slug: "vatican-court-update",
		title: "Vatican Court Update",
		category: "project-update",
		categoryLabel: "Project Update",
		excerpt:
			"Vatican Court is now complete and ready for handover. Here is where things stand on remaining units, documentation, and inspections.",
		publishedAt: "2026-06-02",
		readTimeMinutes: 3,
		relatedProject: { slug: "vatican-court", name: "Vatican Court" },
		coverImage: {
			src: "https://images.unsplash.com/photo-1757970326337-95d7cca56fa1?auto=format&fit=crop&w=1200&q=80",
			alt: "Completed residential apartment building exterior representative of Vatican Court",
		},
		body: [
			"Vatican Court, our completed 3-bedroom development in Akoka, Yaba, is now fully ready for handover. Security, parking, water treatment, and the other essential infrastructure outlined at launch are in place, and the C of O process for the development is complete.",
			"Construction and finishing milestones, including design, approvals, and quality control, have all been signed off. What remains is allocation: confirming current pricing and availability with our sales team, completing documentation, and scheduling inspections for interested buyers and investors.",
			"If you registered interest earlier in the development cycle, our team will be reaching out directly with updated pricing and availability. If you have not yet registered interest and would like to inspect the property or confirm current pricing, you can do so from the Vatican Court project page.",
		],
	},
];

export function getAllInsightSlugs(): string[] {
	return insights.map((insight) => insight.slug);
}

export function getInsightDetail(slug: string): InsightDetail | undefined {
	return insights.find((insight) => insight.slug === slug);
}
