// lib/utils/password.ts

export interface PasswordRequirement {
	id: string;
	label: string;
	test: (password: string) => boolean;
}

export const passwordRequirements: PasswordRequirement[] = [
	{ id: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
	{
		id: "uppercase",
		label: "One uppercase letter (A–Z)",
		test: (p) => /[A-Z]/.test(p),
	},
	{
		id: "lowercase",
		label: "One lowercase letter (a–z)",
		test: (p) => /[a-z]/.test(p),
	},
	{ id: "number", label: "One number (0–9)", test: (p) => /[0-9]/.test(p) },
	{
		id: "special",
		label: "One special character (!@#$…)",
		test: (p) => /[^A-Za-z0-9]/.test(p),
	},
];

export function isStrongPassword(password: string): boolean {
	return passwordRequirements.every((r) => r.test(password));
}
