//@lib/db/schema/relations.ts
// import { relations } from "drizzle-orm";
// import {
// 	adminInvitations,
// 	adminUsers,
// 	brochures,
// 	formFields,
// 	forms,
// 	leads,
// 	mediaAssets,
// 	projectAmenities,
// 	projectCategories,
// 	projectChecklistItems,
// 	projectFacts,
// 	projectMedia,
// 	projects,
// 	projectTags,
// 	projectUnits,
// } from "./index";

// // ─── Projects ─────────────────────────────────────────────────────────────

// export const projectsRelations = relations(projects, ({ many }) => ({
// 	categories: many(projectCategories),
// 	tags: many(projectTags),
// 	facts: many(projectFacts),
// 	units: many(projectUnits),
// 	checklistItems: many(projectChecklistItems),
// 	amenities: many(projectAmenities),
// 	media: many(projectMedia),
// 	leads: many(leads),
// 	brochures: many(brochures),
// }));

// export const projectCategoriesRelations = relations(
// 	projectCategories,
// 	({ one }) => ({
// 		project: one(projects, {
// 			fields: [projectCategories.projectId],
// 			references: [projects.id],
// 		}),
// 	}),
// );

// export const projectTagsRelations = relations(projectTags, ({ one }) => ({
// 	project: one(projects, {
// 		fields: [projectTags.projectId],
// 		references: [projects.id],
// 	}),
// }));

// export const projectFactsRelations = relations(projectFacts, ({ one }) => ({
// 	project: one(projects, {
// 		fields: [projectFacts.projectId],
// 		references: [projects.id],
// 	}),
// }));

// export const projectUnitsRelations = relations(projectUnits, ({ one }) => ({
// 	project: one(projects, {
// 		fields: [projectUnits.projectId],
// 		references: [projects.id],
// 	}),
// }));

// export const projectChecklistItemsRelations = relations(
// 	projectChecklistItems,
// 	({ one }) => ({
// 		project: one(projects, {
// 			fields: [projectChecklistItems.projectId],
// 			references: [projects.id],
// 		}),
// 	}),
// );

// export const projectAmenitiesRelations = relations(
// 	projectAmenities,
// 	({ one }) => ({
// 		project: one(projects, {
// 			fields: [projectAmenities.projectId],
// 			references: [projects.id],
// 		}),
// 	}),
// );

// export const projectMediaRelations = relations(projectMedia, ({ one }) => ({
// 	project: one(projects, {
// 		fields: [projectMedia.projectId],
// 		references: [projects.id],
// 	}),
// }));

// // ─── Leads ────────────────────────────────────────────────────────────────

// export const leadsRelations = relations(leads, ({ one }) => ({
// 	project: one(projects, {
// 		fields: [leads.projectId],
// 		references: [projects.id],
// 	}),
// 	assignedToUser: one(adminUsers, {
// 		fields: [leads.assignedToUserId],
// 		references: [adminUsers.id],
// 	}),
// }));

// // ─── Brochures ────────────────────────────────────────────────────────────

// export const brochuresRelations = relations(brochures, ({ one }) => ({
// 	project: one(projects, {
// 		fields: [brochures.projectId],
// 		references: [projects.id],
// 	}),
// }));

// // ─── Media ────────────────────────────────────────────────────────────────

// export const mediaAssetsRelations = relations(mediaAssets, ({ one }) => ({
// 	linkedProject: one(projects, {
// 		fields: [mediaAssets.linkedProjectId],
// 		references: [projects.id],
// 	}),
// }));

// // ─── Forms ────────────────────────────────────────────────────────────────

// export const formsRelations = relations(forms, ({ many }) => ({
// 	fields: many(formFields),
// }));

// export const formFieldsRelations = relations(formFields, ({ one }) => ({
// 	form: one(forms, {
// 		fields: [formFields.formId],
// 		references: [forms.id],
// 	}),
// }));

// // ─── Admin users ──────────────────────────────────────────────────────────

// export const adminUsersRelations = relations(adminUsers, ({ many, one }) => ({
// 	sentInvitations: many(adminInvitations, {
// 		relationName: "invitedBy",
// 	}),
// 	acceptedInvitation: one(adminInvitations, {
// 		fields: [adminUsers.id],
// 		references: [adminInvitations.acceptedByUserId],
// 		relationName: "acceptedBy",
// 	}),
// 	assignedLeads: many(leads),
// }));

// export const adminInvitationsRelations = relations(
// 	adminInvitations,
// 	({ one }) => ({
// 		invitedByUser: one(adminUsers, {
// 			fields: [adminInvitations.invitedByUserId],
// 			references: [adminUsers.id],
// 			relationName: "invitedBy",
// 		}),
// 		acceptedByUser: one(adminUsers, {
// 			fields: [adminInvitations.acceptedByUserId],
// 			references: [adminUsers.id],
// 			relationName: "acceptedBy",
// 		}),
// 	}),
// );


//@lib/db/schema/relations.ts
import { relations } from "drizzle-orm";
import {
	adminInvitations,
	adminUsers,
	brochures,
	formFields,
	forms,
	landingPages,
	leads,
	mediaAssets,
	projectAmenities,
	projectCategories,
	projectChecklistItems,
	projectFacts,
	projectMedia,
	projects,
	projectTags,
	projectUnits,
} from "./index";

// ─── Projects ─────────────────────────────────────────────────────────────

export const projectsRelations = relations(projects, ({ many }) => ({
	categories: many(projectCategories),
	tags: many(projectTags),
	facts: many(projectFacts),
	units: many(projectUnits),
	checklistItems: many(projectChecklistItems),
	amenities: many(projectAmenities),
	media: many(projectMedia),
	leads: many(leads),
	brochures: many(brochures),
	landingPages: many(landingPages),
}));

export const projectCategoriesRelations = relations(
	projectCategories,
	({ one }) => ({
		project: one(projects, {
			fields: [projectCategories.projectId],
			references: [projects.id],
		}),
	}),
);

export const projectTagsRelations = relations(projectTags, ({ one }) => ({
	project: one(projects, {
		fields: [projectTags.projectId],
		references: [projects.id],
	}),
}));

export const projectFactsRelations = relations(projectFacts, ({ one }) => ({
	project: one(projects, {
		fields: [projectFacts.projectId],
		references: [projects.id],
	}),
}));

export const projectUnitsRelations = relations(projectUnits, ({ one }) => ({
	project: one(projects, {
		fields: [projectUnits.projectId],
		references: [projects.id],
	}),
}));

export const projectChecklistItemsRelations = relations(
	projectChecklistItems,
	({ one }) => ({
		project: one(projects, {
			fields: [projectChecklistItems.projectId],
			references: [projects.id],
		}),
	}),
);

export const projectAmenitiesRelations = relations(
	projectAmenities,
	({ one }) => ({
		project: one(projects, {
			fields: [projectAmenities.projectId],
			references: [projects.id],
		}),
	}),
);

export const projectMediaRelations = relations(projectMedia, ({ one }) => ({
	project: one(projects, {
		fields: [projectMedia.projectId],
		references: [projects.id],
	}),
}));

// ─── Leads ────────────────────────────────────────────────────────────────

export const leadsRelations = relations(leads, ({ one }) => ({
	project: one(projects, {
		fields: [leads.projectId],
		references: [projects.id],
	}),
	landingPage: one(landingPages, {
		fields: [leads.landingPageId],
		references: [landingPages.id],
	}),
	assignedToUser: one(adminUsers, {
		fields: [leads.assignedToUserId],
		references: [adminUsers.id],
	}),
}));

// ─── Landing Pages ────────────────────────────────────────────────────────

export const landingPagesRelations = relations(landingPages, ({ one, many }) => ({
	linkedProject: one(projects, {
		fields: [landingPages.linkedProjectId],
		references: [projects.id],
	}),
	form: one(forms, {
		fields: [landingPages.formId],
		references: [forms.id],
	}),
	createdByUser: one(adminUsers, {
		fields: [landingPages.createdByUserId],
		references: [adminUsers.id],
	}),
	leads: many(leads),
}));

// ─── Brochures ────────────────────────────────────────────────────────────

export const brochuresRelations = relations(brochures, ({ one }) => ({
	project: one(projects, {
		fields: [brochures.projectId],
		references: [projects.id],
	}),
}));

// ─── Media ────────────────────────────────────────────────────────────────

export const mediaAssetsRelations = relations(mediaAssets, ({ one }) => ({
	linkedProject: one(projects, {
		fields: [mediaAssets.linkedProjectId],
		references: [projects.id],
	}),
}));

// ─── Forms ────────────────────────────────────────────────────────────────

export const formsRelations = relations(forms, ({ many }) => ({
	fields: many(formFields),
	landingPages: many(landingPages),
}));

export const formFieldsRelations = relations(formFields, ({ one }) => ({
	form: one(forms, {
		fields: [formFields.formId],
		references: [forms.id],
	}),
}));

// ─── Admin users ──────────────────────────────────────────────────────────

export const adminUsersRelations = relations(adminUsers, ({ many, one }) => ({
	sentInvitations: many(adminInvitations, {
		relationName: "invitedBy",
	}),
	acceptedInvitation: one(adminInvitations, {
		fields: [adminUsers.id],
		references: [adminInvitations.acceptedByUserId],
		relationName: "acceptedBy",
	}),
	assignedLeads: many(leads),
	createdLandingPages: many(landingPages),
}));

export const adminInvitationsRelations = relations(
	adminInvitations,
	({ one }) => ({
		invitedByUser: one(adminUsers, {
			fields: [adminInvitations.invitedByUserId],
			references: [adminUsers.id],
			relationName: "invitedBy",
		}),
		acceptedByUser: one(adminUsers, {
			fields: [adminInvitations.acceptedByUserId],
			references: [adminUsers.id],
			relationName: "acceptedBy",
		}),
	}),
);