// // src/lib/integrations/hubspot.ts
// import { Client } from "@hubspot/api-client";

// let hubspotClient: Client | null = null;

// export function getHubSpotClient(): Client {
// 	if (!hubspotClient) {
// 		const token = process.env.HUBSPOT_ACCESS_TOKEN;
// 		if (!token) {
// 			throw new Error("HUBSPOT_ACCESS_TOKEN environment variable is not set");
// 		}
// 		hubspotClient = new Client({ accessToken: token });
// 	}
// 	return hubspotClient;
// }

// export interface HubSpotContact {
// 	id?: string;
// 	firstname?: string;
// 	lastname?: string;
// 	email?: string;
// 	phone?: string;
// 	hs_lead_status?: string;
// 	budget?: string;
// 	project_interest?: string;
// 	unit_interest?: string;
// 	message?: string;
// 	buying_purpose?: string;
// 	utm_source?: string;
// 	utm_campaign?: string;
// 	lead_source?: string;
// }

// export interface HubSpotDeal {
// 	id?: string;
// 	dealname: string;
// 	amount?: string;
// 	dealstage: string;
// 	pipeline: string;
// 	project_name?: string;
// 	lead_source?: string;
// }

// /**
//  * Creates or updates a contact in HubSpot
//  */
// export async function upsertHubSpotContact(
// 	data: HubSpotContact,
// ): Promise<string | null> {
// 	try {
// 		const client = getHubSpotClient();

// 		const [firstName, ...lastNameParts] = (data.firstname || "").split(" ");
// 		const lastName = lastNameParts.join(" ") || "";

// 		const properties: Record<string, string> = {
// 			firstname: firstName,
// 			lastname: lastName,
// 			email: data.email || "",
// 			phone: data.phone || "",
// 			hs_lead_status: data.hs_lead_status || "NEW",
// 		};

// 		// Add custom properties if set
// 		if (data.project_interest)
// 			properties["project_interest"] = data.project_interest;
// 		if (data.unit_interest) properties["unit_interest"] = data.unit_interest;
// 		if (data.budget) properties["budget"] = data.budget;
// 		if (data.message) properties["message"] = data.message;
// 		if (data.buying_purpose) properties["buying_purpose"] = data.buying_purpose;
// 		if (data.utm_source) properties["utm_source"] = data.utm_source;
// 		if (data.utm_campaign) properties["utm_campaign"] = data.utm_campaign;
// 		if (data.lead_source) properties["lead_source"] = data.lead_source;

// 		// Try to find existing contact
// 		if (data.email) {
// 			try {
// 				const existing = await client.crm.contacts.basicApi.getById(
// 					data.email,
// 					undefined,
// 					undefined,
// 					undefined,
// 					false,
// 					"email",
// 				);
// 				if (existing.id) {
// 					// Update existing
// 					await client.crm.contacts.basicApi.update(existing.id, {
// 						properties,
// 					});
// 					return existing.id;
// 				}
// 			} catch {
// 				// Contact doesn't exist — create new
// 			}
// 		}

// 		const contact = await client.crm.contacts.basicApi.create({ properties });
// 		return contact.id;
// 	} catch (error) {
// 		console.error("HubSpot contact upsert error:", error);
// 		return null;
// 	}
// }

// /**
//  * Creates a deal in HubSpot pipeline
//  */
// export async function createHubSpotDeal(
// 	data: HubSpotDeal,
// 	contactId?: string,
// ): Promise<string | null> {
// 	try {
// 		const client = getHubSpotClient();

// 		const properties: Record<string, string> = {
// 			dealname: data.dealname,
// 			dealstage: data.dealstage,
// 			pipeline: data.pipeline || "default",
// 		};

// 		if (data.amount) properties["amount"] = data.amount;
// 		if (data.project_name) properties["project_name"] = data.project_name;
// 		if (data.lead_source) properties["lead_source"] = data.lead_source;

// 		const deal = await client.crm.deals.basicApi.create({ properties });

// 		// Associate contact with deal
// 		if (contactId && deal.id) {
// 			await client.crm.deals.associationsApi.create(
// 				deal.id,
// 				"contacts",
// 				contactId,
// 				[
// 					{
// 						associationCategory: "HUBSPOT_DEFINED" as any,
// 						associationTypeId: 3,
// 					},
// 				],
// 			);
// 		}

// 		return deal.id;
// 	} catch (error) {
// 		console.error("HubSpot deal creation error:", error);
// 		return null;
// 	}
// }

// /**
//  * Updates a deal stage in HubSpot
//  */
// export async function updateHubSpotDealStage(
// 	dealId: string,
// 	stage: string,
// ): Promise<boolean> {
// 	try {
// 		const client = getHubSpotClient();
// 		await client.crm.deals.basicApi.update(dealId, {
// 			properties: { dealstage: stage },
// 		});
// 		return true;
// 	} catch (error) {
// 		console.error("HubSpot deal update error:", error);
// 		return false;
// 	}
// }

// /**
//  * Syncs a lead to HubSpot (creates contact + deal)
//  */
// export async function syncLeadToHubSpot(lead: {
// 	id: string;
// 	name: string;
// 	email?: string | null;
// 	phone?: string | null;
// 	projectInterest?: string | null;
// 	unitInterest?: string | null;
// 	budgetLabel?: string | null;
// 	source?: string | null;
// 	utmSource?: string | null;
// 	utmCampaign?: string | null;
// 	message?: string | null;
// 	buyingPurpose?: string | null;
// 	status?: string;
// }): Promise<{ contactId: string | null; dealId: string | null }> {
// 	const contactId = await upsertHubSpotContact({
// 		firstname: lead.name,
// 		email: lead.email || undefined,
// 		phone: lead.phone || undefined,
// 		hs_lead_status: lead.status?.toUpperCase() || "NEW",
// 		project_interest: lead.projectInterest || undefined,
// 		unit_interest: lead.unitInterest || undefined,
// 		budget: lead.budgetLabel || undefined,
// 		message: lead.message || undefined,
// 		buying_purpose: lead.buyingPurpose || undefined,
// 		utm_source: lead.utmSource || undefined,
// 		utm_campaign: lead.utmCampaign || undefined,
// 		lead_source: lead.source || undefined,
// 	});

// 	const dealId = await createHubSpotDeal(
// 		{
// 			dealname: `${lead.name} - ${lead.projectInterest || "Property Enquiry"}`,
// 			dealstage: "appointmentscheduled",
// 			pipeline: "default",
// 			project_name: lead.projectInterest || undefined,
// 			lead_source: lead.source || undefined,
// 		},
// 		contactId || undefined,
// 	);

// 	return { contactId, dealId };
// }

// /**
//  * Maps CMS lead status to HubSpot deal stage
//  */
// export const LEAD_STATUS_TO_HUBSPOT_STAGE: Record<string, string> = {
// 	new: "appointmentscheduled",
// 	contacted: "qualifiedtobuy",
// 	qualified: "presentationscheduled",
// 	inspection: "decisionmakerboughtin",
// 	negotiation: "contractsent",
// 	closed_won: "closedwon",
// 	closed_lost: "closedlost",
// };



// lib/integrations/hubspot.ts
// ─────────────────────────────────────────────────────────────────────────────
// HubSpot CRM integration — FREE tier scope:
//   • Create / update Contacts
//   • Create / update Deals
//   • Add Notes to contacts
//   • Read contact by email
//
// Uses HubSpot's Private App access token (no OAuth needed for internal use).
// All API calls are server-side only — the token is never sent to the browser.
// ─────────────────────────────────────────────────────────────────────────────

const HUBSPOT_BASE = "https://api.hubapi.com";

function getHeaders() {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) throw new Error("HUBSPOT_ACCESS_TOKEN is not configured.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function hubspotFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${HUBSPOT_BASE}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...(options.headers ?? {}) },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HubSpot API error ${res.status}: ${body}`);
  }

  // 204 No Content
  if (res.status === 204) return {} as T;
  return res.json() as Promise<T>;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACTS
// ─────────────────────────────────────────────────────────────────────────────

export type HubSpotContactProperties = {
  email?: string;
  phone?: string;
  firstname?: string;
  lastname?: string;
  country?: string;
  // Custom properties (must be created in HubSpot first)
  project_interest?: string;
  unit_interest?: string;
  budget_range?: string;
  buying_purpose?: string;
  lead_source?: string;
  utm_campaign?: string;
};

type HubSpotContact = {
  id: string;
  properties: HubSpotContactProperties;
};

/**
 * Create a new HubSpot contact.
 * Returns the HubSpot contact ID on success.
 */
export async function createHubSpotContact(
  props: HubSpotContactProperties
): Promise<string> {
  const res = await hubspotFetch<HubSpotContact>("/crm/v3/objects/contacts", {
    method: "POST",
    body: JSON.stringify({ properties: props }),
  });
  return res.id;
}

/**
 * Update an existing HubSpot contact by their HubSpot ID.
 */
export async function updateHubSpotContact(
  hubspotContactId: string,
  props: Partial<HubSpotContactProperties>
): Promise<void> {
  await hubspotFetch(`/crm/v3/objects/contacts/${hubspotContactId}`, {
    method: "PATCH",
    body: JSON.stringify({ properties: props }),
  });
}

/**
 * Find a contact by email. Returns the contact ID if found, null otherwise.
 */
export async function findHubSpotContactByEmail(
  email: string
): Promise<string | null> {
  try {
    const res = await hubspotFetch<{ results: HubSpotContact[] }>(
      `/crm/v3/objects/contacts/search`,
      {
        method: "POST",
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                { propertyName: "email", operator: "EQ", value: email },
              ],
            },
          ],
          properties: ["email"],
          limit: 1,
        }),
      }
    );
    return res.results[0]?.id ?? null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DEALS
// ─────────────────────────────────────────────────────────────────────────────

export type HubSpotDealProperties = {
  dealname: string;
  dealstage?: string;
  pipeline?: string;
  amount?: string; // Naira value as string
  description?: string;
  // Custom properties
  project_name?: string;
  unit_type?: string;
  lead_budget?: string;
};

type HubSpotDeal = {
  id: string;
  properties: HubSpotDealProperties;
};

/**
 * Create a deal and associate it with a contact.
 * Returns the HubSpot deal ID.
 */
export async function createHubSpotDeal(
  props: HubSpotDealProperties,
  hubspotContactId: string
): Promise<string> {
  // Create the deal
  const deal = await hubspotFetch<HubSpotDeal>("/crm/v3/objects/deals", {
    method: "POST",
    body: JSON.stringify({ properties: props }),
  });

  // Associate deal → contact
  await hubspotFetch(
    `/crm/v4/objects/deals/${deal.id}/associations/contacts/${hubspotContactId}/associations/default`,
    { method: "PUT" }
  );

  return deal.id;
}

/**
 * Update an existing deal's stage or properties.
 */
export async function updateHubSpotDeal(
  hubspotDealId: string,
  props: Partial<HubSpotDealProperties>
): Promise<void> {
  await hubspotFetch(`/crm/v3/objects/deals/${hubspotDealId}`, {
    method: "PATCH",
    body: JSON.stringify({ properties: props }),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Add a note (engagement) to a contact in HubSpot.
 */
export async function addHubSpotNote(
  hubspotContactId: string,
  noteBody: string
): Promise<void> {
  const note = await hubspotFetch<{ id: string }>(
    "/crm/v3/objects/notes",
    {
      method: "POST",
      body: JSON.stringify({
        properties: {
          hs_note_body: noteBody,
          hs_timestamp: new Date().toISOString(),
        },
      }),
    }
  );

  // Associate note → contact
  await hubspotFetch(
    `/crm/v4/objects/notes/${note.id}/associations/contacts/${hubspotContactId}/associations/default`,
    { method: "PUT" }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SYNC — full upsert flow called from the leads service
// ─────────────────────────────────────────────────────────────────────────────

export type SyncLeadToHubSpotInput = {
  name: string;
  email?: string | null;
  phone: string;
  projectName?: string | null;
  unitInterest?: string | null;
  budgetRange?: string | null;
  buyingPurpose?: string | null;
  source?: string | null;
  utmCampaign?: string | null;
  existingHubspotContactId?: string | null;
  existingHubspotDealId?: string | null;
};

export type SyncLeadResult = {
  hubspotContactId: string;
  hubspotDealId: string;
};

/**
 * Main sync function: create or update a contact + deal in HubSpot.
 * Called after every lead form submission.
 */
export async function syncLeadToHubSpot(
  input: SyncLeadToHubSpotInput
): Promise<SyncLeadResult> {
  const nameParts = input.name.trim().split(" ");
  const firstname = nameParts[0] ?? input.name;
  const lastname = nameParts.slice(1).join(" ") || undefined;

  const contactProps: HubSpotContactProperties = {
    email: input.email ?? undefined,
    phone: input.phone,
    firstname,
    lastname,
    project_interest: input.projectName ?? undefined,
    unit_interest: input.unitInterest ?? undefined,
    budget_range: input.budgetRange ?? undefined,
    buying_purpose: input.buyingPurpose ?? undefined,
    lead_source: input.source ?? undefined,
    utm_campaign: input.utmCampaign ?? undefined,
  };

  // ── Contact: create or update ──
  let hubspotContactId = input.existingHubspotContactId;

  if (hubspotContactId) {
    await updateHubSpotContact(hubspotContactId, contactProps);
  } else {
    // Try to find by email first to avoid duplicates
    if (input.email) {
      hubspotContactId = await findHubSpotContactByEmail(input.email);
    }
    if (hubspotContactId) {
      await updateHubSpotContact(hubspotContactId, contactProps);
    } else {
      hubspotContactId = await createHubSpotContact(contactProps);
    }
  }

  // ── Deal: create or update ──
  const dealProps: HubSpotDealProperties = {
    dealname: `${input.name} – ${input.projectName ?? "General Enquiry"}`,
    dealstage: "appointmentscheduled", // HubSpot default "Appointment Scheduled"
    project_name: input.projectName ?? undefined,
    unit_type: input.unitInterest ?? undefined,
    lead_budget: input.budgetRange ?? undefined,
  };

  let hubspotDealId = input.existingHubspotDealId;
  if (hubspotDealId) {
    await updateHubSpotDeal(hubspotDealId, dealProps);
  } else {
    hubspotDealId = await createHubSpotDeal(dealProps, hubspotContactId);
  }

  return { hubspotContactId, hubspotDealId };
}
