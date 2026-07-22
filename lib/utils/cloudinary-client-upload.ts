// export interface SignedUploadParams {
// 	timestamp: number;
// 	signature: string;
// 	apiKey: string;
// 	cloudName: string;
// 	folder: string;
// 	publicId: string;
// }

// export function uploadDirectToCloudinary(
// 	signed: SignedUploadParams,
// 	file: File,
// 	onProgress: (pct: number) => void,
// 	xhrRef?: React.MutableRefObject<XMLHttpRequest | null>,
// 	resourceType: "raw" | "image" | "video"= "raw", // brochures default to "raw" unchanged; images pass "image"
// ): Promise<{ publicId: string; secureUrl: string }> {
// 	return new Promise((resolve, reject) => {
// 		const fd = new FormData();
// 		fd.append("file", file);
// 		fd.append("api_key", signed.apiKey);
// 		fd.append("timestamp", String(signed.timestamp));
// 		fd.append("signature", signed.signature);
// 		fd.append("folder", signed.folder);
// 		fd.append("public_id", signed.publicId);

// 		const xhr = new XMLHttpRequest();
// 		xhr.timeout = 60000;
// 		if (xhrRef) xhrRef.current = xhr;

// 		xhr.upload.addEventListener("progress", (e) => {
// 			if (e.lengthComputable)
// 				onProgress(Math.round((e.loaded / e.total) * 100));
// 		});

// 		xhr.addEventListener("load", () => {
// 			try {
// 				const data = JSON.parse(xhr.responseText);
// 				if (xhr.status >= 200 && xhr.status < 300) {
// 					resolve({ publicId: data.public_id, secureUrl: data.secure_url });
// 				} else {
// 					reject(new Error(data.error?.message ?? "Cloudinary upload failed."));
// 				}
// 			} catch {
// 				reject(new Error("Invalid response from Cloudinary."));
// 			}
// 		});

// 		xhr.addEventListener("error", () =>
// 			reject(new Error("Network error during upload.")),
// 		);
// 		xhr.addEventListener("timeout", () =>
// 			reject(new Error("Upload timed out. Please try again.")),
// 		);
// 		xhr.addEventListener("abort", () => reject(new Error("Upload cancelled.")));

// 		xhr.open(
// 			"POST",
// 			`https://api.cloudinary.com/v1_1/${signed.cloudName}/${resourceType}/upload`,
// 		);
// 		xhr.send(fd);
// 	});
// }

export interface SignedUploadParams {
	timestamp: number;
	signature: string;
	apiKey: string;
	cloudName: string;
	folder: string;
	publicId: string;
}

// Cloudinary hard-rejects single-request uploads over 100MB (413 error).
// Staying well under that with a safety margin before switching to
// chunked upload avoids ever hitting that wall on a slow connection
// where the file inflates slightly in transit overhead.
const CHUNKED_UPLOAD_THRESHOLD = 90 * 1024 * 1024;
// Cloudinary's own documented default and minimum-safe chunk size.
const CHUNK_SIZE = 20 * 1024 * 1024;

export function uploadDirectToCloudinary(
	signed: SignedUploadParams,
	file: File,
	onProgress: (pct: number) => void,
	xhrRef?: React.MutableRefObject<XMLHttpRequest | null>,
	resourceType: "raw" | "image" | "video" = "raw",
): Promise<{ publicId: string; secureUrl: string }> {
	return new Promise((resolve, reject) => {
		const fd = new FormData();
		fd.append("file", file);
		fd.append("api_key", signed.apiKey);
		fd.append("timestamp", String(signed.timestamp));
		fd.append("signature", signed.signature);
		fd.append("folder", signed.folder);
		fd.append("public_id", signed.publicId);

		const xhr = new XMLHttpRequest();
		xhr.timeout = 120000;
		if (xhrRef) xhrRef.current = xhr;

		xhr.upload.addEventListener("progress", (e) => {
			if (e.lengthComputable)
				onProgress(Math.round((e.loaded / e.total) * 100));
		});

		xhr.addEventListener("load", () => {
			try {
				const data = JSON.parse(xhr.responseText);
				if (xhr.status >= 200 && xhr.status < 300) {
					resolve({ publicId: data.public_id, secureUrl: data.secure_url });
				} else {
					reject(new Error(data.error?.message ?? "Cloudinary upload failed."));
				}
			} catch {
				reject(new Error("Invalid response from Cloudinary."));
			}
		});

		xhr.addEventListener("error", () =>
			reject(new Error("Network error during upload.")),
		);
		xhr.addEventListener("timeout", () =>
			reject(new Error("Upload timed out. Please try again.")),
		);
		xhr.addEventListener("abort", () => reject(new Error("Upload cancelled.")));

		xhr.open(
			"POST",
			`https://api.cloudinary.com/v1_1/${signed.cloudName}/${resourceType}/upload`,
		);
		xhr.send(fd);
	});
}

function uploadChunk(
	signed: SignedUploadParams,
	chunk: Blob,
	start: number,
	end: number,
	total: number,
	uploadId: string,
	resourceType: "video" | "raw" | "image",
): Promise<{ publicId?: string; secureUrl?: string }> {
	return new Promise((resolve, reject) => {
		const fd = new FormData();
		fd.append("file", chunk);
		fd.append("api_key", signed.apiKey);
		fd.append("timestamp", String(signed.timestamp));
		fd.append("signature", signed.signature);
		fd.append("folder", signed.folder);
		fd.append("public_id", signed.publicId);

		const xhr = new XMLHttpRequest();
		xhr.timeout = 120000;
		xhr.open(
			"POST",
			`https://api.cloudinary.com/v1_1/${signed.cloudName}/${resourceType}/upload`,
		);
		// Per Cloudinary's chunked upload protocol: same X-Unique-Upload-Id
		// across every chunk of one file; Content-Range marks this chunk's
		// byte range within the whole file.
		xhr.setRequestHeader("X-Unique-Upload-Id", uploadId);
		xhr.setRequestHeader("Content-Range", `bytes ${start}-${end - 1}/${total}`);

		xhr.addEventListener("load", () => {
			try {
				const data = JSON.parse(xhr.responseText);
				if (xhr.status >= 200 && xhr.status < 300) {
					resolve({ publicId: data.public_id, secureUrl: data.secure_url });
				} else {
					reject(new Error(data.error?.message ?? "Chunk upload failed."));
				}
			} catch {
				reject(new Error("Invalid response from Cloudinary."));
			}
		});
		xhr.addEventListener("error", () =>
			reject(new Error("Network error during upload.")),
		);
		xhr.addEventListener("timeout", () =>
			reject(new Error("Upload timed out. Please try again.")),
		);
		xhr.send(fd);
	});
}

async function uploadDirectToCloudinaryChunked(
	signed: SignedUploadParams,
	file: File,
	onProgress: (pct: number) => void,
	resourceType: "video" | "raw" | "image",
): Promise<{ publicId: string; secureUrl: string }> {
	const total = file.size;
	const uploadId = `${signed.publicId}-${Date.now()}`;
	let lastResult: { publicId?: string; secureUrl?: string } = {};

	for (let start = 0; start < total; start += CHUNK_SIZE) {
		const end = Math.min(start + CHUNK_SIZE, total);
		lastResult = await uploadChunk(
			signed,
			file.slice(start, end),
			start,
			end,
			total,
			uploadId,
			resourceType,
		);
		onProgress(Math.round((end / total) * 100));
	}

	if (!lastResult.publicId || !lastResult.secureUrl) {
		throw new Error(
			"Upload completed but Cloudinary did not return a final asset.",
		);
	}
	return { publicId: lastResult.publicId, secureUrl: lastResult.secureUrl };
}

/** Entry point gallery uploads should use — picks single-request vs
 * chunked automatically based on file size, so callers never need to
 * think about the 100MB cutoff themselves. */
export async function uploadMediaToCloudinary(
	signed: SignedUploadParams,
	file: File,
	onProgress: (pct: number) => void,
	xhrRef: React.MutableRefObject<XMLHttpRequest | null> | undefined,
	resourceType: "image" | "video",
): Promise<{ publicId: string; secureUrl: string }> {
	if (file.size > CHUNKED_UPLOAD_THRESHOLD) {
		return uploadDirectToCloudinaryChunked(
			signed,
			file,
			onProgress,
			resourceType,
		);
	}
	return uploadDirectToCloudinary(
		signed,
		file,
		onProgress,
		xhrRef,
		resourceType,
	);
}