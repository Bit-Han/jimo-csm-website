



// components/admin/insights/article-editor/ArticleEditorShell.tsx
"use client";

import { useCallback, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, ChevronDown, ExternalLink, Loader2, Trash2 } from "lucide-react";
import { ArticleContentPanel } from "./ArticleContentPanel";
import { ArticleSettingsPanel } from "./ArticleSettingsPanel";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { deleteArticle, publishArticle, saveDraftArticle } from "@/lib/actions/admin/articles";
import { extractImageUrls } from "@/lib/utils/tiptap";
import { cn } from "@/lib/utils/helpers";
import type { ArticleEditorState, ArticleSaveStatus, AuthorOption } from "@/lib/types/admin/article";
import type { InsightCategoryOption } from "@/lib/types/insight";

export interface ArticleEditorShellProps {
  initialState: ArticleEditorState;
  mode: "new" | "edit";
  categories: InsightCategoryOption[];
  authors: AuthorOption[];
}

function computeMissingForPublish(state: ArticleEditorState): string[] {
  const missing: string[] = [];
  if (!state.title.trim()) missing.push("a title");
  if (!state.excerpt.trim()) missing.push("an excerpt");
  if (!state.category.trim() || !state.categoryLabel.trim()) missing.push("a category");
  if (!state.authorId.trim()) missing.push("an author");
  return missing;
}

function joinWithAnd(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0]!;
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function ArticleEditorShell({ initialState, mode, categories, authors }: ArticleEditorShellProps) {
  const router = useRouter();
  const [state, setState] = useState<ArticleEditorState>(initialState);
  const [currentSlug, setCurrentSlug] = useState<string>(initialState.slug);
  const [saveStatus, setSaveStatus] = useState<ArticleSaveStatus>("idle");
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [publishOpen, setPublishOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [pendingImageDeletions, setPendingImageDeletions] = useState<string[]>([]);
  // Tracks which body images existed when the editor loaded, so we can
  // detect ones the user removed by deleting the node inside the editor.
  const initialBodyImageUrls = useRef(extractImageUrls(initialState.content));

  const queueImageDeletion = useCallback((url: string) => {
    setPendingImageDeletions((prev) => (prev.includes(url) ? prev : [...prev, url]));
  }, []);

  const missingForPublish = useMemo(() => computeMissingForPublish(state), [state]);
  const canPublish = missingForPublish.length === 0;

  function updateField<K extends keyof ArticleEditorState>(key: K, value: ArticleEditorState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
    setSaveStatus("idle");
    setSaveMessage("");
  }

  function collectAllDeletions(): string[] {
    const currentBodyImages = extractImageUrls(state.content);
    const removedBodyImages = initialBodyImageUrls.current.filter((url) => !currentBodyImages.includes(url));
    return [...pendingImageDeletions, ...removedBodyImages];
  }

  function handleSaveDraft() {
    setSaveStatus("saving");
    setSaveMessage("");
    const deletions = collectAllDeletions();
    startTransition(async () => {
      try {
        const result = await saveDraftArticle(state, deletions);
        if (result.success) {
          setSaveStatus("saved");
          setSaveMessage(result.message ?? "Draft saved.");
          setPendingImageDeletions([]);
          initialBodyImageUrls.current = extractImageUrls(state.content);
          if (!currentSlug && result.slug) {
            setCurrentSlug(result.slug);
            setState((prev) => ({ ...prev, slug: result.slug! }));
            router.replace(`/admin/news-insights/${result.slug}/edit`);
          }
        } else {
          setSaveStatus("error");
          setSaveMessage(result.message ?? "Save failed.");
        }
      } catch (error) {
        setSaveStatus("error");
        setSaveMessage(error instanceof Error ? error.message : "Unexpected error.");
      }
    });
  }

  function handlePublish() {
    if (!canPublish) return;
    setPublishOpen(false);
    setSaveStatus("saving");
    setSaveMessage("");
    const deletions = collectAllDeletions();
    startTransition(async () => {
      try {
        const result = await publishArticle(state, deletions);
        if (result.success) {
          setSaveStatus("saved");
          setSaveMessage(result.message ?? "Published.");
          setPendingImageDeletions([]);
          initialBodyImageUrls.current = extractImageUrls(state.content);
          if (!currentSlug && result.slug) {
            setCurrentSlug(result.slug);
            setState((prev) => ({ ...prev, slug: result.slug! }));
            router.replace(`/admin/news-insights/${result.slug}/edit`);
          } else {
            router.refresh();
          }
        } else {
          setSaveStatus("error");
          setSaveMessage(result.message ?? "Publish failed.");
        }
      } catch (error) {
        setSaveStatus("error");
        setSaveMessage(error instanceof Error ? error.message : "Unexpected error.");
      }
    });
  }

  function handleDelete() {
    if (!currentSlug) return;
    startTransition(async () => {
      const result = await deleteArticle(currentSlug);
      setDeleteOpen(false);
      if (result.success) {
        router.push("/admin/news-insights");
      } else {
        setSaveStatus("error");
        setSaveMessage(result.message);
      }
    });
  }

  const subtitle =
    mode === "edit" && currentSlug
      ? `${currentSlug} · Draft, optimise and publish SEO-ready insight articles.`
      : "New article — unsaved";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-950">Article Editor</h1>
          <p className="mt-0.5 text-sm text-stone-500">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2.5">
          {saveStatus === "saved" && saveMessage ? (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
              <Check className="h-3.5 w-3.5" />
              {saveMessage}
            </span>
          ) : saveStatus === "error" && saveMessage ? (
            <span className="flex items-center gap-1 text-xs font-medium text-red-500">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {saveMessage}
            </span>
          ) : null}

          {mode === "edit" && currentSlug ? (
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              disabled={isPending}
              aria-label="Delete article"
              className="rounded-xl border border-stone-200 bg-white p-2.5 text-red-500 hover:border-red-200 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isPending}
            className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-stone-50 disabled:opacity-60"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Draft"}
          </button>

          {currentSlug ? (
            <Link
              href={`/insights/${currentSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-stone-50"
            >
              Preview
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          ) : null}

          <div className="relative">
            <div className="flex overflow-hidden rounded-xl">
              <button
                type="button"
                onClick={handlePublish}
                disabled={isPending || !canPublish}
                title={!canPublish ? `Missing ${joinWithAnd(missingForPublish)}` : undefined}
                className="bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Publish
              </button>
              <button
                type="button"
                onClick={() => setPublishOpen((o) => !o)}
                className="border-l border-red-700 bg-red-600 px-2 py-2.5 text-white hover:bg-red-700"
                aria-label="Publish options"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            {publishOpen ? (
              <div className="absolute right-0 top-full z-10 mt-1 w-44 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg">
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={!canPublish}
                  className="flex w-full px-4 py-3 text-sm text-ink-950 hover:bg-stone-50 disabled:cursor-not-allowed disabled:text-stone-300 disabled:hover:bg-transparent"
                >
                  Publish to Website
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPublishOpen(false);
                    handleSaveDraft();
                  }}
                  className="flex w-full px-4 py-3 text-sm text-stone-600 hover:bg-stone-50"
                >
                  Save as Draft
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {state.publishStatus === "draft" ? (
        !canPublish ? (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
            <p className="text-xs font-medium text-stone-700">
              Before this can be published, add {joinWithAnd(missingForPublish)}.
            </p>
          </div>
        ) : (
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl border px-4 py-3",
              !state.seoTitle || !state.seoDescription ? "border-orange-200 bg-orange-50" : "border-emerald-200 bg-emerald-50",
            )}
          >
            <div className={cn("h-2 w-2 rounded-full", !state.seoTitle || !state.seoDescription ? "bg-orange-400" : "bg-emerald-400")} />
            <p className="text-xs font-medium text-stone-700">
              {!state.seoTitle
                ? "SEO title missing — add one in the settings panel"
                : !state.seoDescription
                  ? "Meta description missing — add one in the settings panel"
                  : "SEO looks good — ready to publish"}
            </p>
          </div>
        )
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <ArticleContentPanel state={state} onChange={updateField} onQueueImageDeletion={queueImageDeletion} />
        <ArticleSettingsPanel state={state} onChange={updateField} categories={categories} authors={authors} />
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete this article?"
        description="This permanently deletes the article and its cover and inline images from Cloudinary. This can't be undone."
        confirmLabel="Delete permanently"
        variant="danger"
        isLoading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}