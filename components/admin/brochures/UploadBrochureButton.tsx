// //components/admin/brochures/UploadBrochureButton.tsx


// "use client";

// import { useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import { FileText, Loader2, Upload, X } from "lucide-react";
// import { cn } from "@/lib/utils/helpers";

// export interface ProjectOption {
// 	id: string;
// 	name: string;
// 	slug: string;
// }

// // XHR upload — gives real progress events unlike fetch
// function uploadWithProgress(
// 	url: string,
// 	formData: FormData,
// 	onProgress: (pct: number) => void,
// ): Promise<{ success: boolean; error?: string; brochure?: unknown }> {
// 	return new Promise((resolve, reject) => {
// 		const xhr = new XMLHttpRequest();

// 		// Fire on each chunk received by the server
// 		xhr.upload.addEventListener("progress", (e) => {
// 			if (e.lengthComputable) {
// 				onProgress(Math.round((e.loaded / e.total) * 100));
// 			}
// 		});

// 		xhr.addEventListener("load", () => {
// 			try {
// 				const data = JSON.parse(xhr.responseText);
// 				if (xhr.status === 200 && data.success) {
// 					resolve({ success: true, brochure: data.brochure });
// 				} else {
// 					resolve({ success: false, error: data.error ?? "Upload failed." });
// 				}
// 			} catch {
// 				reject(new Error("Invalid server response."));
// 			}
// 		});

// 		xhr.addEventListener("error", () => {
// 			reject(new Error("Network error. Check your connection and try again."));
// 		});

// 		xhr.addEventListener("abort", () => {
// 			reject(new Error("Upload cancelled."));
// 		});

// 		xhr.open("POST", url);
// 		xhr.send(formData);
// 	});
// }

// export function UploadBrochureButton({
// 	projects,
// }: {
// 	projects: ProjectOption[];
// }) {
// 	const router = useRouter();
// 	const fileInputRef = useRef<HTMLInputElement>(null);
// 	const xhrRef = useRef<XMLHttpRequest | null>(null);

// 	const [open, setOpen] = useState(false);
// 	const [file, setFile] = useState<File | null>(null);
// 	const [title, setTitle] = useState("");
// 	const [projectSlug, setProjectSlug] = useState("");
// 	const [uploading, setUploading] = useState(false);
// 	const [progress, setProgress] = useState(0);
// 	const [error, setError] = useState<string | null>(null);
// 	const [done, setDone] = useState(false);

// 	const inputCls =
// 		"w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-ink-950 placeholder:text-stone-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20";

// 	function resetState() {
// 		setFile(null);
// 		setTitle("");
// 		setProjectSlug("");
// 		setUploading(false);
// 		setProgress(0);
// 		setError(null);
// 		setDone(false);
// 	}

// 	function handleClose() {
// 		if (uploading) return; // prevent close during upload
// 		setOpen(false);
// 		resetState();
// 	}

// 	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
// 		const selected = e.target.files?.[0] ?? null;
// 		setError(null);
// 		setFile(selected);

// 		// Auto-fill title from filename if empty
// 		if (selected && !title) {
// 			setTitle(
// 				selected.name
// 					.replace(/\.pdf$/i, "")
// 					.replace(/[-_]/g, " ")
// 					.replace(/\b\w/g, (c) => c.toUpperCase()),
// 			);
// 		}
// 		e.target.value = "";
// 	}

// 	async function handleSubmit() {
// 		if (!file) {
// 			setError("Select a PDF file first.");
// 			return;
// 		}
// 		if (!title.trim()) {
// 			setError("Enter a title for this brochure.");
// 			return;
// 		}
// 		if (!projectSlug) {
// 			setError("Select which project this brochure is for.");
// 			return;
// 		}

// 		setError(null);
// 		setUploading(true);
// 		setProgress(0);

// 		const fd = new FormData();
// 		fd.append("file", file);
// 		fd.append("title", title.trim());
// 		fd.append("projectSlug", projectSlug);

// 		try {
// 			const result = await uploadWithProgress(
// 				"/api/admin/brochures/upload",
// 				fd,
// 				setProgress,
// 			);

// 			if (result.success) {
// 				setDone(true);
// 				// Give the user a moment to see the success state, then close + refresh
// 				setTimeout(() => {
// 					setOpen(false);
// 					resetState();
// 					router.refresh();
// 				}, 1500);
// 			} else {
// 				setError(result.error ?? "Upload failed. Please try again.");
// 				setUploading(false);
// 			}
// 		} catch (err) {
// 			setError(err instanceof Error ? err.message : "Upload failed.");
// 			setUploading(false);
// 		}
// 	}

// 	return (
// 		<>
// 			<button
// 				type="button"
// 				onClick={() => setOpen(true)}
// 				className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
// 			>
// 				<Upload className="h-4 w-4" />
// 				Upload Brochure
// 			</button>

// 			{open ? (
// 				<>
// 					{/* Backdrop */}
// 					<button
// 						type="button"
// 						onClick={handleClose}
// 						aria-label="Close"
// 						className="fixed inset-0 z-40 bg-black/50"
// 					/>

// 					{/* Modal */}
// 					<div
// 						role="dialog"
// 						aria-modal="true"
// 						aria-label="Upload Brochure"
// 						className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl"
// 					>
// 						{/* Header */}
// 						<div className="mb-5 flex items-start justify-between">
// 							<div>
// 								<h2 className="text-base font-bold text-ink-950">
// 									Upload Brochure
// 								</h2>
// 								<p className="mt-0.5 text-xs text-stone-500">
// 									PDF only · max 10 MB · uploads to Cloudinary, URL saved in DB
// 								</p>
// 							</div>
// 							{!uploading ? (
// 								<button
// 									type="button"
// 									onClick={handleClose}
// 									className="text-stone-400 hover:text-ink-950"
// 								>
// 									<X className="h-5 w-5" />
// 								</button>
// 							) : null}
// 						</div>

// 						{done ? (
// 							/* Success state */
// 							<div className="flex flex-col items-center gap-3 py-8 text-center">
// 								<div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
// 									<FileText className="h-7 w-7 text-emerald-600" />
// 								</div>
// 								<p className="text-sm font-semibold text-emerald-700">
// 									Uploaded successfully!
// 								</p>
// 								<p className="text-xs text-stone-500">
// 									The brochure is saved as a draft. Publish it from the list.
// 								</p>
// 							</div>
// 						) : (
// 							<div className="space-y-4">
// 								{/* File picker */}
// 								<div>
// 									<label className="mb-1.5 block text-sm font-medium text-ink-950">
// 										PDF File <span className="text-red-500">*</span>
// 									</label>
// 									{file ? (
// 										<div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
// 											<FileText className="h-5 w-5 shrink-0 text-red-600" />
// 											<div className="min-w-0 flex-1">
// 												<p className="truncate text-sm font-medium text-ink-950">
// 													{file.name}
// 												</p>
// 												<p className="text-xs text-stone-400">
// 													{(file.size / 1024 / 1024).toFixed(2)} MB
// 												</p>
// 											</div>
// 											{!uploading ? (
// 												<button
// 													type="button"
// 													onClick={() => setFile(null)}
// 													className="text-stone-400 hover:text-red-500"
// 												>
// 													<X className="h-4 w-4" />
// 												</button>
// 											) : null}
// 										</div>
// 									) : (
// 										<label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 px-4 py-8 text-center transition-colors hover:border-red-300 hover:bg-red-50">
// 											<Upload className="h-5 w-5 text-stone-400" />
// 											<span className="text-sm text-stone-500">
// 												Click to select a PDF file
// 											</span>
// 											<input
// 												ref={fileInputRef}
// 												type="file"
// 												accept="application/pdf"
// 												onChange={handleFileChange}
// 												className="sr-only"
// 											/>
// 										</label>
// 									)}
// 								</div>

// 								{/* Title */}
// 								<div>
// 									<label className="mb-1.5 block text-sm font-medium text-ink-950">
// 										Brochure Title <span className="text-red-500">*</span>
// 									</label>
// 									<input
// 										type="text"
// 										value={title}
// 										onChange={(e) => setTitle(e.target.value)}
// 										placeholder="e.g. Vatican Court Brochure"
// 										disabled={uploading}
// 										className={cn(inputCls, uploading && "opacity-60")}
// 									/>
// 								</div>

// 								{/* Project selector */}
// 								<div>
// 									<label className="mb-1.5 block text-sm font-medium text-ink-950">
// 										Project <span className="text-red-500">*</span>
// 									</label>
// 									<select
// 										value={projectSlug}
// 										onChange={(e) => setProjectSlug(e.target.value)}
// 										disabled={uploading}
// 										className={cn(inputCls, uploading && "opacity-60")}
// 									>
// 										<option value="">Select a project</option>
// 										{projects.map((p) => (
// 											<option key={p.slug} value={p.slug}>
// 												{p.name}
// 											</option>
// 										))}
// 									</select>
// 									{projects.length === 0 ? (
// 										<p className="mt-1 text-xs text-amber-600">
// 											No published projects found. Publish a project first.
// 										</p>
// 									) : null}
// 								</div>

// 								{/* Upload progress */}
// 								{uploading ? (
// 									<div>
// 										<div className="mb-1 flex items-center justify-between text-xs text-stone-500">
// 											<span>Uploading to Cloudinary...</span>
// 											<span>{progress}%</span>
// 										</div>
// 										<div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
// 											<div
// 												className="h-full rounded-full bg-red-600 transition-all duration-200"
// 												style={{ width: `${progress}%` }}
// 											/>
// 										</div>
// 									</div>
// 								) : null}

// 								{/* Error */}
// 								{error ? (
// 									<p className="text-sm font-medium text-red-500">{error}</p>
// 								) : null}

// 								{/* Actions */}
// 								<div className="flex justify-end gap-3 pt-2">
// 									{!uploading ? (
// 										<button
// 											type="button"
// 											onClick={handleClose}
// 											className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-stone-50"
// 										>
// 											Cancel
// 										</button>
// 									) : null}
// 									<button
// 										type="button"
// 										onClick={handleSubmit}
// 										disabled={uploading || !file}
// 										className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
// 									>
// 										{uploading ? (
// 											<>
// 												<Loader2 className="h-4 w-4 animate-spin" />
// 												Uploading...
// 											</>
// 										) : (
// 											<>
// 												<Upload className="h-4 w-4" />
// 												Upload Brochure
// 											</>
// 										)}
// 									</button>
// 								</div>
// 							</div>
// 						)}
// 					</div>
// 				</>
// 			) : null}
// 		</>
// 	);
// }


// components/admin/brochures/UploadBrochureButton.tsx
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import { requestBrochureUploadSignature, recordBrochureUpload } from "@/lib/actions/admin/brochure";
import { uploadDirectToCloudinary } from "@/lib/utils/cloudinary-client-upload";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB — enforced client-side since we bypass Vercel's body limit entirely now

export interface ProjectOption {
  id: string;
  name: string;
  slug: string;
}

export function UploadBrochureButton({ projects }: { projects: ProjectOption[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const submittingRef = useRef(false); // guards against rapid double-click double-submitting

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [projectSlug, setProjectSlug] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const inputCls =
    "w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-ink-950 placeholder:text-stone-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20";

  function resetState() {
    setFile(null);
    setTitle("");
    setProjectSlug("");
    setUploading(false);
    setProgress(0);
    setError(null);
    setDone(false);
    xhrRef.current = null;
    submittingRef.current = false;
  }

  function handleClose() {
    if (uploading) {
      xhrRef.current?.abort();
    }
    setOpen(false);
    resetState();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setError(null);

    if (selected && selected.size > MAX_FILE_SIZE) {
      setError(`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024} MB.`);
      setFile(null);
      e.target.value = "";
      return;
    }

    setFile(selected);

    // Auto-fill title from filename if empty
    if (selected && !title) {
      setTitle(
        selected.name
          .replace(/\.pdf$/i, "")
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      );
    }
    e.target.value = "";
  }

  async function handleSubmit() {
    if (submittingRef.current) return; // ignore rapid double-clicks
    if (!file) return setError("Select a PDF file first.");
    if (!title.trim()) return setError("Enter a title for this brochure.");
    if (!projectSlug) return setError("Select which project this brochure is for.");
    if (file.size > MAX_FILE_SIZE) {
      return setError(`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024} MB.`);
    }

    submittingRef.current = true;
    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const signed = await requestBrochureUploadSignature(projectSlug);
      const uploaded = await uploadDirectToCloudinary(signed, file, setProgress, xhrRef);

      const result = await recordBrochureUpload({
        title: title.trim(),
        projectSlug,
        cloudinaryPublicId: uploaded.publicId,
        fileUrl: uploaded.secureUrl,
      });

      if (result.success) {
        setDone(true);
        setTimeout(() => {
          setOpen(false);
          resetState();
          router.refresh();
        }, 1500);
      } else {
        setError(result.message);
        setUploading(false);
        submittingRef.current = false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setUploading(false);
      submittingRef.current = false;
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
      >
        <Upload className="h-4 w-4" />
        Upload Brochure
      </button>

      {open ? (
        <>
          {/* Backdrop */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="fixed inset-0 z-40 bg-black/50"
          />

          {/* Modal */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Upload Brochure"
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-ink-950">Upload Brochure</h2>
                <p className="mt-0.5 text-xs text-stone-500">
                  PDF only · max {MAX_FILE_SIZE / 1024 / 1024} MB · uploads directly to Cloudinary
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-stone-400 hover:text-ink-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {done ? (
              /* Success state */
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                  <FileText className="h-7 w-7 text-emerald-600" />
                </div>
                <p className="text-sm font-semibold text-emerald-700">Uploaded successfully!</p>
                <p className="text-xs text-stone-500">
                  The brochure is saved as a draft. Publish it from the list.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* File picker */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-950">
                    PDF File <span className="text-red-500">*</span>
                  </label>
                  {file ? (
                    <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
                      <FileText className="h-5 w-5 shrink-0 text-red-600" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink-950">{file.name}</p>
                        <p className="text-xs text-stone-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      {!uploading ? (
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="text-stone-400 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>
                  ) : (
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 px-4 py-8 text-center transition-colors hover:border-red-300 hover:bg-red-50">
                      <Upload className="h-5 w-5 text-stone-400" />
                      <span className="text-sm text-stone-500">Click to select a PDF file</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-950">
                    Brochure Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Vatican Court Brochure"
                    disabled={uploading}
                    className={cn(inputCls, uploading && "opacity-60")}
                  />
                </div>

                {/* Project selector */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-950">
                    Project <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={projectSlug}
                    onChange={(e) => setProjectSlug(e.target.value)}
                    disabled={uploading}
                    className={cn(inputCls, uploading && "opacity-60")}
                  >
                    <option value="">Select a project</option>
                    {projects.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  {projects.length === 0 ? (
                    <p className="mt-1 text-xs text-amber-600">
                      No published projects found. Publish a project first.
                    </p>
                  ) : null}
                </div>

                {/* Upload progress */}
                {uploading ? (
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs text-stone-500">
                      <span>Uploading to Cloudinary...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                      <div
                        className="h-full rounded-full bg-red-600 transition-all duration-200"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : null}

                {/* Error */}
                {error ? <p className="text-sm font-medium text-red-500">{error}</p> : null}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-stone-50"
                  >
                    {uploading ? "Cancel" : "Close"}
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={uploading || !file}
                    className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Upload Brochure
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : null}
    </>
  );
}