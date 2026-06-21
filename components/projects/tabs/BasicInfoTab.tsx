// // components/projects/tabs/basic-info-tab.tsx
// "use client";

// import { useState } from "react";
// import type { ProjectDetail } from "@/lib/types";

// type BasicInfoTabProps = {
// 	project: ProjectDetail;
// 	onSave: (input: Partial<ProjectDetail>) => Promise<ProjectDetail | null>;
// };

// const STATUS_OPTIONS = [
// 	{ value: "draft", label: "Draft" },
// 	{ value: "pre_launch", label: "Pre-launch" },
// 	{ value: "active", label: "Active" },
// 	{ value: "selling_now", label: "Selling Now" },
// 	{ value: "sold_out", label: "Sold Out" },
// ];

// const TYPE_OPTIONS = [
// 	{ value: "residential", label: "Residential" },
// 	{ value: "commercial", label: "Commercial" },
// 	{ value: "mixed_use", label: "Mixed Use" },
// 	{ value: "hospitality", label: "Hospitality" },
// 	{ value: "land", label: "Land" },
// ];

// const LISTING_TYPE_OPTIONS = [
// 	{ value: "for_sale", label: "For Sale" },
// 	{ value: "for_rent", label: "For Rent" },
// ];

// const CONSTRUCTION_STATUS_OPTIONS = [
// 	{ value: "planning", label: "Planning" },
// 	{ value: "under_construction", label: "Under Construction" },
// 	{ value: "completed", label: "Completed" },
// ];

// export function BasicInfoTab({ project, onSave }: BasicInfoTabProps) {
// 	const [form, setForm] = useState({
// 		name: project.name,
// 		location: project.location,
// 		locationArea: project.locationArea,
// 		status: project.status,
// 		type: project.type,
// 		listingType: project.listingType,
// 		constructionStatus: project.constructionStatus,
// 		titleDocument: project.titleDocument ?? "",
// 		description: project.description ?? "",
// 	});
// 	const [saving, setSaving] = useState(false);

// 	function handleChange<K extends keyof typeof form>(
// 		key: K,
// 		value: (typeof form)[K],
// 	) {
// 		setForm((prev) => ({ ...prev, [key]: value }));
// 	}

// 	// Persists ONLY the changed field, passed explicitly rather than read off
// 	// `form` state. This avoids the stale-closure bug the previous version had:
// 	// calling setState then immediately reading `form` in the same handler
// 	// sees the value from BEFORE the update, since React state updates aren't
// 	// synchronous — selects especially would silently save the old option.
// 	async function persistField<K extends keyof typeof form>(
// 		key: K,
// 		value: (typeof form)[K],
// 	) {
// 		setSaving(true);
// 		await onSave({ [key]: value } as Partial<ProjectDetail>);
// 		setSaving(false);
// 	}

// 	return (
// 		<div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5 max-w-2xl">
// 			<div>
// 				<label className="block text-sm font-medium text-gray-700 mb-1.5">
// 					Project Name
// 				</label>
// 				<input
// 					value={form.name}
// 					onChange={(e) => handleChange("name", e.target.value)}
// 					onBlur={() => persistField("name", form.name)}
// 					className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30 focus:border-[#c8a84b]"
// 				/>
// 			</div>

// 			<div className="grid grid-cols-2 gap-4">
// 				<div>
// 					<label className="block text-sm font-medium text-gray-700 mb-1.5">
// 						Location
// 					</label>
// 					<input
// 						value={form.location}
// 						onChange={(e) => handleChange("location", e.target.value)}
// 						onBlur={() => persistField("location", form.location)}
// 						placeholder="Yaba, Lagos Mainland"
// 						className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30 focus:border-[#c8a84b]"
// 					/>
// 				</div>
// 				<div>
// 					<label className="block text-sm font-medium text-gray-700 mb-1.5">
// 						Location Area
// 					</label>
// 					<input
// 						value={form.locationArea}
// 						onChange={(e) => handleChange("locationArea", e.target.value)}
// 						onBlur={() => persistField("locationArea", form.locationArea)}
// 						placeholder="Yaba"
// 						className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30 focus:border-[#c8a84b]"
// 					/>
// 				</div>
// 			</div>

// 			<div className="grid grid-cols-2 gap-4">
// 				<div>
// 					<label className="block text-sm font-medium text-gray-700 mb-1.5">
// 						Status
// 					</label>
// 					<select
// 						value={form.status}
// 						onChange={(e) => {
// 							const v = e.target.value as typeof form.status;
// 							handleChange("status", v);
// 							persistField("status", v);
// 						}}
// 						className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30"
// 					>
// 						{STATUS_OPTIONS.map((opt) => (
// 							<option key={opt.value} value={opt.value}>
// 								{opt.label}
// 							</option>
// 						))}
// 					</select>
// 				</div>
// 				<div>
// 					<label className="block text-sm font-medium text-gray-700 mb-1.5">
// 						Project Type
// 					</label>
// 					<select
// 						value={form.type}
// 						onChange={(e) => {
// 							const v = e.target.value as typeof form.type;
// 							handleChange("type", v);
// 							persistField("type", v);
// 						}}
// 						className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30"
// 					>
// 						{TYPE_OPTIONS.map((opt) => (
// 							<option key={opt.value} value={opt.value}>
// 								{opt.label}
// 							</option>
// 						))}
// 					</select>
// 				</div>
// 			</div>

// 			{/* New fields — drive the public site's listing badge, status tag, and Title fact */}
// 			<div className="grid grid-cols-2 gap-4">
// 				<div>
// 					<label className="block text-sm font-medium text-gray-700 mb-1.5">
// 						Listing Type
// 					</label>
// 					<select
// 						value={form.listingType}
// 						onChange={(e) => {
// 							const v = e.target.value as typeof form.listingType;
// 							handleChange("listingType", v);
// 							persistField("listingType", v);
// 						}}
// 						className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30"
// 					>
// 						{LISTING_TYPE_OPTIONS.map((opt) => (
// 							<option key={opt.value} value={opt.value}>
// 								{opt.label}
// 							</option>
// 						))}
// 					</select>
// 					<p className="text-xs text-gray-400 mt-1">
// 						Controls the &quot;For sale&quot; / &quot;For rent&quot; badge and
// 						the public Projects filter.
// 					</p>
// 				</div>
// 				<div>
// 					<label className="block text-sm font-medium text-gray-700 mb-1.5">
// 						Construction Status
// 					</label>
// 					<select
// 						value={form.constructionStatus}
// 						onChange={(e) => {
// 							const v = e.target.value as typeof form.constructionStatus;
// 							handleChange("constructionStatus", v);
// 							persistField("constructionStatus", v);
// 						}}
// 						className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30"
// 					>
// 						{CONSTRUCTION_STATUS_OPTIONS.map((opt) => (
// 							<option key={opt.value} value={opt.value}>
// 								{opt.label}
// 							</option>
// 						))}
// 					</select>
// 				</div>
// 			</div>

// 			<div>
// 				<label className="block text-sm font-medium text-gray-700 mb-1.5">
// 					Title Document
// 				</label>
// 				<input
// 					value={form.titleDocument}
// 					onChange={(e) => handleChange("titleDocument", e.target.value)}
// 					onBlur={() => persistField("titleDocument", form.titleDocument)}
// 					placeholder="e.g. C of O, Governor's Consent"
// 					className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30 focus:border-[#c8a84b]"
// 				/>
// 				<p className="text-xs text-gray-400 mt-1">
// 					Shown in the &quot;Title&quot; field on the public project page.
// 				</p>
// 			</div>

// 			<div>
// 				<label className="block text-sm font-medium text-gray-700 mb-1.5">
// 					Description
// 				</label>
// 				<textarea
// 					value={form.description}
// 					onChange={(e) => handleChange("description", e.target.value)}
// 					onBlur={() => persistField("description", form.description)}
// 					rows={4}
// 					placeholder="Detailed public description appears here for buyers and investors."
// 					className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30 resize-none"
// 				/>
// 			</div>

// 			{saving && <p className="text-xs text-gray-400">Saving…</p>}
// 		</div>
// 	);
// }



// components/projects/tabs/basic-info-tab.tsx
"use client";

import { useState } from "react";
import { updateProjectAction } from "@/lib/actions/projects.actions";
import type { ProjectDetail } from "@/lib/types";

type BasicInfoTabProps = { project: ProjectDetail; onSaved: (patch: Partial<ProjectDetail>) => void };

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "pre_launch", label: "Pre-launch" },
  { value: "active", label: "Active" },
  { value: "selling_now", label: "Selling Now" },
  { value: "sold_out", label: "Sold Out" },
];
const TYPE_OPTIONS = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "mixed_use", label: "Mixed Use" },
  { value: "hospitality", label: "Hospitality" },
  { value: "land", label: "Land" },
];
const LISTING_TYPE_OPTIONS = [
  { value: "for_sale", label: "For Sale" },
  { value: "for_rent", label: "For Rent" },
];
const CONSTRUCTION_STATUS_OPTIONS = [
  { value: "planning", label: "Planning" },
  { value: "under_construction", label: "Under Construction" },
  { value: "completed", label: "Completed" },
];

export function BasicInfoTab({ project, onSaved }: BasicInfoTabProps) {
  const [form, setForm] = useState({
    name: project.name,
    location: project.location,
    locationArea: project.locationArea,
    status: project.status,
    type: project.type,
    listingType: project.listingType,
    constructionStatus: project.constructionStatus,
    titleDocument: project.titleDocument ?? "",
    description: project.description ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Saves exactly the field that changed, passed explicitly (not read off
  // `form`) — avoids the stale-closure bug from before.
  async function persistField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setSaving(true);
    setError(null);
    const result = await updateProjectAction(project.id, { [key]: value });
    if (result.success) onSaved({ [key]: value } as Partial<ProjectDetail>);
    else setError(result.error);
    setSaving(false);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Project Name</label>
        <input
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => persistField("name", form.name)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30 focus:border-[#c8a84b]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
          <input
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
            onBlur={() => persistField("location", form.location)}
            placeholder="Yaba, Lagos Mainland"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30 focus:border-[#c8a84b]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Location Area</label>
          <input
            value={form.locationArea}
            onChange={(e) => handleChange("locationArea", e.target.value)}
            onBlur={() => persistField("locationArea", form.locationArea)}
            placeholder="Yaba"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30 focus:border-[#c8a84b]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
          <select
            value={form.status}
            onChange={(e) => { const v = e.target.value as typeof form.status; handleChange("status", v); persistField("status", v); }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30"
          >
            {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Project Type</label>
          <select
            value={form.type}
            onChange={(e) => { const v = e.target.value as typeof form.type; handleChange("type", v); persistField("type", v); }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30"
          >
            {TYPE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Listing Type</label>
          <select
            value={form.listingType}
            onChange={(e) => { const v = e.target.value as typeof form.listingType; handleChange("listingType", v); persistField("listingType", v); }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30"
          >
            {LISTING_TYPE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <p className="text-xs text-gray-400 mt-1">Controls the &quot;For sale&quot; / &quot;For rent&quot; badge on the public site.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Construction Status</label>
          <select
            value={form.constructionStatus}
            onChange={(e) => { const v = e.target.value as typeof form.constructionStatus; handleChange("constructionStatus", v); persistField("constructionStatus", v); }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30"
          >
            {CONSTRUCTION_STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Title Document</label>
        <input
          value={form.titleDocument}
          onChange={(e) => handleChange("titleDocument", e.target.value)}
          onBlur={() => persistField("titleDocument", form.titleDocument)}
          placeholder="e.g. C of O, Governor's Consent"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30 focus:border-[#c8a84b]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          onBlur={() => persistField("description", form.description)}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30 resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
      {saving && <p className="text-xs text-gray-400">Saving…</p>}
    </div>
  );
}