"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { saveCompanyInfo } from "@/lib/actions/admin/settings";
import { inputCls } from "@/components/admin/ui/EditorField";
import { cn } from "@/lib/utils/helpers";
import type { CompanyInfoSettings, SystemServiceItem } from "@/lib/types/admin/settings";

const SERVICE_STATUS_CONFIG: Record<
  SystemServiceItem["status"],
  { label: string; cls: string }
> = {
  connected: { label: "Connected", cls: "text-emerald-600" },
  active: { label: "Active", cls: "text-blue-600" },
  scheduled: { label: "Scheduled", cls: "text-violet-600" },
  disconnected: { label: "Disconnected", cls: "text-stone-400" },
};

export interface CompanyInfoSectionProps {
  initialData: CompanyInfoSettings;
  systemStatus: SystemServiceItem[];
}

export function CompanyInfoSection({
  initialData,
  systemStatus,
}: CompanyInfoSectionProps) {
  const [data, setData] = useState<CompanyInfoSettings>(initialData);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function set(key: keyof CompanyInfoSettings, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    startTransition(async () => {
      const result = await saveCompanyInfo(data);
      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    });
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Company Information */}
      <div>
        <h2 className="text-base font-bold text-ink-950">
          Company Information
        </h2>
        <p className="mt-0.5 text-sm text-stone-500">
          Update your company details and primary contact information.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {(
            [
              ["companyName", "Company Name", "Jimo Property Development Limited"],
              ["companyEmail", "Company Email", "hello@jimo.ng"],
              ["salesEmail", "Sales Email", "sales@jimo.ng"],
              ["phoneNumber", "Phone Number", "+234 803 123 4567"],
              ["whatsappNumber", "WhatsApp Number", "+234 803 123 4567"],
            ] as [keyof CompanyInfoSettings, string, string][]
          ).map(([key, label, placeholder]) => (
            <div key={key}>
              <label className="mb-1.5 block text-sm font-medium text-ink-950">
                {label} <span className="text-red-500">*</span>
              </label>
              <input
                type={key.includes("Email") ? "email" : "text"}
                value={data[key]}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
                className={inputCls}
              />
            </div>
          ))}

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-ink-950">
              Office Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.officeAddress}
              onChange={(e) => set("officeAddress", e.target.value)}
              placeholder="2nd Floor, Jimo Building, Victoria Island, Lagos."
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div>
        <h3 className="text-sm font-bold text-ink-950">Social Media Links</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {(
            [
              ["instagramUrl", "Instagram"],
              ["linkedinUrl", "LinkedIn"],
              ["twitterUrl", "X / Twitter"],
              ["youtubeUrl", "YouTube"],
            ] as [keyof CompanyInfoSettings, string][]
          ).map(([key, label]) => (
            <div key={key}>
              <label className="mb-1.5 block text-sm font-medium text-ink-950">
                {label}
              </label>
              <input
                type="url"
                value={data[key]}
                onChange={(e) => set(key, e.target.value)}
                placeholder={`https://${label.toLowerCase().replace(/\s|\//, "")}.com/jimoproperty`}
                className={inputCls}
              />
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
        <h3 className="text-sm font-bold text-ink-950">System Status</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {systemStatus.map((service) => {
            const config = SERVICE_STATUS_CONFIG[service.status];
            return (
              <div key={service.id} className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  {service.label}
                </p>
                <p className="mt-1 text-xs text-stone-600">{service.detail}</p>
                <p className={cn("mt-2 text-sm font-bold", config.cls)}>
                  {config.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-end gap-3 border-t border-stone-100 pt-4">
        {saved ? (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
            <Check className="h-3.5 w-3.5" />
            Saved
          </span>
        ) : null}
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Save Changes
        </button>
      </div>
    </div>
  );
}