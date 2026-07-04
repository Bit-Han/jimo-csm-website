import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type CloudinaryFolder =
	| "jimo-property/project-renders"
	| "jimo-property/interior-renders"
	| "jimo-property/construction-updates"
	| "jimo-property/brochures"
	| "jimo-property/team-photos"
	| "jimo-property/logos-icons"
	| "jimo-property/documents"
	| "jimo-property/videos";

export interface CloudinaryUploadResult {
	publicId: string;
	secureUrl: string;
	url: string;
	resourceType: "image" | "video" | "raw";
	format: string;
	width: number | null;
	height: number | null;
	sizeBytes: number;
}

export async function uploadToCloudinary(
	file: File,
	folder: CloudinaryFolder,
): Promise<CloudinaryUploadResult> {
	const bytes = await file.arrayBuffer();
	const buffer = Buffer.from(bytes);
	const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

	const result = await cloudinary.uploader.upload(dataUri, {
		folder,
		resource_type: "auto",
	});

	return {
		publicId: result.public_id,
		secureUrl: result.secure_url,
		url: result.url,
		resourceType: result.resource_type as "image" | "video" | "raw",
		format: result.format,
		width: result.width ?? null,
		height: result.height ?? null,
		sizeBytes: result.bytes,
	};
}

export async function deleteFromCloudinary(
	publicId: string,
	resourceType: "image" | "video" | "raw" = "image",
): Promise<void> {
	await cloudinary.uploader.destroy(publicId, {
		resource_type: resourceType,
	});
}

export { cloudinary };
