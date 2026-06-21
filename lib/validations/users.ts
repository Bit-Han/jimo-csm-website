// lib/validations/users.ts
import { z } from "zod";

export const inviteUserSchema = z.object({
	email: z.string().email("Valid email required"),
	role: z.enum([
		"website_manager",
		"content_seo",
		"sales_crm",
		"marketing_admin",
	]), // super_admin cannot be invited — only manually set
});

export const setupAccountSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.regex(/[A-Z]/, "Must contain an uppercase letter")
		.regex(/[0-9]/, "Must contain a number"),
});

export const updateProfileSchema = z.object({
	name: z.string().min(2).optional(),
	role: z
		.enum(["website_manager", "content_seo", "sales_crm", "marketing_admin"])
		.optional(),
	status: z.enum(["active", "inactive"]).optional(),
});

export type InviteUserInput = z.infer<typeof inviteUserSchema>;
export type SetupAccountInput = z.infer<typeof setupAccountSchema>;
