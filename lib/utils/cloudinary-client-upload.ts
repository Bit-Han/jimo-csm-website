export interface SignedUploadParams {
	timestamp: number;
	signature: string;
	apiKey: string;
	cloudName: string;
	folder: string;
	publicId: string;
}

export function uploadDirectToCloudinary(
	signed: SignedUploadParams,
	file: File,
	onProgress: (pct: number) => void,
	xhrRef?: React.MutableRefObject<XMLHttpRequest | null>,
	resourceType: "raw" | "image" | "video"= "raw", // brochures default to "raw" unchanged; images pass "image"
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
		xhr.timeout = 60000;
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