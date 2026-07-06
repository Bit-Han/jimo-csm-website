"use client";

import { useState, useTransition } from "react";
import {
  Film,
  MoreHorizontal,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { deleteMediaAsset } from "@/lib/actions/admin/media";
import { cn } from "@/lib/utils/helpers";
import type {
  MediaAsset,
  MediaFilterState,
  MediaFolder,
  MediaSortMode,
  MediaViewMode,
} from "@/lib/types/admin/media";

const FILE_TYPE_OPTIONS = [
  { value: "all", label: "File Type" },
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
  { value: "raw", label: "Document" },
];

const SORT_OPTIONS: { value: MediaSortMode; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "name", label: "Name" },
  { value: "size", label: "Size" },
];

const selectCn =
  "rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20";

export interface MediaGridProps {
  assets: MediaAsset[];
  totalCount: number;
}

export function MediaGrid({ assets, totalCount }: MediaGridProps) {
  const [filters, setFilters] = useState<
    Omit<MediaFilterState, "folder" | "linkedProject">
  >({
    fileType: "all",
    search: "",
    sort: "newest",
  });

  const [viewMode] = useState<MediaViewMode>("grid");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = assets.filter((a) => {
    const matchSearch =
      !filters.search ||
      a.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchType =
      filters.fileType === "all" || a.resourceType === filters.fileType;
    return matchSearch && matchType;
  });

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      await deleteMediaAsset(id);
      setDeletingId(null);
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5">
      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search media files..."
            value={filters.search}
            onChange={(e) =>
              setFilters((p) => ({ ...p, search: e.target.value }))
            }
            className="w-full rounded-lg border border-stone-200 bg-white py-2 pl-9 pr-4 text-sm placeholder:text-stone-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
          />
        </div>

        <select className={selectCn} disabled>
          <option>Linked Project</option>
        </select>

        <select
          value={filters.fileType}
          onChange={(e) =>
            setFilters((p) => ({ ...p, fileType: e.target.value }))
          }
          className={selectCn}
        >
          {FILE_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select className={selectCn} disabled>
          <option>Usage</option>
        </select>

        <div className="ml-auto flex items-center gap-2">
          <p className="text-sm font-bold text-ink-950">
            {totalCount} items
          </p>
          <div className="flex overflow-hidden rounded-lg border border-stone-200">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  setFilters((p) => ({ ...p, sort: opt.value }))
                }
                className={cn(
                  "border-r border-stone-200 px-3 py-1.5 text-xs font-medium last:border-r-0",
                  filters.sort === opt.value
                    ? "bg-ink-950 text-white"
                    : "bg-white text-stone-600 hover:bg-stone-50",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <Upload className="h-8 w-8 text-stone-300" />
          <p className="text-sm text-stone-400">
            No media assets match your search.
          </p>
        </div>
      ) : (
        <div
          className={cn(
            viewMode === "grid"
              ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "space-y-2",
          )}
        >
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-50"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
                {asset.resourceType === "video" ? (
                  <div className="flex h-full items-center justify-center">
                    <Film className="h-8 w-8 text-stone-400" />
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="h-full w-full object-cover"
                  />
                )}

                {/* Hover overlay with actions */}
                <div className="absolute inset-0 flex items-start justify-end bg-black/30 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => handleDelete(asset.id)}
                    disabled={isPending && deletingId === asset.id}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-red-500 hover:bg-white"
                    aria-label="Delete asset"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="truncate text-xs font-semibold text-ink-950">
                  {asset.name}
                </p>
                {asset.projectName ? (
                  <p className="mt-0.5 truncate text-[10px] text-stone-500">
                    {asset.projectName}
                  </p>
                ) : null}
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      asset.tagColorClass,
                    )}
                  >
                    {asset.tagLabel}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
                    <span>{asset.format}</span>
                    <span>·</span>
                    <span>{asset.sizeLabel}</span>
                    <button
                      type="button"
                      className="text-stone-400 hover:text-ink-950"
                      aria-label="More options"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}