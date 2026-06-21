// // lib/services/settings.service.ts
// import { db } from "@/lib/db";
// import { appSettings } from "@/lib/db/schema";
// import { eq } from "drizzle-orm";
// import type { AppSettings } from "@/lib/types";

// // Keys that must NEVER be returned to the client
// const SENSITIVE_KEYS: (keyof AppSettings)[] = [
// 	"resendApiKeyEncrypted",
// 	"hubspotAccessTokenEncrypted",
// 	"cloudinaryApiKeyEncrypted",
// 	"cloudinaryApiSecretEncrypted",
// ];

// type PublicSettings = Omit<AppSettings, (typeof SENSITIVE_KEYS)[number]>;

// export async function getSettings(): Promise<PublicSettings | null> {
// 	const [settings] = await db.select().from(appSettings).limit(1);
// 	if (!settings) return null;

// 	// Strip sensitive encrypted fields before returning
// 	const safe = { ...settings } as Record<string, unknown>;
// 	SENSITIVE_KEYS.forEach((k) => delete safe[k]);

// 	return safe as PublicSettings;
// }

// export async function getRawSettings(): Promise<AppSettings | null> {
// 	const [settings] = await db.select().from(appSettings).limit(1);
// 	return settings ?? null;
// }

// export async function upsertSettings(
// 	input: Partial<Omit<AppSettings, "id" | "createdAt" | "updatedAt">>,
// ): Promise<PublicSettings> {
// 	const existing = await getRawSettings();

// 	let result: AppSettings;
// 	if (existing) {
// 		const [updated] = await db
// 			.update(appSettings)
// 			.set({ ...input, updatedAt: new Date() })
// 			.where(eq(appSettings.id, existing.id))
// 			.returning();
// 		result = updated;
// 	} else {
// 		const [created] = await db.insert(appSettings).values(input).returning();
// 		result = created;
// 	}

// 	const safe = { ...result } as Record<string, unknown>;
// 	SENSITIVE_KEYS.forEach((k) => delete safe[k]);
// 	return safe as PublicSettings;
// }


// lib/services/settings.service.ts
import { db } from "@/lib/db";
import { appSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { AppSettings } from "@/lib/types";

// `as const satisfies` — NOT a type annotation — is what keeps these as the
// 4 literal strings instead of widening to `keyof AppSettings`. That widening
// was the bug: it made Omit<AppSettings, keyof AppSettings> collapse to `{}`,
// which is why companyEmail/officeAddress "didn't exist" on PublicSettings.
const SENSITIVE_KEYS = [
  "resendApiKeyEncrypted",
  "hubspotAccessTokenEncrypted",
  "cloudinaryApiKeyEncrypted",
  "cloudinaryApiSecretEncrypted",
] as const satisfies readonly (keyof AppSettings)[];

export type PublicSettings = Omit<AppSettings, (typeof SENSITIVE_KEYS)[number]>;

export async function getSettings(): Promise<PublicSettings | null> {
  const [settings] = await db.select().from(appSettings).limit(1);
  if (!settings) return null;

  const safe = { ...settings } as Record<string, unknown>;
  SENSITIVE_KEYS.forEach((k) => delete safe[k]);

  return safe as PublicSettings;
}

export async function getRawSettings(): Promise<AppSettings | null> {
  const [settings] = await db.select().from(appSettings).limit(1);
  return settings ?? null;
}

export async function upsertSettings(
  input: Partial<Omit<AppSettings, "id" | "createdAt" | "updatedAt">>
): Promise<PublicSettings> {
  const existing = await getRawSettings();

  let result: AppSettings;
  if (existing) {
    const [updated] = await db
      .update(appSettings)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(appSettings.id, existing.id))
      .returning();
    result = updated;
  } else {
    const [created] = await db.insert(appSettings).values(input).returning();
    result = created;
  }

  const safe = { ...result } as Record<string, unknown>;
  SENSITIVE_KEYS.forEach((k) => delete safe[k]);
  return safe as PublicSettings;
}