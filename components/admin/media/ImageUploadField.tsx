"use client";

import { useRef, useState, useTransition } from "react";
import { ImageIcon, Loader2, UploadCloud, X } from "lucide-react";
import { MediaPickerModal } from "./MediaPickerModal";
import { inputCls } from "@/components/admin/ui/EditorField";
import { cn } from "@/lib/utils/helpers";
import type { CloudinaryFolder } from "@/lib/integrations/cloudinary";

export interface ImageUploadFieldProps {
  label: string;
  value: string;
  altValue?: string;
  onChange: (url: string, alt: string) => void;
  hint?: string;
  folder?: CloudinaryFolder;
  accept?: "image" | "image,video";
  aspectClass?: string; // e.g. "aspect-[16/9]" or "aspect-square"
  required?: boolean;
}

export function ImageUploadField({
  label,
  value,
  altValue = "",
  onChange,
  hint,
  folder = "jimo-property/site-images",
  accept = "image",
  aspectClass = "aspect-[16/9]",
  required,
}: ImageUploadFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleDirectUpload(file: File) {
    setUploading(true);
    setUploadError(null);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    fd.append("altText", altValue || label);

    try {
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setUploadError(data.error ?? "Upload failed.");
        return;
      }

      onChange(data.asset.secureUrl, data.asset.altText);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload error.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      {pickerOpen ? (
        <MediaPickerModal
          onSelect={(url, alt) => onChange(url, alt || altValue)}
          onClose={() => setPickerOpen(false)}
          defaultFolder={folder}
          accept={accept}
        />
      ) : null}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-950">
          {label}
          {required ? <span className="ml-1 text-red-500">*</span> : null}
        </label>

        {value ? (
          /* Image preview */
          <div className={cn("relative overflow-hidden rounded-2xl", aspectClass)}>
            {accept === "image,video" && value.includes(".mp4") ? (
              <video
                src={value}
                controls
                className="h-full w-full bg-ink-950 object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt={altValue || label}
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity hover:opacity-100">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink-950 hover:bg-white"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink-950 hover:bg-white"
                >
                  Upload New
                </button>
              </div>
              <button
                type="button"
                onClick={() => onChange("", altValue)}
                aria-label="Remove image"
                className="rounded-full bg-red-600 p-1.5 text-white hover:bg-red-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Empty state — upload or pick */
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 text-center",
              aspectClass,
            )}
          >
            {uploading ? (
              <Loader2 className="h-7 w-7 animate-spin text-red-600" />
            ) : (
              <ImageIcon className="h-7 w-7 text-stone-300" />
            )}
            <p className="text-xs text-stone-500">
              {uploading ? "Uploading..." : "No image selected"}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-950 hover:bg-stone-50 disabled:opacity-60"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                Upload
              </button>
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                disabled={uploading}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                Choose from Library
              </button>
            </div>
          </div>
        )}

        {/* Hidden file input for direct upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept={
            accept === "image"
              ? "image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              : "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
          }
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleDirectUpload(file);
            e.target.value = "";
          }}
          className="sr-only"
        />

        {/* Alt text field — always shown */}
        <div className="mt-3">
          <label className="mb-1 block text-xs font-medium text-stone-500">
            Alt Text {required ? <span className="text-red-500">*</span> : null}
          </label>
          <input
            type="text"
            value={altValue}
            onChange={(e) => onChange(value, e.target.value)}
            placeholder="Describe the image for accessibility"
            className={inputCls}
          />
        </div>

        {hint ? (
          <p className="mt-1.5 text-xs text-stone-400">{hint}</p>
        ) : null}

        {uploadError ? (
          <p className="mt-1.5 text-xs font-medium text-red-500">{uploadError}</p>
        ) : null}
      </div>
    </>
  );
}