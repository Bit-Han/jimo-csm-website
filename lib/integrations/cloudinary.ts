import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface SignedImageUploadParams {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
  publicId: string;
}

/**
 * Signs a direct browser -> Cloudinary upload for a generic image.
 * A random suffix avoids collisions if two images upload in the same second
 * in the same folder (e.g. two team photos added back-to-back).
 */
export function signImageUpload(
	folder: string,
	publicIdPrefix = "img",
): SignedImageUploadParams {
	const timestamp = Math.round(Date.now() / 1000);
	const randomSuffix = Math.random().toString(36).slice(2, 8);
	const publicId = `${publicIdPrefix}-${timestamp}-${randomSuffix}`;

	const signature = cloudinary.utils.api_sign_request(
		{ timestamp, folder, public_id: publicId },
		process.env.CLOUDINARY_API_SECRET!,
	);

	return {
		timestamp,
		signature,
		apiKey: process.env.CLOUDINARY_API_KEY!,
		cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
		folder,
		publicId,
	};
}


export interface SignedUploadParams {
	timestamp: number;
	signature: string;
	apiKey: string;
	cloudName: string;
	folder: string;
	publicId: string;
}

/**
 * Signs a direct browser -> Cloudinary upload. Pure synchronous crypto,
 * no network call — this cannot hang. The browser must submit EXACTLY
 * these params (folder, public_id, timestamp) or Cloudinary rejects it.
 */
export function signBrochureUpload(publicId: string): SignedUploadParams {
	const timestamp = Math.round(Date.now() / 1000);
	const folder = "jimo-property/brochures";

	const signature = cloudinary.utils.api_sign_request(
		{ timestamp, folder, public_id: publicId },
		process.env.CLOUDINARY_API_SECRET!,
	);

	return {
		timestamp,
		signature,
		apiKey: process.env.CLOUDINARY_API_KEY!,
		cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
		folder,
		publicId,
	};
}

/** Wrap any external call so a stalled network call fails loudly instead of hanging forever. */
export function withTimeout<T>(
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

/**
 * Extracts the Cloudinary public_id from one of OUR OWN secure URLs. Only
 * reliable for URLs we generated (predictable /upload/v<version>/<id>.<ext>
 * shape) — returns null for anything else so callers can safely skip
 * deletion instead of sending garbage to Cloudinary's API.
 */
export function extractCloudinaryPublicId(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
  if (!match) return null;
  return decodeURIComponent(match[1]!);
}

/**
 * Deletes a Cloudinary asset by URL, tolerant of everything that can go
 * wrong: foreign/missing URLs are skipped silently, a slow Cloudinary call
 * is bounded by withTimeout, and a Cloudinary error is logged, never
 * thrown — a failed cleanup must never fail the save/delete that
 * triggered it, since the database write already succeeded by this point.
 */
export async function deleteCloudinaryAssetSafe(
  url: string | null | undefined,
  resourceType: "image" | "raw" = "image",
): Promise<void> {
  const publicId = extractCloudinaryPublicId(url);
  if (!publicId) return;

  try {
    await withTimeout(
      cloudinary.uploader.destroy(publicId, { resource_type: resourceType }),
      8000,
      "Cloudinary delete",
    );
  } catch (err) {
    console.warn("[deleteCloudinaryAssetSafe] failed to delete", publicId, err);
  }
}

export { cloudinary };