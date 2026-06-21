// // src/app/api/projects/[id]/units/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { projectUnits } from "@/lib/db/schema";
// import { requirePermission } from "@/lib/auth";
// import { projectUnitSchema } from "@/lib/validations";
// import { eq, asc } from "drizzle-orm";

// type Params = { params: Promise<{ id: string }> };

// // GET /api/projects/[id]/units
// export async function GET(_req: NextRequest, { params }: Params) {
// 	try {
// 		await requirePermission("projects.view");
// 		const { id } = await params;

// 		const units = await db
// 			.select()
// 			.from(projectUnits)
// 			.where(eq(projectUnits.projectId, id))
// 			.orderBy(asc(projectUnits.sortOrder));

// 		return NextResponse.json({ data: units });
// 	} catch (error) {
// 		console.error("GET /api/projects/[id]/units error:", error);
// 		return NextResponse.json(
// 			{ error: "Failed to fetch units" },
// 			{ status: 500 },
// 		);
// 	}
// }

// // POST /api/projects/[id]/units — add a new unit to a project
// export async function POST(req: NextRequest, { params }: Params) {
// 	try {
// 		await requirePermission("projects.edit");
// 		const { id } = await params;
// 		const body = await req.json();

// 		const parsed = projectUnitSchema.safeParse(body);
// 		if (!parsed.success) {
// 			return NextResponse.json(
// 				{
// 					error: "Validation failed",
// 					issues: parsed.error.flatten().fieldErrors,
// 				},
// 				{ status: 400 },
// 			);
// 		}

// 		const [newUnit] = await db
// 			.insert(projectUnits)
// 			.values({ ...parsed.data, projectId: id })
// 			.returning();

// 		return NextResponse.json({ data: newUnit }, { status: 201 });
// 	} catch (error) {
// 		console.error("POST /api/projects/[id]/units error:", error);
// 		return NextResponse.json(
// 			{ error: "Failed to create unit" },
// 			{ status: 500 },
// 		);
// 	}
// }




// app/api/projects/[id]/units/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import { ok, created, unauthorized, forbidden, badRequest, serverError } from "@/lib/utils/api-response";
import { getProjectUnits, createProjectUnit, reorderProjectUnits } from "@/lib/services/projects.service";
import { createProjectUnitSchema } from "@/lib/validations/projects";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const auth = await getAuthUser();
    if (!auth) return unauthorized();
    if (!can(auth.profile.role, "view_projects")) return forbidden();
    const { id } = await params;
    const units = await getProjectUnits(id);
    return ok(units);
  } catch (err) {
    return serverError("Failed to load units.", err);
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const auth = await getAuthUser();
    if (!auth) return unauthorized();
    if (!can(auth.profile.role, "edit_projects")) return forbidden();
    const { id } = await params;
    const body = await req.json();
    const parsed = createProjectUnitSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? "Validation failed");
    const unit = await createProjectUnit(id, parsed.data);
    return created(unit);
  } catch (err) {
    return serverError("Failed to create unit.", err);
  }
}

// PUT /api/projects/[id]/units — reorder units
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const auth = await getAuthUser();
    if (!auth) return unauthorized();
    if (!can(auth.profile.role, "edit_projects")) return forbidden();
    const body = await req.json();
    if (!Array.isArray(body.order)) return badRequest("order array required");
    await reorderProjectUnits(body.order);
    return ok({ reordered: true });
  } catch (err) {
    return serverError("Failed to reorder units.", err);
  }
}