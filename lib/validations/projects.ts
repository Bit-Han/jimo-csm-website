

// lib/validations/projects.ts
import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(2, "Project name is required"),
  slug: z.string().optional(),
  location: z.string().min(2, "Location is required"),
  locationArea: z.string().min(2, "Location area is required"),
  status: z.enum(["selling_now", "active", "pre_launch", "draft", "sold_out"]).default("draft"),
  type: z.enum(["residential", "commercial", "mixed_use", "hospitality", "land"]).default("residential"),
  listingType: z.enum(["for_sale", "for_rent"]).default("for_sale"),
  description: z.string().optional(),
  heroHeadline: z.string().optional(),
  heroSubtext: z.string().optional(),
  heroImageUrl: z.string().url().optional().or(z.literal("")),
  videoUrl: z.string().url().optional().or(z.literal("")),
  startingPriceKobo: z.number().int().positive().optional(),
  deliveryTimeline: z.string().optional(),
  constructionStatus: z.enum(["planning", "under_construction", "completed"]).default("planning"),
  titleDocument: z.string().optional(),
  investmentHighlights: z.array(z.string()).default([]),
  locationAdvantages: z.array(z.string()).default([]),
  featuresAmenities: z.array(z.string()).default([]),
  paymentPlanDetails: z
    .object({
      description: z.string(),
      milestones: z.array(z.object({ label: z.string(), percentageValue: z.number() })),
    })
    .optional()
    .nullable(),
  whatsappNumber: z.string().optional(),
  callNumber: z.string().optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  focusKeyword: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

export const updateProjectSchema = createProjectSchema.partial();

export const createProjectUnitSchema = z.object({
  name: z.string().min(1, "Unit name is required"),
  status: z.enum(["active", "sold_out", "inactive"]).default("active"),
  totalUnits: z.number().int().min(0),
  availableUnits: z.number().int().min(0),
  launchPriceKobo: z.number().int().positive().optional(),
  currentPriceKobo: z.number().int().positive().optional(),
  ctaLabel: z.string().optional(),
  ctaLink: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
  orderIndex: z.number().int().min(0).default(0),
});

export const updateProjectUnitSchema = createProjectUnitSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateProjectUnitInput = z.infer<typeof createProjectUnitSchema>;