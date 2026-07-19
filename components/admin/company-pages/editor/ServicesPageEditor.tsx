//components/admin/company-pages/editor/ServicesPageEditor.tsx

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
import {
  saveServices,
  savePropertyTypes,
  saveCompanyPromise,
} from "@/lib/actions/admin/company-pages";
import type {
  CompanyPromiseData,
  CompanyServiceData,
  PropertyTypeCategoryData,
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

export function ServicesPageEditor({
  services: initialServices,
  propertyTypes: initialTypes,
  companyPromise: initialPromise,
}: {
  services: CompanyServiceData[] | null;
  propertyTypes: PropertyTypeCategoryData[] | null;
  companyPromise: CompanyPromiseData | null;
}) {
  const [services, setServices] = useState<CompanyServiceData[]>(
    initialServices ?? [],
  );
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeCategoryData[]>(
    initialTypes ?? [],
  );
  const [promise, setPromise] = useState<CompanyPromiseData>(
    initialPromise ?? { lines: ["", "", ""], description: "" },
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-950">
          Edit Services Page
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          <Link
            href="/services"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-red-600 hover:underline"
          >
            Preview live page →
          </Link>
        </p>
      </div>

      {/* ── Services List ── */}
      <Accordion
        title="Services List"
        description="The 4 service cards with title, description, and bullet points"
      >
        <div className="space-y-5">
          {services.length === 0 ? (
            <p className="text-sm text-stone-400">
              No services found. Run{" "}
              <code className="rounded bg-stone-100 px-1 py-0.5">
                pnpm run db:seed
              </code>
              .
            </p>
          ) : null}

          {services.map((service, si) => (
            <div
              key={service.id}
              className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-3"
            >
              <p className="text-xs font-semibold text-stone-400">
                Service {si + 1}
              </p>
              <Field label="Title">
                <input
                  type="text"
                  value={service.title}
                  onChange={(e) => {
                    const next = [...services];
                    next[si] = { ...service, title: e.target.value };
                    setServices(next);
                  }}
                  className={inputCls}
                />
              </Field>
              <Field label="Description">
                <textarea
                  rows={2}
                  value={service.description}
                  onChange={(e) => {
                    const next = [...services];
                    next[si] = { ...service, description: e.target.value };
                    setServices(next);
                  }}
                  className={inputCls}
                />
              </Field>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-medium text-stone-500">
                    Bullet points
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...services];
                      next[si] = {
                        ...service,
                        bullets: [
                          ...service.bullets,
                          { id: `b-${Date.now()}`, label: "" },
                        ],
                      };
                      setServices(next);
                    }}
                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
                {service.bullets.map((bullet, bi) => (
                  <div key={bullet.id} className="mb-1.5 flex gap-2">
                    <input
                      type="text"
                      value={bullet.label}
                      onChange={(e) => {
                        const next = [...services];
                        const bullets = [...next[si]!.bullets];
                        bullets[bi] = { ...bullet, label: e.target.value };
                        next[si] = { ...next[si]!, bullets };
                        setServices(next);
                      }}
                      placeholder="Bullet point text"
                      className={`${inputCls} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...services];
                        next[si] = {
                          ...next[si]!,
                          bullets: next[si]!.bullets.filter(
                            (_, j) => j !== bi,
                          ),
                        };
                        setServices(next);
                      }}
                      className="shrink-0 rounded-lg border border-stone-200 p-2 text-stone-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {services.length > 0 ? (
          <SaveRow onSave={() => saveServices(services)} />
        ) : null}
      </Accordion>

      {/* ── What We Develop ── */}
      <Accordion
        title="What We Develop"
        description="The 4 property type cards"
      >
        <div className="space-y-4">
          {propertyTypes.length === 0 ? (
            <p className="text-sm text-stone-400">
              No property types found. Run{" "}
              <code className="rounded bg-stone-100 px-1 py-0.5">
                pnpm run db:seed
              </code>
              .
            </p>
          ) : null}

          {propertyTypes.map((type, i) => (
            <div
              key={type.id}
              className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-3"
            >
              <p className="text-xs font-semibold text-stone-400">
                Category {i + 1}
              </p>
              <Field label="Title">
                <input
                  type="text"
                  value={type.title}
                  onChange={(e) => {
                    const next = [...propertyTypes];
                    next[i] = { ...type, title: e.target.value };
                    setPropertyTypes(next);
                  }}
                  className={inputCls}
                />
              </Field>
              <Field label="Description">
                <textarea
                  rows={2}
                  value={type.description}
                  onChange={(e) => {
                    const next = [...propertyTypes];
                    next[i] = { ...type, description: e.target.value };
                    setPropertyTypes(next);
                  }}
                  className={inputCls}
                />
              </Field>
            </div>
          ))}
        </div>
        {propertyTypes.length > 0 ? (
          <SaveRow onSave={() => savePropertyTypes(propertyTypes)} />
        ) : null}
      </Accordion>

      {/* ── Our Promise ── */}
      <Accordion
        title="Our Promise"
        description="The three headline lines and supporting description"
      >
        <div className="space-y-3">
          {promise.lines.map((line, i) => (
            <Field key={i} label={`Promise line ${i + 1}`}>
              <input
                type="text"
                value={line}
                onChange={(e) => {
                  const next = [...promise.lines];
                  next[i] = e.target.value;
                  setPromise((p) => ({ ...p, lines: next }));
                }}
                placeholder={`Line ${i + 1}`}
                className={inputCls}
              />
            </Field>
          ))}
          <Field label="Supporting description (smaller text below the lines)">
            <input
              type="text"
              value={promise.description}
              onChange={(e) =>
                setPromise((p) => ({ ...p, description: e.target.value }))
              }
              className={inputCls}
            />
          </Field>
        </div>
        <SaveRow onSave={() => saveCompanyPromise(promise)} />
      </Accordion>
    </div>
  );
}