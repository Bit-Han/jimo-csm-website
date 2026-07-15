import { db } from "../index";
import { formFields, forms } from "../schema";

export async function seedForms() {
	const insertedForms = await db
		.insert(forms)
		.values([
			{
				title: "Project Enquiry Form",
				type: "Project",
				status: "active",
				crmTag: "Project Lead",
			},
			{
				title: "Brochure Download Form",
				type: "Brochure",
				status: "active",
				crmTag: "Brochure Lead",
			},
			{
				title: "Diaspora Buyer Form",
				type: "Diaspora",
				status: "review",
				crmTag: "Diaspora",
			},
		])
		.onConflictDoNothing()
		.returning({ id: forms.id, title: forms.title });

	if (insertedForms.length === 0) {
		console.log("✓ Forms already seeded — skipping.");
		return;
	}

	const byTitle = Object.fromEntries(insertedForms.map((f) => [f.title, f.id]));
	const pId = byTitle["Project Enquiry Form"]!;
	const bId = byTitle["Brochure Download Form"]!;
	const dId = byTitle["Diaspora Buyer Form"]!;

	await db.insert(formFields).values([
		// Project Enquiry Form
		{
			formId: pId,
			type: "text",
			label: "Full Name",
			placeholder: "Your full name",
			required: true,
			crmMapping: "lead.full_name",
			position: 0,
		},
		{
			formId: pId,
			type: "phone",
			label: "Phone Number",
			placeholder: "Your phone number",
			required: true,
			crmMapping: "lead.phone",
			position: 1,
		},
		{
			formId: pId,
			type: "email",
			label: "Email Address",
			placeholder: "you@example.com",
			required: true,
			crmMapping: "lead.email",
			position: 2,
		},
		{
			formId: pId,
			type: "dropdown",
			label: "Interested Unit",
			placeholder: "Select an option",
			required: true,
			crmMapping: "lead.interested_unit",
			position: 3,
			options: [
				{ label: "Studio Apartment", value: "studio" },
				{ label: "1-Bedroom Apartment", value: "1bed" },
				{ label: "Penthouse", value: "penthouse" },
			],
		},
		{
			formId: pId,
			type: "budget_range",
			label: "Budget Range",
			placeholder: "Select budget range",
			required: true,
			crmMapping: "lead.budget",
			position: 4,
		},
		{
			formId: pId,
			type: "dropdown",
			label: "Buying Purpose",
			placeholder: "Select purpose",
			required: true,
			crmMapping: "lead.buying_purpose",
			position: 5,
			options: [
				{ label: "Investment", value: "investment" },
				{ label: "Owner Occupation", value: "owner" },
			],
		},
		{
			formId: pId,
			type: "textarea",
			label: "Message",
			placeholder: "Tell us what you would like to discuss",
			required: false,
			crmMapping: "lead.message",
			position: 6,
		},
		// Brochure Download Form
		{
			formId: bId,
			type: "text",
			label: "Full Name",
			placeholder: "Your full name",
			required: true,
			crmMapping: "lead.full_name",
			position: 0,
		},
		{
			formId: bId,
			type: "email",
			label: "Email Address",
			placeholder: "you@example.com",
			required: true,
			crmMapping: "lead.email",
			position: 1,
		},
		{
			formId: bId,
			type: "phone",
			label: "Phone Number",
			placeholder: "Your phone number",
			required: true,
			crmMapping: "lead.phone",
			position: 2,
		},
		// Diaspora Buyer Form
		{
			formId: dId,
			type: "text",
			label: "Full Name",
			placeholder: "Your full name",
			required: true,
			crmMapping: "lead.full_name",
			position: 0,
		},
		{
			formId: dId,
			type: "email",
			label: "Email Address",
			placeholder: "you@example.com",
			required: true,
			crmMapping: "lead.email",
			position: 1,
		},
		{
			formId: dId,
			type: "dropdown",
			label: "Country of Residence",
			placeholder: "Select country",
			required: true,
			crmMapping: "lead.country",
			position: 2,
			options: [
				{ label: "United Kingdom", value: "uk" },
				{ label: "United States", value: "us" },
				{ label: "Canada", value: "ca" },
				{ label: "Other", value: "other" },
			],
		},
	]);

	console.log("✓ Forms seed complete.");
}
