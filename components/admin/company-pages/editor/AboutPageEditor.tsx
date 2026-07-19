//@components/admin/company-pages/editor/AboutPageEditor.tsx

"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { StorageImageField } from "./StorageImageField";
import {
  saveWhoWeAre,
  saveCoreValues,
  saveTeamMembers,
} from "@/lib/actions/admin/company-pages";
import type {
  CompanyWhoWeAreData,
  CoreValueData,
  TeamMemberData,
} from "@/lib/db/schema/content";

const inputCls =
  "w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm text-ink-950 placeholder:text-stone-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-stone-500">
        {label}
      </label>
      {children}
    </div>
  );
}

function SaveRow({
  onSave,
}: {
  onSave: () => Promise<{ success: boolean; message: string }>;
}) {
  const [isPending, start] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  return (
    <div className="mt-4 flex items-center justify-end gap-3 border-t border-stone-100 pt-4">
      {result ? (
        <span
          className={`text-xs font-medium ${
            result.ok ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {result.text}
        </span>
      ) : null}
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          start(async () => {
            const r = await onSave();
            setResult({ ok: r.success, text: r.message });
            setTimeout(() => setResult(null), 3000);
          });
        }}
        className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}
        Save
      </button>
    </div>
  );
}

function Accordion({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-stone-50"
      >
        <div>
          <p className="text-sm font-bold text-ink-950">{title}</p>
          {description ? (
            <p className="mt-0.5 text-xs text-stone-400">{description}</p>
          ) : null}
        </div>
        {open ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-stone-400" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-stone-400" />
        )}
      </button>
      {open ? (
        <div className="border-t border-stone-100 px-6 pb-6 pt-5">
          {children}
        </div>
      ) : null}
    </div>
  );
}

const DEFAULT_WHO: CompanyWhoWeAreData = {
  eyebrow: "Who We Are",
  heading: "",
  highlight: "",
  paragraphs: [""],
};

export function AboutPageEditor({
  whoWeAre: initial,
  coreValues: initialValues,
  teamMembers: initialTeam,
}: {
  whoWeAre: CompanyWhoWeAreData | null;
  coreValues: CoreValueData[] | null;
  teamMembers: TeamMemberData[] | null;
}) {
  const [whoWeAre, setWhoWeAre] = useState<CompanyWhoWeAreData>(
    initial ?? DEFAULT_WHO,
  );
  const [coreValues, setCoreValues] = useState<CoreValueData[]>(
    initialValues ?? [],
  );
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>(
    initialTeam ?? [],
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-950">
          Edit About Page
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          <Link
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-red-600 hover:underline"
          >
            Preview live page →
          </Link>
        </p>
      </div>

      {/* ── Who We Are ── */}
      <Accordion
        title="Who We Are"
        description="Eyebrow, heading, highlight quote, and body paragraphs"
      >
        <div className="space-y-4">
          <Field label="Eyebrow">
            <input
              type="text"
              value={whoWeAre.eyebrow}
              onChange={(e) =>
                setWhoWeAre((p) => ({ ...p, eyebrow: e.target.value }))
              }
              className={inputCls}
            />
          </Field>
          <Field label="Heading">
            <input
              type="text"
              value={whoWeAre.heading}
              onChange={(e) =>
                setWhoWeAre((p) => ({ ...p, heading: e.target.value }))
              }
              className={inputCls}
            />
          </Field>
          <Field label="Highlight quote (displayed in a red box)">
            <textarea
              rows={3}
              value={whoWeAre.highlight}
              onChange={(e) =>
                setWhoWeAre((p) => ({ ...p, highlight: e.target.value }))
              }
              className={inputCls}
            />
          </Field>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-medium text-stone-500">
                Body paragraphs
              </label>
              <button
                type="button"
                onClick={() =>
                  setWhoWeAre((p) => ({
                    ...p,
                    paragraphs: [...p.paragraphs, ""],
                  }))
                }
                className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Add paragraph
              </button>
            </div>
            {whoWeAre.paragraphs.map((para, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <textarea
                  rows={3}
                  value={para}
                  onChange={(e) => {
                    const next = [...whoWeAre.paragraphs];
                    next[i] = e.target.value;
                    setWhoWeAre((p) => ({ ...p, paragraphs: next }));
                  }}
                  placeholder={`Paragraph ${i + 1}`}
                  className={`${inputCls} flex-1`}
                />
                {whoWeAre.paragraphs.length > 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setWhoWeAre((p) => ({
                        ...p,
                        paragraphs: p.paragraphs.filter((_, j) => j !== i),
                      }))
                    }
                    className="self-start rounded-lg border border-stone-200 p-2 text-stone-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
        <SaveRow onSave={() => saveWhoWeAre(whoWeAre)} />
      </Accordion>

      {/* ── Core Values ── */}
      <Accordion title="Core Values" description="The 4 value cards">
        <div className="space-y-4">
          {coreValues.length === 0 ? (
            <p className="text-sm text-stone-400">
              No core values found. Run{" "}
              <code className="rounded bg-stone-100 px-1 py-0.5">
                pnpm run db:seed
              </code>{" "}
              to populate.
            </p>
          ) : null}
          {coreValues.map((value, i) => (
            <div
              key={value.id}
              className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-3"
            >
              <p className="text-xs font-semibold text-stone-400">
                Value {i + 1}
              </p>
              <Field label="Title">
                <input
                  type="text"
                  value={value.title}
                  onChange={(e) => {
                    const next = [...coreValues];
                    next[i] = { ...value, title: e.target.value };
                    setCoreValues(next);
                  }}
                  className={inputCls}
                />
              </Field>
              <Field label="Description">
                <textarea
                  rows={2}
                  value={value.description}
                  onChange={(e) => {
                    const next = [...coreValues];
                    next[i] = { ...value, description: e.target.value };
                    setCoreValues(next);
                  }}
                  className={inputCls}
                />
              </Field>
            </div>
          ))}
        </div>
        {coreValues.length > 0 ? (
          <SaveRow onSave={() => saveCoreValues(coreValues)} />
        ) : null}
      </Accordion>

      {/* ── Team Members ── */}
      <Accordion
        title="Team Members"
        description="Names, roles, bios, and profile photos"
      >
        <div className="space-y-6">
          {teamMembers.map((member, i) => (
            <div
              key={member.id}
              className="rounded-xl border border-stone-200 bg-stone-50 p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-stone-500">
                  Team member {i + 1}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setTeamMembers((p) => p.filter((_, j) => j !== i))
                  }
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>

              {/* Photo upload via Supabase Storage */}
              <StorageImageField
                label="Profile Photo"
                value={member.photo.src}
                altValue={member.photo.alt}
                onChange={(src, alt) => {
                  const next = [...teamMembers];
                  next[i] = { ...member, photo: { src, alt } };
                  setTeamMembers(next);
                }}
                folder="team-photos"
                aspectClass="aspect-square"
                hint="Square photo, min 400×400px. Stored in Supabase Storage."
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Full Name *">
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => {
                      const next = [...teamMembers];
                      next[i] = { ...member, name: e.target.value };
                      setTeamMembers(next);
                    }}
                    className={inputCls}
                  />
                </Field>
                <Field label="Role / Title *">
                  <input
                    type="text"
                    value={member.role}
                    onChange={(e) => {
                      const next = [...teamMembers];
                      next[i] = { ...member, role: e.target.value };
                      setTeamMembers(next);
                    }}
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label="Bio">
                <textarea
                  rows={2}
                  value={member.bio}
                  onChange={(e) => {
                    const next = [...teamMembers];
                    next[i] = { ...member, bio: e.target.value };
                    setTeamMembers(next);
                  }}
                  className={inputCls}
                />
              </Field>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setTeamMembers((p) => [
                ...p,
                {
                  id: `member-${Date.now()}`,
                  name: "",
                  role: "",
                  bio: "",
                  photo: { src: "", alt: "" },
                },
              ])
            }
            className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700"
          >
            <Plus className="h-4 w-4" />
            Add Team Member
          </button>
        </div>
        <SaveRow onSave={() => saveTeamMembers(teamMembers)} />
      </Accordion>
    </div>
  );
}