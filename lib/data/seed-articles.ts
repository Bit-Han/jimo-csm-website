// lib/data/seed-articles.ts

export type SeedArticle = {
  id: string;
  title: string;
  slug: string;
  category:
    | "location_analysis"
    | "investment_education"
    | "project_update"
    | "market_insight"
    | "construction_update";
  excerpt: string;
  content: string; // HTML string for rendering
  featuredImageUrl: string;
  publishedAt: string; // ISO date string
  readingTimeMinutes: number;
  relatedProjectSlug?: string;
};

export const SEED_ARTICLES: SeedArticle[] = [
  {
    id: "1",
    title: "Why Yaba is Becoming Lagos' Next Premium Real Estate Destination",
    slug: "why-yaba-is-becoming-premium",
    category: "location_analysis",
    excerpt:
      "Once known primarily as a student and commercial district, Yaba is undergoing a rapid transformation into one of Lagos Mainland's most desirable real estate corridors. Here is what is driving the change.",
    featuredImageUrl:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1000&q=80",
    publishedAt: "2025-06-09T10:00:00Z",
    readingTimeMinutes: 5,
    relatedProjectSlug: "jimo-residences-yaba",
    content: `
      <p>Yaba has long been known as the home of UNILAG, tech startups, and some of Lagos's most vibrant street culture. But over the last three years, something significant has shifted — and real estate investors are beginning to pay attention.</p>

      <h2>The Infrastructure Push</h2>
      <p>Government investment in road infrastructure, power supply improvements, and commercial zoning has made Yaba significantly more accessible from Lagos Island and the broader mainland. The rehabilitation of Herbert Macaulay Way and connecting roads has reduced commute times and made the area far more appealing to working professionals and corporate tenants.</p>

      <h2>The Tech and Creative Economy Effect</h2>
      <p>Yaba's reputation as Lagos' "Silicon Valley" has attracted a wave of young, high-earning professionals who want to live close to where they work. Companies including Paystack, Flutterwave (in earlier stages), and dozens of funded startups have offices in or near Yaba — and the talent they employ wants proximity, convenience, and lifestyle.</p>

      <h2>Rising Rental Demand</h2>
      <p>Short-let and serviced apartment demand in Yaba has grown by an estimated 40% over the past two years, driven by corporate travellers, NYSC corps members, visiting professionals, and students from UNILAG and Yaba College of Technology who prefer premium managed accommodation over traditional shared housing.</p>

      <h2>What This Means for Investors</h2>
      <p>For real estate investors, Yaba currently presents an attractive entry window. Land and development costs remain lower than Lekki or Victoria Island, while rental yields are increasingly competitive — particularly for short-let optimised units. As the area continues to gentrify, capital appreciation potential is strong over a 5–10 year horizon.</p>

      <p>Projects like Jimo Residences Yaba are designed specifically to capture this demand — offering premium managed units in the heart of the corridor, positioned for both residential and short-let income from day one.</p>
    `,
  },
  {
    id: "2",
    title: "Shortlet vs Hotel Management: Which Investment Structure Wins in Lagos?",
    slug: "shortlet-vs-hotel-management",
    category: "investment_education",
    excerpt:
      "If you are considering investing in hospitality-style real estate in Lagos, understanding the difference between shortlet and hotel-managed investment structures can significantly impact your returns.",
    featuredImageUrl:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1000&q=80",
    publishedAt: "2025-05-28T09:00:00Z",
    readingTimeMinutes: 6,
    relatedProjectSlug: "yaba-hospitality-hub",
    content: `
      <p>The Lagos real estate market has seen explosive growth in hospitality-linked investment products over the past five years. But many investors struggle to understand the distinction between two dominant structures: the shortlet model and the hotel-managed model. Both can generate strong returns — but they work very differently.</p>

      <h2>The Shortlet Model</h2>
      <p>In a shortlet arrangement, the property owner (or their appointed manager) rents the unit on short-term leases — typically 1 to 30 days — through platforms like Airbnb, Booking.com, or direct corporate channels. The owner retains full control of the asset and bears the operational risk, but also captures the full upside of strong occupancy periods.</p>

      <p>In Lagos, well-managed shortlet units in prime locations like Lekki, Victoria Island, and increasingly Yaba can achieve gross yields of 18–25% per annum when occupancy rates are strong. However, this requires active management — either directly or through a professional property management company.</p>

      <h2>The Hotel-Managed Model</h2>
      <p>In a hotel-managed structure, the developer or a professional hospitality operator manages the building as a unified hospitality asset. Individual unit owners receive a share of the overall revenue generated by the building, typically after management fees. The key advantage is passivity — the investor has no operational involvement.</p>

      <p>Returns in hotel-managed structures tend to be more predictable but lower than the best-case shortlet scenario — typically in the range of 10–15% gross per annum, after management fees. However, the operational burden is completely removed.</p>

      <h2>Which Is Better?</h2>
      <p>The right model depends on your investment profile. If you want maximum returns and are willing to accept operational involvement (or the cost of a management company), the shortlet model offers higher ceiling returns. If you want a passive, hands-off investment with predictable income, hotel-managed structures are more suitable.</p>

      <p>At Jimo, our hospitality projects are designed to offer investors the choice — with professional management options available from day one.</p>
    `,
  },
  {
    id: "3",
    title: "Vatican Court Construction Update — June 2025",
    slug: "vatican-court-update-june-2025",
    category: "project_update",
    excerpt:
      "Vatican Court is now complete and available for immediate occupation. Here is a full update on the project's final stage, handover process, and what buyers can expect.",
    featuredImageUrl:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&q=80",
    publishedAt: "2025-06-01T08:00:00Z",
    readingTimeMinutes: 3,
    relatedProjectSlug: "vatican-court",
    content: `
      <p>We are pleased to share that Vatican Court — our premium residential development in Osapa, Lekki — has reached full completion and is now available for immediate handover to buyers.</p>

      <h2>Project Status</h2>
      <p>All structural, mechanical, electrical, and plumbing works are complete. Interior finishing across all units has been completed to the specification committed to at the point of sale. The building has passed all relevant statutory inspections and the Certificate of Occupancy (C of O) is in place.</p>

      <h2>Handover Process</h2>
      <p>Buyers with completed payment obligations will be contacted directly by our sales team to schedule their unit inspection and key handover. The inspection process allows buyers to review their unit in full before keys are formally issued.</p>

      <h2>Remaining Units</h2>
      <p>A small number of units across the 2-bedroom and 3-bedroom configurations remain available for immediate purchase and occupation. With the project completed and the C of O in place, Vatican Court represents one of the lowest-risk investment opportunities currently available in the Lekki corridor.</p>

      <p>Contact our sales team via WhatsApp or the enquiry form on the Vatican Court project page for pricing and availability details.</p>
    `,
  },
];

export const ARTICLE_CATEGORY_LABELS: Record<SeedArticle["category"], string> =
	{
		location_analysis: "Location Analysis",
		investment_education: "Investment Education",
		project_update: "Project Update",
		market_insight: "Market Insight",
		construction_update: "Construction Update",
	};

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}