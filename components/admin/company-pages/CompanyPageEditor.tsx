"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { saveCompanyPageContent } from "@/lib/actions/admin/company-pages";
import { cn } from "@/lib/utils/helpers";
import type { CompanyPageSlug } from "@/lib/types/admin/company-pages";
import { companyPageEditorLabels } from "@/lib/data/admin/company-pages";

interface Section {
  id: string;
  label: string;
  description: string;
  dataSource: string;
}

const PAGE_SECTIONS: Record<CompanyPageSlug, Section[]> = {
  home: [
    {
      id: "hero",
      label: "Hero Section",
      description: "Heading, description, stats, CTA buttons, and hero image.",
      dataSource: "homePageData.hero",
    },
    {
      id: "about-teaser",
      label: "About Teaser",
      description: "The short 'Driven by vision' block below the hero.",
      dataSource: "homePageData.about",
    },
    {
      id: "featured-projects",
      label: "Featured Projects Section",
      description: "Eyebrow, heading, and description. Projects come from the Projects module.",
      dataSource: "homePageData.featured",
    },
    {
      id: "why-choose",
      label: "Why Choose Jimo",
      description: "Heading and the 4 feature cards with icons.",
      dataSource: "homePageData.whyChoose",
    },
    {
      id: "how-we-work",
      label: "How We Work",
      description: "Heading and the 6 numbered process steps.",
      dataSource: "homePageData.howWeWork",
    },
    {
      id: "cta",
      label: "Footer CTA",
      description: "The dark 'Start a Conversation' banner at the bottom.",
      dataSource: "homePageData.cta",
    },
  ],
  about: [
    {
      id: "who-we-are",
      label: "Who We Are",
      description: "Heading, highlight quote, and body paragraphs.",
      dataSource: "company_content.whoWeAre",
    },
    {
      id: "team",
      label: "Team Members",
      description: "Team member names, roles, bios, and photos.",
      dataSource: "company_content.teamMembers",
    },
    {
      id: "core-values",
      label: "Core Values",
      description: "The 4 value cards with icons.",
      dataSource: "company_content.coreValues",
    },
  ],
  services: [
    {
      id: "services-list",
      label: "Services List",
      description: "The 4 service cards with bullets.",
      dataSource: "company_content.services",
    },
    {
      id: "property-types",
      label: "What We Develop",
      description: "The 4 property type cards.",
      dataSource: "company_content.propertyTypes",
    },
    {
      id: "company-promise",
      label: "Our Promise",
      description: "The three-line promise and description.",
      dataSource: "company_content.companyPromise",
    },
  ],
  "corporate-statement": [
    {
      id: "statement",
      label: "Corporate Statement",
      description: "The full corporate statement text.",
      dataSource: "company_content.corporateStatement",
    },
  ],
};

export interface CompanyPageEditorProps {
  slug: CompanyPageSlug;
  title: string;
  previewHref: string | null;
}

export function CompanyPageEditor({
  slug,
  title,
  previewHref,
}: CompanyPageEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [isPending, startTransition] = useTransition();

  const sections = PAGE_SECTIONS[slug];
  const description = companyPageEditorLabels[slug];

  function handleSave() {
    setSaveStatus("saving");
    startTransition(async () => {
      const result = await saveCompanyPageContent(slug, {});
      setSaveStatus(result.success ? "saved" : "error");
    });
  }

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-950">
            Edit: {title}
          </h1>
          <p className="mt-0.5 text-sm text-stone-500">{description}</p>
        </div>

        <div className="flex items-center gap-2.5">
          {saveStatus === "saved" ? (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
              <Check className="h-3.5 w-3.5" />
              Saved
            </span>
          ) : saveStatus === "error" ? (
            <span className="text-xs text-red-500">Save failed</span>
          ) : null}

          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-stone-50 disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </button>

          {previewHref ? (
            <Link
              href={previewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Preview
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </div>
      </div>

      {/* Integration stage note */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-xs font-semibold text-blue-700">
          Integration Stage
        </p>
        <p className="mt-1 text-xs text-blue-600">
          This editor will be fully wired in the integration stage. Each
          section below maps directly to a field in the{" "}
          <code className="rounded bg-blue-100 px-1 py-0.5">
            home_content
          </code>{" "}
          or{" "}
          <code className="rounded bg-blue-100 px-1 py-0.5">
            company_content
          </code>{" "}
          Supabase table. The public page already reads from{" "}
          <code className="rounded bg-blue-100 px-1 py-0.5">
            lib/data/
          </code>{" "}
          static files — swapping to the DB is a one-function change per page.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {sections.map((section) => {
          const isExpanded = expandedId === section.id;
          return (
            <div
              key={section.id}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedId(isExpanded ? null : section.id)
                }
                className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-stone-50"
              >
                <div>
                  <p className="text-sm font-bold text-ink-950">
                    {section.label}
                  </p>
                  <p className="mt-0.5 text-xs text-stone-500">
                    {section.description}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <code className="hidden rounded bg-stone-100 px-2 py-0.5 text-[10px] font-mono text-stone-500 sm:block">
                    {section.dataSource}
                  </code>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 shrink-0 text-stone-400 transition-transform",
                      isExpanded && "rotate-90",
                    )}
                  />
                </div>
              </button>

              {isExpanded ? (
                <div className="border-t border-stone-100 bg-stone-50/50 px-6 py-5">
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-stone-300 p-8 text-center">
                    <p className="text-sm font-medium text-stone-500">
                      Section editor wired in Integration Stage 5
                    </p>
                    <p className="text-xs text-stone-400">
                      Will pull current values from the database and allow
                      inline editing of all text fields, images, and nested
                      items in this section.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}