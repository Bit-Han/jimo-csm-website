"use server";

export interface CompanyPageActionResult {
	success: boolean;
	message: string;
}

export async function saveCompanyPageContent(
	pageSlug: string,
	content: unknown,
): Promise<CompanyPageActionResult> {
	// TODO (integration stage):
	// For "home":
	//   db.update(homeContent).set({ data: content, updatedAt: new Date() }).where(eq(homeContent.id, 1))
	//   revalidatePath("/")
	// For "about" | "services" | "corporate-statement":
	//   db.update(companyContent).set({ [section]: content, updatedAt: new Date() }).where(eq(companyContent.id, 1))
	//   revalidatePath(`/${pageSlug}`)
	console.log("[saveCompanyPageContent]", pageSlug, content);
	await new Promise((res) => setTimeout(res, 400));
	return { success: true, message: "Page content saved." };
}

export async function publishCompanyPage(
	pageSlug: string,
): Promise<CompanyPageActionResult> {
	// TODO (integration stage):
	// Update publishStatus on the relevant content table row
	// revalidatePath(`/${pageSlug === "home" ? "" : pageSlug}`)
	console.log("[publishCompanyPage]", pageSlug);
	return { success: true, message: "Page published." };
}
