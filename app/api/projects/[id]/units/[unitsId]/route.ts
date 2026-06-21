// // src/app/api/projects/[id]/units/[unitId]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { projectUnits } from "@/lib/db/schema";
// import { requirePermission } from "@/lib/auth";
// import { projectUnitSchema } from "@/lib/validations";
// import { eq, and } from "drizzle-orm";

// type Params = { params: Promise<{ id: string; unitId: string }> };

// // PATCH /api/projects/[id]/units/[unitId]
// export async function PATCH(req: NextRequest, { params }: Params) {
// 	try {
// 		await requirePermission("projects.edit");
// 		const { id, unitId } = await params;
// 		const body = await req.json();

// 		const parsed = projectUnitSchema.partial().safeParse(body);
// 		if (!parsed.success) {
// 			return NextResponse.json(
// 				{
// 					error: "Validation failed",
// 					issues: parsed.error.flatten().fieldErrors,
// 				},
// 				{ status: 400 },
// 			);
// 		}

// 		const [updated] = await db
// 			.update(projectUnits)
// 			.set({ ...parsed.data, updatedAt: new Date() })
// 			.where(and(eq(projectUnits.id, unitId), eq(projectUnits.projectId, id)))
// 			.returning();

// 		if (!updated) {
// 			return NextResponse.json({ error: "Unit not found" }, { status: 404 });
// 		}

// 		return NextResponse.json({ data: updated });
// 	} catch (error) {
// 		console.error("PATCH /api/projects/[id]/units/[unitId] error:", error);
// 		return NextResponse.json(
// 			{ error: "Failed to update unit" },
// 			{ status: 500 },
// 		);
// 	}
// }

// // DELETE /api/projects/[id]/units/[unitId]
// export async function DELETE(_req: NextRequest, { params }: Params) {
// 	try {
// 		await requirePermission("projects.edit");
// 		const { id, unitId } = await params;

// 		await db
// 			.delete(projectUnits)
// 			.where(and(eq(projectUnits.id, unitId), eq(projectUnits.projectId, id)));

// 		return NextResponse.json({ success: true });
// 	} catch (error) {
// 		console.error("DELETE /api/projects/[id]/units/[unitId] error:", error);
// 		return NextResponse.json(
// 			{ error: "Failed to delete unit" },
// 			{ status: 500 },
// 		);
// 	}
// }




// app/api/projects/[id]/units/[unitId]/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import { ok, noContent, unauthorized, forbidden, notFound, badRequest, serverError } from "@/lib/utils/api-response";
import { updateProjectUnit, deleteProjectUnit } from "@/lib/services/projects.service";
import { updateProjectUnitSchema } from "@/lib/validations/projects";

type Params = { params: Promise<{ id: string; unitId: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const auth = await getAuthUser();
    if (!auth) return unauthorized();
    if (!can(auth.profile.role, "edit_projects")) return forbidden();

    const { unitId } = await params;
    const body = await req.json();
    // Pricing change guard
    if (("currentPriceKobo" in body || "launchPriceKobo" in body) && !can(auth.profile.role, "edit_pricing")) {
      return forbidden("You do not have permission to edit pricing.");
    }
    const parsed = updateProjectUnitSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? "Validation failed");
    const updated = await updateProjectUnit(unitId, parsed.data);
    if (!updated) return notFound("Unit not found.");
    return ok(updated);
  } catch (err) {
    return serverError("Failed to update unit.", err);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const auth = await getAuthUser();
    if (!auth) return unauthorized();
    if (!can(auth.profile.role, "edit_projects")) return forbidden();
    const { unitId } = await params;
    await deleteProjectUnit(unitId);
    return noContent();
  } catch (err) {
    return serverError("Failed to delete unit.", err);
  }
}