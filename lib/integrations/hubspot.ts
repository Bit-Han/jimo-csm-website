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
