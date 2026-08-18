// lib/utils/bot-heuristics.ts

// Minimum time (ms) a human plausibly takes to see and fill the form.
// Scripts that fire immediately on page load get caught here.
export const MIN_HUMAN_SUBMIT_MS = 1500;

export interface BotCheckInput {
	honeypot?: string | null;
	renderedAt?: string | null; // ms epoch timestamp, set client-side on mount
}

export function looksLikeBot(input: BotCheckInput): boolean {
	if (input.honeypot && input.honeypot.trim().length > 0) return true;

	if (input.renderedAt) {
		const renderedAtMs = Number(input.renderedAt);
		if (Number.isFinite(renderedAtMs)) {
			const elapsed = Date.now() - renderedAtMs;
			if (elapsed >= 0 && elapsed < MIN_HUMAN_SUBMIT_MS) return true;
		}
	}

	return false;
}
