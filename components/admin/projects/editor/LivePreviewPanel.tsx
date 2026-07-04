import Image from "next/image";
import { ExternalLink } from "lucide-react";
// import { cn } from "@/lib/utils/helpers";
import Link from "next/link";
import type { ProjectEditorState, ProjectEditorTab } from "@/lib/types/admin/project-editor";

interface LivePreviewPanelProps {
  state: ProjectEditorState;
  activeTab: ProjectEditorTab;
  projectSlug: string | null;
}

export function LivePreviewPanel({ state, activeTab, projectSlug }: LivePreviewPanelProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white">
      <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
        <p className="text-sm font-bold text-ink-950">Live Preview</p>
        {projectSlug ? (
          <Link
            href={`/projects/${projectSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
          >
            Open in new tab
            <ExternalLink className="h-3 w-3" />
          </Link>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === "basic-info" && <BasicInfoPreview state={state} />}
        {activeTab === "hero" && <HeroPreview state={state} />}
        {activeTab === "units-pricing" && <UnitsPricingPreview state={state} />}
        {activeTab === "payment-plan" && <PaymentPlanPreview state={state} />}
        {activeTab === "gallery" && <GalleryPreview state={state} />}
        {activeTab === "brochure" && <BrochurePreview />}
        {activeTab === "enquiry" && <EnquiryPreview state={state} />}
        {activeTab === "seo" && <SeoPreview state={state} />}
      </div>
    </div>
  );
}

function BasicInfoPreview({ state }: { state: ProjectEditorState }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-cream-50 p-4">
      <div className="flex items-center gap-2 text-xs">
        {state.statusLabel ? (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
            {state.statusLabel}
          </span>
        ) : null}
      </div>
      <h3 className="mt-2 text-base font-bold text-ink-950">{state.name || "Project Name"}</h3>
      <p className="mt-1 text-xs text-stone-500">{state.location || "Location"}</p>
      <p className="mt-2 text-xs leading-relaxed text-stone-600 line-clamp-3">
        {state.description || "Project description will appear here."}
      </p>
    </div>
  );
}

function HeroPreview({ state }: { state: ProjectEditorState }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-ink-950">
      {state.coverImageSrc ? (
        <div className="relative aspect-[4/3]">
          <Image
            src={state.coverImageSrc}
            alt={state.coverImageAlt || "Cover"}
            fill
            sizes="400px"
            className="object-cover opacity-50"
          />
        </div>
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-ink-800">
          <p className="text-xs text-white/40">No cover image</p>
        </div>
      )}
      <div className="p-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-red-400">
          {state.statusLabel} · {state.categoryLabel}
        </p>
        <h3 className="mt-1 text-sm font-bold text-white">{state.name || "Project Name"}</h3>
        <p className="mt-1 text-xs text-white/60 line-clamp-2">
          {state.description || "Description"}
        </p>
      </div>
    </div>
  );
}

function UnitsPricingPreview({ state }: { state: ProjectEditorState }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gold-500">
        {state.unitsSectionEyebrow || "UNIT TYPES"}
      </p>
      <h3 className="mt-1 text-sm font-bold text-ink-950">
        {state.unitsSectionHeading || "Choose Your Ideal Home"}
      </h3>
      <p className="mt-1 text-xs text-stone-500">{state.unitsSectionDescription}</p>

      <div className="mt-4 space-y-3">
        {state.units.length === 0 ? (
          <p className="text-xs text-stone-400">No units added yet.</p>
        ) : (
          state.units.map((unit) => (
            <div
              key={unit.id}
              className="flex items-center justify-between rounded-xl border border-stone-200 p-3"
            >
              <div>
                <p className="text-xs font-semibold text-ink-950">{unit.name}</p>
                <p className="text-[10px] text-stone-500">
                  {unit.availabilityLabel || "Availability —"}
                </p>
                <p className="mt-0.5 text-sm font-bold text-ink-950">
                  {unit.priceLabel || "Price —"}
                </p>
              </div>
              <span className="rounded-full bg-ink-950 px-2.5 py-1 text-[10px] font-semibold text-white">
                {unit.ctaLabel || "Enquire"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function PaymentPlanPreview({ state }: { state: ProjectEditorState }) {
  return (
    <div>
      <p className="text-sm font-bold text-ink-950">Payment Plan</p>
      <ul className="mt-3 space-y-2">
        {state.paymentPlan.length === 0 ? (
          <p className="text-xs text-stone-400">No items yet.</p>
        ) : (
          state.paymentPlan.map((item) => (
            <li key={item.id} className="flex items-start gap-2 text-xs text-stone-600">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
              {item.label || "Item text"}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function GalleryPreview({ state }: { state: ProjectEditorState }) {
  const images = state.media.filter((m) => m.type === "image" && m.src);
  return (
    <div>
      <p className="mb-3 text-sm font-bold text-ink-950">Gallery</p>
      {images.length === 0 ? (
        <p className="text-xs text-stone-400">No gallery images yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {images.slice(0, 4).map((item) => (
            <div key={item.id} className="relative aspect-square overflow-hidden rounded-xl">
              <Image src={item.src} alt={item.alt} fill sizes="150px" className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BrochurePreview() {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-center">
      <p className="text-sm font-semibold text-ink-950">Brochure Download</p>
      <p className="mt-1 text-xs text-stone-500">
        Visitors fill in their name, email, and phone to unlock the PDF.
      </p>
      <div className="mt-3 rounded-lg bg-ink-950 px-4 py-2 text-xs font-semibold text-white">
        Download Brochure
      </div>
    </div>
  );
}

function EnquiryPreview({ state }: { state: ProjectEditorState }) {
  return (
    <div className="rounded-xl bg-ink-950 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-red-400">
        Start a Conversation
      </p>
      <p className="mt-1 text-sm font-bold text-white">
        {state.contactCtaTitle || "Register Interest"}
      </p>
      <p className="mt-1 text-xs text-white/60">
        {state.contactCtaDescription || "CTA description will appear here."}
      </p>
      <div className="mt-3 flex gap-2">
        <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
          Register Interest
        </span>
        <span className="rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white">
          Speak With Our Team
        </span>
      </div>
    </div>
  );
}

function SeoPreview({ state }: { state: ProjectEditorState }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
        Search Result Preview
      </p>
      <div className="rounded-xl border border-stone-200 bg-white p-4">
        <p className="truncate text-sm font-medium text-blue-700">
          {state.seoTitle || state.name || "Page Title"}
        </p>
        <p className="mt-0.5 text-[10px] text-emerald-700">
          jimopropertydevelopment.com/projects/
          {(state.name || "project").toLowerCase().replace(/\s+/g, "-")}
        </p>
        <p className="mt-1 text-xs text-stone-600 line-clamp-2">
          {state.seoDescription || state.description || "Meta description will appear here."}
        </p>
      </div>
      {state.focusKeyword ? (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-stone-500">Focus keyword:</span>
          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-ink-950">
            {state.focusKeyword}
          </span>
        </div>
      ) : null}
    </div>
  );
}