import { createAdminClient } from "@/lib/supabase/admin";

export const STORAGE_BUCKET = "jimo-public";

// Every folder a StorageImageField is allowed to write into. Exact-match
// only — this is what makes path traversal impossible: a folder value that
// isn't one of these known-safe strings is rejected outright, not
// "cleaned up." Extend this set (and nowhere else) whenever a new
// Supabase-Storage-backed image field is added.
// Currently only Team Member photos use Supabase Storage — everything
// else (brochures, insights, home/about hero images) is on Cloudinary.
export const ALLOWED_STORAGE_FOLDERS = new Set(["team-photos", "general"]);

// MIME type -> extension, so the stored object's extension is always
// derived from a value already validated against a fixed allow-list
// (ALLOWED_TYPES in the upload route), never from the client-supplied
// filename, which an attacker fully controls.
const MIME_TO_EXT: Record<string, string> = {
	"image/jpeg": "jpg",
	"image/jpg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
	"image/gif": "gif",
	"image/svg+xml": "svg",
};

export function extensionForMimeType(mimeType: string): string | null {
	return MIME_TO_EXT[mimeType] ?? null;
}

/** Sanitizes a filename fragment into a safe, storage-key-friendly string.
 * Never returns an empty string — falls back to "image" so a filename that
 * strips away entirely (all-unicode, or just ".png") still produces a
 * valid object key instead of an empty path segment. */
export function safeFileNameFragment(rawName: string): string {
	const stripped = rawName
		.replace(/\.[^/.]+$/, "")
		.toLowerCase()
		.replace(/[^a-z0-9]/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "")
		.slice(0, 40);
	return stripped || "image";
}

function withTimeout<T>(
	promise: Promise<T>,
	ms: number,
	label: string,
): Promise<T> {
	return Promise.race([
		promise,
		new Promise<T>((_, reject) =>
			setTimeout(
				() => reject(new Error(`${label} timed out after ${ms}ms`)),
				ms,
			),
		),
	]);
}

/** Extracts the object path from one of OUR OWN Supabase public storage
 * URLs. Only reliable for the standard public-URL shape Supabase
 * generates — returns null for anything else so callers can safely skip
 * deletion instead of risking deleting an unrelated or malformed path. */
export function extractStoragePathFromUrl(
	url: string | null | undefined,
): string | null {
	if (!url) return null;
	const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
	const index = url.indexOf(marker);
	if (index === -1) return null;
	const path = url.slice(index + marker.length).split("?")[0];
	return path ? decodeURIComponent(path) : null;
}

/** Deletes a Supabase Storage object by its public URL. Tolerant of
 * everything that can go wrong: unrecognized URLs are skipped silently, a
 * slow Supabase call is bounded, and any error is logged, never thrown —
 * a failed cleanup must never fail the save that triggered it, since the
 * database write already succeeded by that point. */
export async function deleteStorageObjectSafe(
	url: string | null | undefined,
): Promise<void> {
	const path = extractStoragePathFromUrl(url);
	if (!path) return;

	try {
		const adminSupabase = createAdminClient();
		const { error } = await withTimeout(
			adminSupabase.storage.from(STORAGE_BUCKET).remove([path]),
			8000,
			"Supabase Storage delete",
		);
		if (error)
			console.warn(
				"[deleteStorageObjectSafe] failed to delete",
				path,
				error.message,
			);
	} catch (err) {
		console.warn("[deleteStorageObjectSafe] failed to delete", path, err);
	}
}
