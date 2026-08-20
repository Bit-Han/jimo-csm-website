// lib/constants/lead-dedupe.ts

// How long a brochure request for a given project+contact counts as
// "already served." Long enough to stop submit-mashing from burning
// through Resend sends; short enough that a genuine repeat visitor weeks
// later isn't locked out. Set very high (e.g. 24 * 365) for an effectively
// permanent block instead.
export const BROCHURE_DEDUPE_COOLDOWN_HOURS = 24;
export const BROCHURE_RETRY_COOLDOWN_SECONDS = 45;
