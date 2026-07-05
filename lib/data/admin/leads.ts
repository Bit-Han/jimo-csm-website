import type {
	LeadDetail,
	LeadListRow,
	LeadSummaryStats,
} from "@/lib/types/admin/lead";

// TODO (integration stage):
// getLeadListRows → db.query.leads.findMany({ orderBy: [desc(leads.createdAt)], with: { project: true } })
// getLeadDetail   → db.query.leads.findFirst({ where: eq(leads.id, id), with: { project: true } })
// getLeadSummaryStats → aggregated DB queries per stat card

export const mockLeads: LeadListRow[] = [
	{
		id: "lead-1",
		name: "Adebayo Olalekan",
		phone: "0803 456 7890",
		projectPage: "Jimo Residences · 2 Bedroom",
		projectSlug: "jimo-residences-yaba",
		budget: "₦20M–₦50M",
		source: "website",
		status: "new",
		assignedTo: "Deborah",
		date: "9 Jun",
		time: "10:24",
	},
	{
		id: "lead-2",
		name: "Emeka Chidi",
		phone: "0816 234 5678",
		projectPage: "Vatican Court · 3 Bedroom",
		projectSlug: "vatican-court",
		budget: "₦90M–₦120M",
		source: "landing_page",
		status: "contacted",
		assignedTo: "Kunle",
		date: "9 Jun",
		time: "9:58",
	},
	{
		id: "lead-3",
		name: "Funmi Okafor",
		phone: "0701 345 6789",
		projectPage: "Yaba Hub · Hotel Suites",
		projectSlug: "yaba-hospitality-hub",
		budget: "₦200M+",
		source: "whatsapp",
		status: "qualified",
		assignedTo: "Deborah",
		date: "8 Jun",
		time: "4:31",
	},
	{
		id: "lead-4",
		name: "Bolanle Bello",
		phone: "0809 876 5432",
		projectPage: "Jimo Residences · Studio",
		projectSlug: "jimo-residences-yaba",
		budget: "₦60M–₦80M",
		source: "instagram",
		status: "new",
		assignedTo: "Tobi",
		date: "8 Jun",
		time: "2:15",
	},
	{
		id: "lead-5",
		name: "Ibrahim Musa",
		phone: "0812 345 6781",
		projectPage: "Future Project · Land Plot",
		projectSlug: "future-project",
		budget: "₦50M–₦100M",
		source: "google",
		status: "inspection",
		assignedTo: "Kunle",
		date: "7 Jun",
		time: "11:02",
	},
	{
		id: "lead-6",
		name: "Ngozi Nwosu",
		phone: "0806 789 0123",
		projectPage: "Vatican Court · 2 Bedroom",
		projectSlug: "vatican-court",
		budget: "₦50M–₦80M",
		source: "brochure",
		status: "contacted",
		assignedTo: "Deborah",
		date: "7 Jun",
		time: "10:11",
	},
	{
		id: "lead-7",
		name: "Uche Akpan",
		phone: "0704 567 8901",
		projectPage: "Yaba Hub · Hotel Suites",
		projectSlug: "yaba-hospitality-hub",
		budget: "₦200M+",
		source: "referral",
		status: "negotiation",
		assignedTo: "Tobi",
		date: "6 Jun",
		time: "5:47",
	},
	{
		id: "lead-chinedu",
		name: "Chinedu A.",
		phone: "+234 803 123 4567",
		projectPage: "Jimo Residences · 2 Bedroom",
		projectSlug: "jimo-residences-yaba",
		budget: "₦20M–₦30M",
		source: "website",
		status: "new",
		assignedTo: null,
		date: "28 May",
		time: "10:42",
	},
];

const mockLeadDetails: Record<string, LeadDetail> = {
	"lead-1": {
		...mockLeads[0]!,
		initials: "AO",
		email: "adebayo.o@example.com",
		location: "Lagos, Nigeria",
		enquiredAt: "Jun 9, 2025 at 10:24 AM",
		unitInterest: "2 Bedroom Apartment",
		buyingPurpose: "Investment",
		preferredPlan: "12 Months",
		message:
			"I am interested in a 2-bedroom apartment for investment purposes. Please send details.",
		sourcePage: "/projects/jimo-residences-yaba",
		utmSource: "organic",
		utmMedium: "",
		utmCampaign: "",
		device: "Mobile iOS",
		referrer: "google.com",
		activityTimeline: [
			{ id: "t1", label: "Form submitted", timestamp: "Jun 9, 10:24 AM" },
			{ id: "t2", label: "Auto-response sent", timestamp: "Jun 9, 10:24 AM" },
			{ id: "t3", label: "Sales notified", timestamp: "Jun 9, 10:25 AM" },
			{ id: "t4", label: "Assigned to Deborah", timestamp: "Jun 9, 11:00 AM" },
			{
				id: "t5",
				label: "Awaiting contact",
				timestamp: "Now",
				isCurrent: true,
			},
		],
	},
	"lead-2": {
		...mockLeads[1]!,
		initials: "EC",
		email: "emeka.chidi@example.com",
		location: "Abuja, Nigeria",
		enquiredAt: "Jun 9, 2025 at 9:58 AM",
		unitInterest: "3 Bedroom Apartment",
		buyingPurpose: "Owner Occupation",
		preferredPlan: "Outright",
		message:
			"Looking for a 3-bedroom for my family. What is the current price?",
		sourcePage: "/landing/invest-yaba",
		utmSource: "facebook",
		utmMedium: "cpc",
		utmCampaign: "vatican_court_jun25",
		device: "Desktop Windows",
		referrer: "facebook.com",
		activityTimeline: [
			{ id: "t1", label: "Form submitted", timestamp: "Jun 9, 9:58 AM" },
			{ id: "t2", label: "Auto-response sent", timestamp: "Jun 9, 9:58 AM" },
			{ id: "t3", label: "Assigned to Kunle", timestamp: "Jun 9, 10:10 AM" },
			{ id: "t4", label: "Kunle contacted lead", timestamp: "Jun 9, 2:30 PM" },
			{
				id: "t5",
				label: "Status → Contacted",
				timestamp: "Jun 9, 2:31 PM",
				isCurrent: true,
			},
		],
	},
	"lead-3": {
		...mockLeads[2]!,
		initials: "FO",
		email: "funmi.okafor@example.com",
		location: "Lagos, Nigeria",
		enquiredAt: "Jun 8, 2025 at 4:31 AM",
		unitInterest: "Hotel Suite",
		buyingPurpose: "Investment",
		preferredPlan: "Outright",
		message:
			"I am interested in the Yaba Hub for investment. Can I get the investment pack?",
		sourcePage: "/projects/yaba-hospitality-hub",
		utmSource: "whatsapp",
		utmMedium: "social",
		utmCampaign: "yaba_hub_investors",
		device: "Mobile Android",
		referrer: "wa.me",
		activityTimeline: [
			{ id: "t1", label: "WhatsApp click", timestamp: "Jun 8, 4:31 AM" },
			{ id: "t2", label: "Form submitted", timestamp: "Jun 8, 4:35 AM" },
			{ id: "t3", label: "Assigned to Deborah", timestamp: "Jun 8, 9:00 AM" },
			{
				id: "t4",
				label: "Deborah contacted lead",
				timestamp: "Jun 8, 10:15 AM",
			},
			{ id: "t5", label: "Investment deck sent", timestamp: "Jun 8, 11:00 AM" },
			{
				id: "t6",
				label: "Status → Qualified",
				timestamp: "Jun 8, 3:00 PM",
				isCurrent: true,
			},
		],
	},
	"lead-4": {
		...mockLeads[3]!,
		initials: "BB",
		email: "bolanle.b@example.com",
		location: "Lagos, Nigeria",
		enquiredAt: "Jun 8, 2025 at 2:15 AM",
		unitInterest: "Studio Apartment",
		buyingPurpose: "Investment",
		preferredPlan: "6 Months",
		message: "Studio apartment for shortlet investment. Starting price please.",
		sourcePage: "/projects/jimo-residences-yaba",
		utmSource: "instagram",
		utmMedium: "social",
		utmCampaign: "jimo_residences_studio",
		device: "Mobile Android",
		referrer: "instagram.com",
		activityTimeline: [
			{ id: "t1", label: "Form submitted", timestamp: "Jun 8, 2:15 AM" },
			{ id: "t2", label: "Auto-response sent", timestamp: "Jun 8, 2:15 AM" },
			{ id: "t3", label: "Assigned to Tobi", timestamp: "Jun 8, 9:00 AM" },
			{
				id: "t4",
				label: "Awaiting contact",
				timestamp: "Now",
				isCurrent: true,
			},
		],
	},
	"lead-5": {
		...mockLeads[4]!,
		initials: "IM",
		email: "ibrahim.m@example.com",
		location: "Kano, Nigeria",
		enquiredAt: "Jun 7, 2025 at 11:02 AM",
		unitInterest: "Land Plot",
		buyingPurpose: "Investment",
		preferredPlan: "Outright",
		message:
			"Interested in the Ibeju-Lekki land plot. Please send details and availability.",
		sourcePage: "/projects/future-project",
		utmSource: "google",
		utmMedium: "cpc",
		utmCampaign: "lekki_land_jun25",
		device: "Desktop Mac",
		referrer: "google.com",
		activityTimeline: [
			{ id: "t1", label: "Form submitted", timestamp: "Jun 7, 11:02 AM" },
			{ id: "t2", label: "Auto-response sent", timestamp: "Jun 7, 11:02 AM" },
			{ id: "t3", label: "Assigned to Kunle", timestamp: "Jun 7, 12:00 PM" },
			{ id: "t4", label: "Kunle contacted lead", timestamp: "Jun 7, 2:00 PM" },
			{ id: "t5", label: "Inspection scheduled", timestamp: "Jun 8, 9:00 AM" },
			{
				id: "t6",
				label: "Status → Inspection",
				timestamp: "Jun 8, 9:01 AM",
				isCurrent: true,
			},
		],
	},
	"lead-6": {
		...mockLeads[5]!,
		initials: "NN",
		email: "ngozi.n@example.com",
		location: "Lagos, Nigeria",
		enquiredAt: "Jun 7, 2025 at 10:11 AM",
		unitInterest: "2 Bedroom Apartment",
		buyingPurpose: "Owner Occupation",
		preferredPlan: "12 Months",
		message:
			"Downloaded the brochure. Would like to confirm current pricing for the 2-bed.",
		sourcePage: "/brochures/vatican-court",
		utmSource: "organic",
		utmMedium: "",
		utmCampaign: "",
		device: "Mobile iOS",
		referrer: "direct",
		activityTimeline: [
			{ id: "t1", label: "Brochure downloaded", timestamp: "Jun 7, 10:11 AM" },
			{
				id: "t2",
				label: "Auto-response + brochure sent",
				timestamp: "Jun 7, 10:11 AM",
			},
			{ id: "t3", label: "Assigned to Deborah", timestamp: "Jun 7, 11:00 AM" },
			{
				id: "t4",
				label: "Deborah contacted lead",
				timestamp: "Jun 7, 1:00 PM",
			},
			{
				id: "t5",
				label: "Status → Contacted",
				timestamp: "Jun 7, 1:02 PM",
				isCurrent: true,
			},
		],
	},
	"lead-7": {
		...mockLeads[6]!,
		initials: "UA",
		email: "uche.a@example.com",
		location: "Port Harcourt, Nigeria",
		enquiredAt: "Jun 6, 2025 at 5:47 AM",
		unitInterest: "Penthouse Suite",
		buyingPurpose: "Investment",
		preferredPlan: "Outright",
		message:
			"Referred by a colleague. Interested in the top-floor suite at Yaba Hub.",
		sourcePage: "/projects/yaba-hospitality-hub",
		utmSource: "referral",
		utmMedium: "",
		utmCampaign: "",
		device: "Desktop Windows",
		referrer: "direct",
		activityTimeline: [
			{ id: "t1", label: "Form submitted", timestamp: "Jun 6, 5:47 AM" },
			{ id: "t2", label: "Auto-response sent", timestamp: "Jun 6, 5:47 AM" },
			{ id: "t3", label: "Assigned to Tobi", timestamp: "Jun 6, 9:00 AM" },
			{ id: "t4", label: "Tobi contacted lead", timestamp: "Jun 6, 10:30 AM" },
			{ id: "t5", label: "Investment pack sent", timestamp: "Jun 6, 11:00 AM" },
			{ id: "t6", label: "Inspection done", timestamp: "Jun 7, 2:00 PM" },
			{
				id: "t7",
				label: "Negotiation started",
				timestamp: "Jun 8, 9:00 AM",
				isCurrent: true,
			},
		],
	},
	"lead-chinedu": {
		...mockLeads[7]!,
		initials: "CA",
		email: "chinedu.a@example.com",
		location: "Lagos, Nigeria",
		enquiredAt: "May 28, 2025 at 10:42 AM",
		unitInterest: "2 Bedroom Apartment",
		buyingPurpose: "Owner Occupation",
		preferredPlan: "12 Months",
		message:
			"I'm interested in a 2-bedroom apartment. Please send availability and payment options.",
		sourcePage: "/projects/jimo-residences-yaba",
		utmSource: "google",
		utmMedium: "cpc",
		utmCampaign: "jimo_residences_yaba_may25",
		device: "Mobile Android",
		referrer: "google.com",
		activityTimeline: [
			{ id: "t1", label: "Form submitted", timestamp: "May 28, 10:42 AM" },
			{ id: "t2", label: "Auto-response sent", timestamp: "May 28, 10:42 AM" },
			{ id: "t3", label: "Brochure sent", timestamp: "May 28, 10:44 AM" },
			{ id: "t4", label: "Sales notified", timestamp: "May 28, 10:44 AM" },
			{
				id: "t5",
				label: "Awaiting assignment",
				timestamp: "Now",
				isCurrent: true,
			},
		],
	},
};

export function getLeadListRows(): LeadListRow[] {
	return mockLeads;
}

export function getLeadDetail(id: string): LeadDetail | undefined {
	return mockLeadDetails[id];
}

export function getLeadIndexInfo(id: string): {
	position: number;
	total: number;
} {
	const index = mockLeads.findIndex((l) => l.id === id);
	return { position: index === -1 ? 1 : index + 1, total: mockLeads.length };
}

export function getAdjacentLeadIds(id: string): {
	prevId: string | null;
	nextId: string | null;
} {
	const index = mockLeads.findIndex((l) => l.id === id);
	return {
		prevId: index > 0 ? (mockLeads[index - 1]?.id ?? null) : null,
		nextId:
			index < mockLeads.length - 1 ? (mockLeads[index + 1]?.id ?? null) : null,
	};
}

export function getLeadSummaryStats(): LeadSummaryStats {
	const total = mockLeads.length;
	return {
		newLeadsCount: mockLeads.filter(
			(l) => l.status === "new" && l.assignedTo === null,
		).length,
		newLeadsNote: "Leads that have not been contacted yet.",
		qualifiedLeadsCount: mockLeads.filter((l) => l.status === "qualified")
			.length,
		qualifiedLeadsChange: "Up 18% from last 30 days",
		// TODO (integration stage): check trackingIntegrations where platform = hubspot and isConnected = true
		crmConnected: false,
		crmSyncNote: "HubSpot not connected yet. Connect in Settings.",
		totalSynced: 0,
		totalLeads: total,
	};
}
