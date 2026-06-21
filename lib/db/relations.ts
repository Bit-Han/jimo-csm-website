// lib/db/relations.ts
// ─────────────────────────────────────────────────────────────────────────────
// Drizzle relations — used by the query builder (db.query.*) for joins.
// These do NOT create FK constraints (those are in the schema files).
// ─────────────────────────────────────────────────────────────────────────────
import { relations } from "drizzle-orm";
import {
	profiles,
	invitations,
	projects,
	projectUnits,
	projectGallery,
	media,
	forms,
	leads,
	leadActivities,
	leadNotes,
	landingPages,
	brochures,
	articles,
	companyPages,
} from "./schema";

// ── Profiles ──────────────────────────────────────────
export const profilesRelations = relations(profiles, ({ one, many }) => ({
	invitedByProfile: one(profiles, {
		fields: [profiles.invitedBy],
		references: [profiles.id],
		relationName: "inviter",
	}),
	invitedProfiles: many(profiles, { relationName: "inviter" }),
	sentInvitations: many(invitations),
	createdProjects: many(projects, { relationName: "projectCreator" }),
	assignedLeads: many(leads),
	uploadedMedia: many(media),
	createdArticles: many(articles),
}));

// ── Invitations ───────────────────────────────────────
export const invitationsRelations = relations(invitations, ({ one }) => ({
	inviter: one(profiles, {
		fields: [invitations.invitedBy],
		references: [profiles.id],
	}),
}));

// ── Projects ──────────────────────────────────────────
export const projectsRelations = relations(projects, ({ one, many }) => ({
	creator: one(profiles, {
		fields: [projects.createdBy],
		references: [profiles.id],
		relationName: "projectCreator",
	}),
	lastEditor: one(profiles, {
		fields: [projects.lastEditedBy],
		references: [profiles.id],
	}),
	units: many(projectUnits),
	gallery: many(projectGallery),
	leads: many(leads),
	brochures: many(brochures),
	articles: many(articles),
	landingPages: many(landingPages),
}));

export const projectUnitsRelations = relations(projectUnits, ({ one }) => ({
	project: one(projects, {
		fields: [projectUnits.projectId],
		references: [projects.id],
	}),
}));

export const projectGalleryRelations = relations(projectGallery, ({ one }) => ({
	project: one(projects, {
		fields: [projectGallery.projectId],
		references: [projects.id],
	}),
	mediaItem: one(media, {
		fields: [projectGallery.mediaId],
		references: [media.id],
	}),
}));

// ── Media ─────────────────────────────────────────────
export const mediaRelations = relations(media, ({ one, many }) => ({
	project: one(projects, {
		fields: [media.projectId],
		references: [projects.id],
	}),
	uploader: one(profiles, {
		fields: [media.uploadedBy],
		references: [profiles.id],
	}),
	galleryItems: many(projectGallery),
}));

// ── Forms ─────────────────────────────────────────────
export const formsRelations = relations(forms, ({ many }) => ({
	leads: many(leads),
}));

// ── Leads ─────────────────────────────────────────────
export const leadsRelations = relations(leads, ({ one, many }) => ({
	project: one(projects, {
		fields: [leads.projectId],
		references: [projects.id],
	}),
	landingPage: one(landingPages, {
		fields: [leads.landingPageId],
		references: [landingPages.id],
	}),
	form: one(forms, {
		fields: [leads.formId],
		references: [forms.id],
	}),
	assignedTo: one(profiles, {
		fields: [leads.assignedTo],
		references: [profiles.id],
	}),
	activities: many(leadActivities),
	notes: many(leadNotes),
}));

export const leadActivitiesRelations = relations(leadActivities, ({ one }) => ({
	lead: one(leads, {
		fields: [leadActivities.leadId],
		references: [leads.id],
	}),
	actor: one(profiles, {
		fields: [leadActivities.createdBy],
		references: [profiles.id],
	}),
}));

export const leadNotesRelations = relations(leadNotes, ({ one }) => ({
	lead: one(leads, {
		fields: [leadNotes.leadId],
		references: [leads.id],
	}),
	author: one(profiles, {
		fields: [leadNotes.createdBy],
		references: [profiles.id],
	}),
}));

// ── Landing Pages ─────────────────────────────────────
export const landingPagesRelations = relations(
	landingPages,
	({ one, many }) => ({
		project: one(projects, {
			fields: [landingPages.projectId],
			references: [projects.id],
		}),
		form: one(forms, {
			fields: [landingPages.formId],
			references: [forms.id],
		}),
		leads: many(leads),
	}),
);

// ── Brochures ─────────────────────────────────────────
export const brochuresRelations = relations(brochures, ({ one }) => ({
	project: one(projects, {
		fields: [brochures.projectId],
		references: [projects.id],
	}),
	gateForm: one(forms, {
		fields: [brochures.gateFormId],
		references: [forms.id],
	}),
	creator: one(profiles, {
		fields: [brochures.createdBy],
		references: [profiles.id],
	}),
}));

// ── Articles ──────────────────────────────────────────
export const articlesRelations = relations(articles, ({ one }) => ({
	project: one(projects, {
		fields: [articles.projectId],
		references: [projects.id],
	}),
	featuredImage: one(media, {
		fields: [articles.featuredImageId],
		references: [media.id],
	}),
	author: one(profiles, {
		fields: [articles.createdBy],
		references: [profiles.id],
	}),
}));

// ── Company Pages ─────────────────────────────────────
export const companyPagesRelations = relations(companyPages, ({ one }) => ({
	lastEditor: one(profiles, {
		fields: [companyPages.lastEditedBy],
		references: [profiles.id],
	}),
}));
