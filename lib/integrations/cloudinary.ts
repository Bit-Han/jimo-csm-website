// lib/integrations/cloudinary.ts
// ─────────────────────────────────────────────────────────────────────────────
// Cloudinary upload helpers — server-side only.
// All uploads go through Cloudinary; we store the returned URL in Supabase.
// ─────────────────────────────────────────────────────────────────────────────
import { v2 as cloudinary } from "cloudinary";

// Configure once — the SDK reads env vars automatically if you prefer,
// but explicit config is clearer.
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
	api_key: process.env.CLOUDINARY_API_KEY!,
	api_secret: process.env.CLOUDINARY_API_SECRET!,
	secure: true,
});

export type CloudinaryUploadResult = {
	publicId: string;
	secureUrl: string;
	resourceType: "image" | "video" | "raw";
	format: string;
	width?: number;
	height?: number;
	bytes: number;
	duration?: number; // for video
};

type UploadOptions = {
	folder: string; // e.g. "jimo/project_renders"
	resourceType?: "image" | "video" | "raw" | "auto";
	transformation?: object; // Cloudinary transformation params
};

/**
 * Upload a file (Buffer or base64 string) to Cloudinary.
 * Returns the public ID and secure URL.
 */
export async function uploadToCloudinary(
	file: Buffer | string,
	options: UploadOptions,
): Promise<CloudinaryUploadResult> {
	const result = await cloudinary.uploader.upload(
		Buffer.isBuffer(file)
			? `data:application/octet-stream;base64,${file.toString("base64")}`
			: file,
		{
			folder: options.folder,
			resource_type: options.resourceType ?? "auto",
			// Auto-compress images on upload
			transformation: options.transformation ?? [
				{ quality: "auto:good", fetch_format: "auto" },
			],
		},
	);

	return {
		publicId: result.public_id,
		secureUrl: result.secure_url,
		resourceType: result.resource_type as "image" | "video" | "raw",
		format: result.format,
		width: result.width,
		height: result.height,
		bytes: result.bytes,
		duration: result.duration,
	};
}

/**
 * Delete an asset from Cloudinary by its public ID.
 * Call this when a media record is deleted from the CMS.
 */
export async function deleteFromCloudinary(
	publicId: string,
	resourceType: "image" | "video" | "raw" = "image",
): Promise<void> {
	await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

/**
 * Generate a signed upload URL for client-side direct uploads.
 * Useful for large files — bypasses the server.
 */
export function generateSignedUploadParams(folder: string): {
	signature: string;
	timestamp: number;
	apiKey: string;
	cloudName: string;
	folder: string;
} {
	const timestamp = Math.round(new Date().getTime() / 1000);
	const paramsToSign = { timestamp, folder };
	const signature = cloudinary.utils.api_sign_request(
		paramsToSign,
		process.env.CLOUDINARY_API_SECRET!,
	);
	return {
		signature,
		timestamp,
		apiKey: process.env.CLOUDINARY_API_KEY!,
		cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
		folder,
	};
}

/**
 * Map a CMS media folder name to the Cloudinary folder path.
 */
export function getCloudinaryFolder(folder: string): string {
	const base = "jimo";
	return `${base}/${folder.replace(/_/g, "-")}`;
}
