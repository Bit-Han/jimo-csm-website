import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "jimo-public";
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export async function POST(request: NextRequest) {
  // 1. Auth check — must be a signed-in admin
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    // folder is optional — e.g. "team-photos", "hero", "services"
    const folder = String(formData.get("folder") ?? "general").trim();

    // 2. Validate
    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10 MB." },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `File type not allowed. Allowed types: ${ALLOWED_TYPES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // 3. Build a unique file path
    const ext = file.name.split(".").pop() ?? "jpg";
    const timestamp = Date.now();
    const safeName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 40);
    const filePath = `${folder}/${timestamp}-${safeName}.${ext}`;

    // 4. Convert File to Buffer for Supabase upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 5. Upload using the SERVICE ROLE client (bypasses RLS)
    const adminSupabase = createAdminClient();
    const { error: uploadError } = await adminSupabase.storage
      .from(BUCKET)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("[storage/upload]", uploadError.message);
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 },
      );
    }

    // 6. Get the public URL
    const {
      data: { publicUrl },
    } = adminSupabase.storage.from(BUCKET).getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filePath,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error.";
    console.error("[storage/upload]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}