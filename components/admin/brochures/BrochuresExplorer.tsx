// // components/admin/brochures/BrochuresExplorer.tsx
// "use client";

// import { useRef, useState, useTransition } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import {RowActionsMenu} from "@/components/admin/ui/RowActionsMenu";
// import {
//   Download,
//   ExternalLink,
//   FileText,
//   Loader2,
// } from "lucide-react";
// import {
//   deleteBrochure,
//   publishBrochure,
//   unpublishBrochure,
// } from "@/lib/actions/admin/brochure";
// import { AdminBadge } from "@/components/admin/ui/AdminBadge";
// import { cn } from "@/lib/utils/helpers";
// import type { AdminBrochureListRow } from "@/lib/types/admin/brochure";

// // XHR replace upload with progress
// function replaceWithProgress(
//   id: string,
//   file: File,
//   onProgress: (pct: number) => void,
// ): Promise<{ success: boolean; error?: string }> {
//   return new Promise((resolve, reject) => {
//     const fd = new FormData();
//     fd.append("file", file);
//     fd.append("id", id);

//     const xhr = new XMLHttpRequest();

//     xhr.upload.addEventListener("progress", (e) => {
//       if (e.lengthComputable) {
//         onProgress(Math.round((e.loaded / e.total) * 100));
//       }
//     });

//     xhr.addEventListener("load", () => {
//       try {
//         const data = JSON.parse(xhr.responseText);
//         resolve({
//           success: xhr.status === 200 && data.success,
//           error: data.error,
//         });
//       } catch {
//         reject(new Error("Invalid response."));
//       }
//     });

//     xhr.addEventListener("error", () => reject(new Error("Network error.")));
//     xhr.open("POST", "/api/admin/brochures/replace");
//     xhr.send(fd);
//   });
// }

// export function BrochuresExplorer({
//   brochures: initialBrochures,
// }: {
//   brochures: AdminBrochureListRow[];
// }) {
//   const router = useRouter();
//   const [rows, setRows] = useState(initialBrochures);
//   const [actionId, setActionId] = useState<string | null>(null); // pending server action
//   const [replaceId, setReplaceId] = useState<string | null>(null); // replacing brochure
//   const [replaceProgress, setReplaceProgress] = useState(0);
//   const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
//   const [isPending, startTransition] = useTransition();
//   const replaceInputRef = useRef<HTMLInputElement>(null);
//   const pendingReplaceIdRef = useRef<string | null>(null);

//   function showToast(msg: string, ok = true) {
//     setToast({ msg, ok });
//     setTimeout(() => setToast(null), 4000);
//   }

//   // ── Publish ────────────────────────────────────────────────────────────
//   function handlePublish(id: string) {
//     setActionId(id);
//     startTransition(async () => {
//       const result = await publishBrochure(id);
//       if (result.success) {
//         setRows((prev) =>
//           prev.map((b) =>
//             b.id === id
//               ? {
//                   ...b,
//                   status: "active",
//                   statusNote: `${b.leadsCount ?? 0} leads captured`,
//                 }
//               : b,
//           ),
//         );
//         showToast(result.message);
//       } else {
//         showToast(result.message, false);
//       }
//       setActionId(null);
//     });
//   }

//   // ── Unpublish ──────────────────────────────────────────────────────────
//   function handleUnpublish(id: string) {
//     setActionId(id);
//     startTransition(async () => {
//       const result = await unpublishBrochure(id);
//       if (result.success) {
//         setRows((prev) =>
//           prev.map((b) =>
//             b.id === id
//               ? { ...b, status: "draft", statusNote: "Needs approval" }
//               : b,
//           ),
//         );
//         showToast(result.message);
//       } else {
//         showToast(result.message, false);
//       }
//       setActionId(null);
//     });
//   }

//   // ── Delete ─────────────────────────────────────────────────────────────
//   function handleDelete(id: string, title: string) {
//     const confirmed = window.confirm(
//       `Delete "${title}"?\n\nThis removes the file from Cloudinary and the database permanently. This cannot be undone.`,
//     );
//     if (!confirmed) return;

//     setActionId(id);
//     startTransition(async () => {
//       const result = await deleteBrochure(id);
//       if (result.success) {
//         setRows((prev) => prev.filter((b) => b.id !== id));
//         showToast(result.message);
//       } else {
//         showToast(result.message, false);
//       }
//       setActionId(null);
//     });
//   }

//   // ── Replace ────────────────────────────────────────────────────────────
//   function handleReplaceClick(id: string) {
//     pendingReplaceIdRef.current = id;
//     replaceInputRef.current?.click();
//   }

//   async function handleReplaceFile(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     const id = pendingReplaceIdRef.current;
//     e.target.value = "";

//     if (!file || !id) return;

//     if (file.type !== "application/pdf") {
//       showToast("Only PDF files are accepted.", false);
//       return;
//     }

//     setReplaceId(id);
//     setReplaceProgress(0);

//     try {
//       const result = await replaceWithProgress(id, file, setReplaceProgress);

//       if (result.success) {
//         showToast("Brochure replaced successfully.");
//         router.refresh();
//       } else {
//         showToast(result.error ?? "Replace failed.", false);
//       }
//     } catch (err) {
//       showToast(err instanceof Error ? err.message : "Replace failed.", false);
//     } finally {
//       setReplaceId(null);
//       setReplaceProgress(0);
//       pendingReplaceIdRef.current = null;
//     }
//   }

//   if (rows.length === 0) {
//     return (
//       <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
//         <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
//           <FileText className="h-7 w-7 text-stone-400" />
//         </div>
//         <p className="text-sm font-semibold text-stone-500">No brochures yet</p>
//         <p className="max-w-xs text-xs text-stone-400">
//           Upload a PDF brochure using the button above. It will be saved as a
//           draft until you publish it.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Toast notification */}
//       {toast ? (
//         <div
//           className={cn(
//             "fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border px-5 py-4 shadow-xl",
//             toast.ok
//               ? "border-emerald-200 bg-emerald-50 text-emerald-700"
//               : "border-red-200 bg-red-50 text-red-700",
//           )}
//         >
//           <p className="text-sm font-medium">{toast.msg}</p>
//         </div>
//       ) : null}

//       {/* Hidden file input for replace */}
//       <input
//         ref={replaceInputRef}
//         type="file"
//         accept="application/pdf"
//         onChange={handleReplaceFile}
//         className="sr-only"
//       />

//       {/* Table */}
//       <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[680px] text-left text-sm">
//             <thead>
//               <tr className="border-b border-stone-100 bg-stone-50/60">
//                 {[
//                   "Brochure",
//                   "Project",
//                   "Status",
//                   "Leads",
//                   "Uploaded",
//                   "Actions",
//                 ].map((h) => (
//                   <th
//                     key={h}
//                     className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-stone-500"
//                   >
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {rows.map((brochure) => {
//                 const isReplacing = replaceId === brochure.id;
//                 const isActioning =
//                   (actionId === brochure.id && isPending) || isReplacing;

//                 return (
// 									<tr
// 										key={brochure.id}
// 										className="border-b border-stone-100 transition-colors last:border-none hover:bg-stone-50"
// 									>
// 										{/* Title */}
// 										<td className="px-6 py-4">
// 											<div className="flex items-center gap-3">
// 												<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50">
// 													<FileText className="h-4 w-4 text-red-600" />
// 												</div>
// 												<div>
// 													<p className="font-semibold text-ink-950">
// 														{brochure.title}
// 													</p>
// 													<p className="text-xs text-stone-400">
// 														{brochure.fileType.toUpperCase()}
// 													</p>
// 												</div>
// 											</div>
// 										</td>

// 										{/* Project */}
// 										<td className="px-6 py-4 text-stone-600">
// 											{brochure.relatedProject}
// 										</td>

// 										{/* Status */}
// 										<td className="px-6 py-4">
// 											<div className="flex flex-col gap-1">
// 												<AdminBadge
// 													variant={
// 														brochure.status === "active" ? "active" : "draft"
// 													}
// 												/>
// 												<span className="text-[10px] text-stone-400">
// 													{brochure.statusNote}
// 												</span>
// 											</div>
// 										</td>

// 										{/* Leads */}
// 										<td className="px-6 py-4 font-medium text-ink-950">
// 											{brochure.leadsCount ?? "—"}
// 										</td>

// 										{/* Uploaded */}
// 										<td className="px-6 py-4 text-stone-500">
// 											{brochure.uploadedAt}
// 										</td>

// 										{/* Actions */}
// 										<td className="px-6 py-4">
// 											{isReplacing ? (
// 												<div className="flex items-center gap-2">
// 													<Loader2 className="h-4 w-4 animate-spin text-red-600" />
// 													<span className="text-xs text-stone-500">
// 														{replaceProgress}%
// 													</span>
// 												</div>
// 											) : (
// 												// <div className="flex flex-wrap items-center gap-3">
// 												//   {/* View PDF in new tab */}
// 												//     <Link
// 												//     href={brochure.fileUrl}
// 												//     target="_blank"
// 												//     rel="noopener noreferrer"
// 												//     className="flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-ink-950"
// 												//     title="Open PDF"
// 												//   >
// 												//     <ExternalLink className="h-3.5 w-3.5" />
// 												//     View
// 												//   </Link>

// 												//   {/* Publish / Unpublish */}
// 												//   {brochure.status === "draft" ? (
// 												//     <button
// 												//       type="button"
// 												//       onClick={() => handlePublish(brochure.id)}
// 												//       disabled={isActioning}
// 												//       className="text-xs font-medium text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
// 												//     >
// 												//       {actionId === brochure.id && isPending ? (
// 												//         <Loader2 className="h-3.5 w-3.5 animate-spin" />
// 												//       ) : (
// 												//         "Publish"
// 												//       )}
// 												//     </button>
// 												//   ) : (
// 												//     <button
// 												//       type="button"
// 												//       onClick={() => handleUnpublish(brochure.id)}
// 												//       disabled={isActioning}
// 												//       className="text-xs font-medium text-amber-600 hover:text-amber-700 disabled:opacity-50"
// 												//     >
// 												//       {actionId === brochure.id && isPending ? (
// 												//         <Loader2 className="h-3.5 w-3.5 animate-spin" />
// 												//       ) : (
// 												//         "Unpublish"
// 												//       )}
// 												//     </button>
// 												//   )}

// 												//   {/* Replace */}
// 												//   <button
// 												//     type="button"
// 												//     onClick={() => handleReplaceClick(brochure.id)}
// 												//     disabled={isActioning}
// 												//     className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
// 												//   >
// 												//     <RefreshCw className="h-3 w-3" />
// 												//     Replace
// 												//   </button>

// 												//   {/* Delete */}
// 												//   <button
// 												//     type="button"
// 												//     onClick={() =>
// 												//       handleDelete(brochure.id, brochure.title)
// 												//     }
// 												//     disabled={isActioning}
// 												//     className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
// 												//   >
// 												//     <Trash2 className="h-3 w-3" />
// 												//     Delete
// 												//   </button>
// 												// </div>
// 												<div className="flex items-center justify-end gap-3">
// 													<Link
// 														href={brochure.fileUrl}
// 														target="_blank"
// 														rel="noopener noreferrer"
// 														className="flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-ink-950"
// 														title="Open PDF"
// 													>
// 														<ExternalLink className="h-3.5 w-3.5" />
// 														View
// 													</Link>

// 													<RowActionsMenu
// 														brochure={brochure}
// 														isActioning={isActioning}
// 														actionPending={
// 															actionId === brochure.id && isPending
// 														}
// 														onPublish={() => handlePublish(brochure.id)}
// 														onUnpublish={() => handleUnpublish(brochure.id)}
// 														onReplace={() => handleReplaceClick(brochure.id)}
// 														onDelete={() =>
// 															handleDelete(brochure.id, brochure.title)
// 														}
// 													/>
// 												</div>
// 											)}
// 										</td>
// 									</tr>
// 								);
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// }



// components/admin/brochures/BrochuresExplorer.tsx
"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, FileText, Loader2, X } from "lucide-react";
import {
  deleteBrochure,
  publishBrochure,
  unpublishBrochure,
  requestBrochureReplaceSignature,
  recordBrochureReplace,
} from "@/lib/actions/admin/brochure";
import { uploadDirectToCloudinary } from "@/lib/utils/cloudinary-client-upload";
import { RowActionsMenu } from "@/components/admin/ui/RowActionsMenu";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import { cn } from "@/lib/utils/helpers";
import type { AdminBrochureListRow } from "@/lib/types/admin/brochure";

export function BrochuresExplorer({
  brochures: initialBrochures,
}: {
  brochures: AdminBrochureListRow[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initialBrochures);
  const [actionId, setActionId] = useState<string | null>(null); // pending server action (publish/unpublish/delete)
  const [replaceId, setReplaceId] = useState<string | null>(null); // brochure currently being replaced
  const [replaceProgress, setReplaceProgress] = useState(0);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const pendingReplaceIdRef = useRef<string | null>(null);
  const replaceXhrRef = useRef<XMLHttpRequest | null>(null);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  }

  // ── Publish ────────────────────────────────────────────────────────────
  function handlePublish(id: string) {
    setActionId(id);
    startTransition(async () => {
      const result = await publishBrochure(id);
      if (result.success) {
        setRows((prev) =>
          prev.map((b) =>
            b.id === id
              ? { ...b, status: "active", statusNote: `${b.leadsCount ?? 0} leads captured` }
              : b,
          ),
        );
        showToast(result.message);
      } else {
        showToast(result.message, false);
      }
      setActionId(null);
    });
  }

  // ── Unpublish ──────────────────────────────────────────────────────────
  function handleUnpublish(id: string) {
    setActionId(id);
    startTransition(async () => {
      const result = await unpublishBrochure(id);
      if (result.success) {
        setRows((prev) =>
          prev.map((b) =>
            b.id === id ? { ...b, status: "draft", statusNote: "Needs approval" } : b,
          ),
        );
        showToast(result.message);
      } else {
        showToast(result.message, false);
      }
      setActionId(null);
    });
  }

  // ── Delete ─────────────────────────────────────────────────────────────
  function handleDelete(id: string, title: string) {
    const confirmed = window.confirm(
      `Delete "${title}"?\n\nThis removes the file from Cloudinary and the database permanently. This cannot be undone.`,
    );
    if (!confirmed) return;

    setActionId(id);
    startTransition(async () => {
      const result = await deleteBrochure(id);
      if (result.success) {
        setRows((prev) => prev.filter((b) => b.id !== id));
        showToast(result.message);
      } else {
        showToast(result.message, false);
      }
      setActionId(null);
    });
  }

  // ── Replace ────────────────────────────────────────────────────────────
  function handleReplaceClick(id: string) {
    // Guard: don't let a click on a different row's "Replace" hijack an
    // upload that's already in flight for another row.
    if (replaceId !== null) {
      showToast("A replace is already in progress. Please wait for it to finish.", false);
      return;
    }
    pendingReplaceIdRef.current = id;
    replaceInputRef.current?.click();
  }

  async function handleReplaceFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const id = pendingReplaceIdRef.current;
    e.target.value = ""; // allow re-selecting the same file later

    if (!file || !id) return;

    if (file.type !== "application/pdf") {
      showToast("Only PDF files are accepted.", false);
      pendingReplaceIdRef.current = null;
      return;
    }

    setReplaceId(id);
    setReplaceProgress(0);

    try {
      const signed = await requestBrochureReplaceSignature(id);
      const uploaded = await uploadDirectToCloudinary(signed, file, setReplaceProgress, replaceXhrRef);
      const result = await recordBrochureReplace({
        id,
        cloudinaryPublicId: uploaded.publicId,
        fileUrl: uploaded.secureUrl,
      });

      if (result.success) {
        showToast(result.message);
        router.refresh();
      } else {
        showToast(result.message, false);
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Replace failed.", false);
    } finally {
      setReplaceId(null);
      setReplaceProgress(0);
      pendingReplaceIdRef.current = null;
      replaceXhrRef.current = null;
    }
  }

  function handleCancelReplace() {
    replaceXhrRef.current?.abort();
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
          <FileText className="h-7 w-7 text-stone-400" />
        </div>
        <p className="text-sm font-semibold text-stone-500">No brochures yet</p>
        <p className="max-w-xs text-xs text-stone-400">
          Upload a PDF brochure using the button above. It will be saved as a draft until you
          publish it.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Toast notification */}
      {toast ? (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border px-5 py-4 shadow-xl",
            toast.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700",
          )}
        >
          <p className="text-sm font-medium">{toast.msg}</p>
        </div>
      ) : null}

      {/* Hidden file input for replace */}
      <input
        ref={replaceInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleReplaceFile}
        className="sr-only"
      />

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/60">
                {["Brochure", "Project", "Status", "Leads", "Uploaded", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-stone-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((brochure) => {
                const isReplacing = replaceId === brochure.id;
                const isActioning = (actionId === brochure.id && isPending) || isReplacing;

                return (
                  <tr
                    key={brochure.id}
                    className="border-b border-stone-100 transition-colors last:border-none hover:bg-stone-50"
                  >
                    {/* Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50">
                          <FileText className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-ink-950">{brochure.title}</p>
                          <p className="text-xs text-stone-400">
                            {brochure.fileType.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Project */}
                    <td className="px-6 py-4 text-stone-600">{brochure.relatedProject}</td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <AdminBadge variant={brochure.status === "active" ? "active" : "draft"} />
                        <span className="text-[10px] text-stone-400">{brochure.statusNote}</span>
                      </div>
                    </td>

                    {/* Leads */}
                    <td className="px-6 py-4 font-medium text-ink-950">
                      {brochure.leadsCount ?? "—"}
                    </td>

                    {/* Uploaded */}
                    <td className="px-6 py-4 text-stone-500">{brochure.uploadedAt}</td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      {isReplacing ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                          <span className="text-xs text-stone-500">{replaceProgress}%</span>
                          <button
                            type="button"
                            onClick={handleCancelReplace}
                            aria-label="Cancel replace"
                            className="ml-1 text-stone-400 hover:text-red-500"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={brochure.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-ink-950"
                            title="Open PDF"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            View
                          </Link>

                          <RowActionsMenu
                            brochure={brochure}
                            isActioning={isActioning}
                            actionPending={actionId === brochure.id && isPending}
                            onPublish={() => handlePublish(brochure.id)}
                            onUnpublish={() => handleUnpublish(brochure.id)}
                            onReplace={() => handleReplaceClick(brochure.id)}
                            onDelete={() => handleDelete(brochure.id, brochure.title)}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}