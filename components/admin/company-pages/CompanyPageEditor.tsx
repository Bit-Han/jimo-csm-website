// "use client";

// import { useState, useTransition } from "react";
// import Link from "next/link";
// import {
//   Check,
//   ChevronRight,
//   ExternalLink,
//   Loader2,
// } from "lucide-react";
// import { saveCompanyPageContent } from "@/lib/actions/admin/company-pages";
// import { cn } from "@/lib/utils/helpers";
// import type { CompanyPageSlug } from "@/lib/types/admin/company-pages";
// import { companyPageEditorLabels } from "@/lib/data/admin/company-pages";

// interface Section {
//   id: string;
//   label: string;
//   description: string;
//   dataSource: string;
// }

// const PAGE_SECTIONS: Record<CompanyPageSlug, Section[]> = {
//   home: [
//     {
//       id: "hero",
//       label: "Hero Section",
//       description: "Heading, description, stats, CTA buttons, and hero image.",
//       dataSource: "homePageData.hero",
//     },
//     {
//       id: "about-teaser",
//       label: "About Teaser",
//       description: "The short 'Driven by vision' block below the hero.",
//       dataSource: "homePageData.about",
//     },
//     {
//       id: "featured-projects",
//       label: "Featured Projects Section",
//       description: "Eyebrow, heading, and description. Projects come from the Projects module.",
//       dataSource: "homePageData.featured",
//     },
//     {
//       id: "why-choose",
//       label: "Why Choose Jimo",
//       description: "Heading and the 4 feature cards with icons.",
//       dataSource: "homePageData.whyChoose",
//     },
//     {
//       id: "how-we-work",
//       label: "How We Work",
//       description: "Heading and the 6 numbered process steps.",
//       dataSource: "homePageData.howWeWork",
//     },
//     {
//       id: "cta",
//       label: "Footer CTA",
//       description: "The dark 'Start a Conversation' banner at the bottom.",
//       dataSource: "homePageData.cta",
//     },
//   ],
//   about: [
//     {
//       id: "who-we-are",
//       label: "Who We Are",
//       description: "Heading, highlight quote, and body paragraphs.",
//       dataSource: "company_content.whoWeAre",
//     },
//     {
//       id: "team",
//       label: "Team Members",
//       description: "Team member names, roles, bios, and photos.",
//       dataSource: "company_content.teamMembers",
//     },
//     {
//       id: "core-values",
//       label: "Core Values",
//       description: "The 4 value cards with icons.",
//       dataSource: "company_content.coreValues",
//     },
//   ],
//   services: [
//     {
//       id: "services-list",
//       label: "Services List",
//       description: "The 4 service cards with bullets.",
//       dataSource: "company_content.services",
//     },
//     {
//       id: "property-types",
//       label: "What We Develop",
//       description: "The 4 property type cards.",
//       dataSource: "company_content.propertyTypes",
//     },
//     {
//       id: "company-promise",
//       label: "Our Promise",
//       description: "The three-line promise and description.",
//       dataSource: "company_content.companyPromise",
//     },
//   ],
//   "corporate-statement": [
//     {
//       id: "statement",
//       label: "Corporate Statement",
//       description: "The full corporate statement text.",
//       dataSource: "company_content.corporateStatement",
//     },
//   ],
// };

// export interface CompanyPageEditorProps {
//   slug: CompanyPageSlug;
//   title: string;
//   previewHref: string | null;
// }

// export function CompanyPageEditor({
//   slug,
//   title,
//   previewHref,
// }: CompanyPageEditorProps) {
//   const [expandedId, setExpandedId] = useState<string | null>(null);
//   const [saveStatus, setSaveStatus] = useState<
//     "idle" | "saving" | "saved" | "error"
//   >("idle");
//   const [isPending, startTransition] = useTransition();

//   const sections = PAGE_SECTIONS[slug];
//   const description = companyPageEditorLabels[slug];

//   function handleSave() {
//     setSaveStatus("saving");
//     startTransition(async () => {
//       const result = await saveCompanyPageContent(slug, {});
//       setSaveStatus(result.success ? "saved" : "error");
//     });
//   }

//   return (
//     <div className="space-y-5">
//       {/* Top bar */}
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight text-ink-950">
//             Edit: {title}
//           </h1>
//           <p className="mt-0.5 text-sm text-stone-500">{description}</p>
//         </div>

//         <div className="flex items-center gap-2.5">
//           {saveStatus === "saved" ? (
//             <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
//               <Check className="h-3.5 w-3.5" />
//               Saved
//             </span>
//           ) : saveStatus === "error" ? (
//             <span className="text-xs text-red-500">Save failed</span>
//           ) : null}

//           <button
//             type="button"
//             onClick={handleSave}
//             disabled={isPending}
//             className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-stone-50 disabled:opacity-60"
//           >
//             {isPending ? (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             ) : (
//               "Save Changes"
//             )}
//           </button>

//           {previewHref ? (
//             <Link
//               href={previewHref}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
//             >
//               Preview
//               <ExternalLink className="h-3.5 w-3.5" />
//             </Link>
//           ) : null}
//         </div>
//       </div>

//       {/* Integration stage note */}
//       <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
//         <p className="text-xs font-semibold text-blue-700">
//           Integration Stage
//         </p>
//         <p className="mt-1 text-xs text-blue-600">
//           This editor will be fully wired in the integration stage. Each
//           section below maps directly to a field in the{" "}
//           <code className="rounded bg-blue-100 px-1 py-0.5">
//             home_content
//           </code>{" "}
//           or{" "}
//           <code className="rounded bg-blue-100 px-1 py-0.5">
//             company_content
//           </code>{" "}
//           Supabase table. The public page already reads from{" "}
//           <code className="rounded bg-blue-100 px-1 py-0.5">
//             lib/data/
//           </code>{" "}
//           static files — swapping to the DB is a one-function change per page.
//         </p>
//       </div>

//       {/* Sections */}
//       <div className="space-y-3">
//         {sections.map((section) => {
//           const isExpanded = expandedId === section.id;
//           return (
//             <div
//               key={section.id}
//               className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
//             >
//               <button
//                 type="button"
//                 onClick={() =>
//                   setExpandedId(isExpanded ? null : section.id)
//                 }
//                 className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-stone-50"
//               >
//                 <div>
//                   <p className="text-sm font-bold text-ink-950">
//                     {section.label}
//                   </p>
//                   <p className="mt-0.5 text-xs text-stone-500">
//                     {section.description}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <code className="hidden rounded bg-stone-100 px-2 py-0.5 text-[10px] font-mono text-stone-500 sm:block">
//                     {section.dataSource}
//                   </code>
//                   <ChevronRight
//                     className={cn(
//                       "h-4 w-4 shrink-0 text-stone-400 transition-transform",
//                       isExpanded && "rotate-90",
//                     )}
//                   />
//                 </div>
//               </button>

//               {isExpanded ? (
//                 <div className="border-t border-stone-100 bg-stone-50/50 px-6 py-5">
//                   <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-stone-300 p-8 text-center">
//                     <p className="text-sm font-medium text-stone-500">
//                       Section editor wired in Integration Stage 5
//                     </p>
//                     <p className="text-xs text-stone-400">
//                       Will pull current values from the database and allow
//                       inline editing of all text fields, images, and nested
//                       items in this section.
//                     </p>
//                   </div>
//                 </div>
//               ) : null}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  // AlertCircle,
  Check,
  ChevronRight,
  ExternalLink,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import {
  saveWhoWeAre,
  saveCoreValues,
  saveTeamMembers,
  saveServices,
  savePropertyTypes,
  saveCompanyPromise,
} from "@/lib/actions/admin/company-pages";
import { ImageUploadField } from "@/components/admin/media/ImageUploadField";
import { inputCls, selectCls } from "@/components/admin/ui/EditorField";
import { companyIconOptions } from "@/lib/data/company-icons";
import { cn } from "@/lib/utils/helpers";
import type { CompanyPageSlug } from "@/lib/types/admin/company-pages";
import type {
  CompanyPromiseData,
  CompanyServiceData,
  CompanyWhoWeAreData,
  CoreValueData,
  PropertyTypeCategoryData,
  TeamMemberData,
} from "@/lib/db/schema/content";
import type { HomePageData } from "@/lib/types/home";

// ─── Section configs per page ─────────────────────────────────────────────

interface SectionConfig {
  id: string;
  label: string;
  description: string;
}

const PAGE_SECTIONS: Record<CompanyPageSlug, SectionConfig[]> = {
  home: [
    { id: "hero", label: "Hero Section", description: "Heading, description, stats, CTA buttons, and hero image." },
    { id: "about-teaser", label: "About Teaser", description: "The short block below the hero." },
    { id: "featured-projects", label: "Featured Projects Section", description: "Eyebrow, heading, and description." },
    { id: "why-choose", label: "Why Choose Jimo", description: "Heading and the 4 feature cards." },
    { id: "how-we-work", label: "How We Work", description: "Heading and the 6 numbered steps." },
    { id: "cta", label: "Footer CTA", description: "The dark CTA banner at the bottom." },
  ],
  about: [
    { id: "who-we-are", label: "Who We Are", description: "Heading, highlight quote, and body paragraphs." },
    { id: "team", label: "Team Members", description: "Team member names, roles, bios, and photos." },
    { id: "core-values", label: "Core Values", description: "The 4 value cards with icons." },
  ],
  services: [
    { id: "services-list", label: "Services List", description: "The 4 service cards with bullets." },
    { id: "property-types", label: "What We Develop", description: "The 4 property type cards." },
    { id: "company-promise", label: "Our Promise", description: "The three-line promise and description." },
  ],
  "corporate-statement": [
    { id: "statement", label: "Corporate Statement", description: "The full corporate statement text." },
  ],
};

// ─── Sub-editors ──────────────────────────────────────────────────────────

function WhoWeAreEditor({
  initial,
  onSave,
}: {
  initial: CompanyWhoWeAreData;
  onSave: (data: CompanyWhoWeAreData) => Promise<void>;
}) {
  const [data, setData] = useState<CompanyWhoWeAreData>(initial);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function updateParagraph(index: number, value: string) {
    const next = [...data.paragraphs];
    next[index] = value;
    setData((p) => ({ ...p, paragraphs: next }));
  }

  function handleSave() {
    startTransition(async () => {
      await onSave(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="space-y-4 pt-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-stone-500">Eyebrow</label>
        <input type="text" value={data.eyebrow} onChange={(e) => setData((p) => ({ ...p, eyebrow: e.target.value }))} className={inputCls} />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-stone-500">Heading</label>
        <input type="text" value={data.heading} onChange={(e) => setData((p) => ({ ...p, heading: e.target.value }))} className={inputCls} />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-stone-500">Highlight Quote</label>
        <textarea rows={3} value={data.highlight} onChange={(e) => setData((p) => ({ ...p, highlight: e.target.value }))} className={inputCls} />
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-medium text-stone-500">Body Paragraphs</label>
          <button type="button" onClick={() => setData((p) => ({ ...p, paragraphs: [...p.paragraphs, ""] }))} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
        {data.paragraphs.map((para, i) => (
          <div key={i} className="mb-2 flex gap-2">
            <textarea rows={3} value={para} onChange={(e) => updateParagraph(i, e.target.value)} className={`${inputCls} flex-1`} />
            {data.paragraphs.length > 1 ? (
              <button type="button" onClick={() => setData((p) => ({ ...p, paragraphs: p.paragraphs.filter((_, j) => j !== i) }))} className="self-start rounded-lg border border-stone-200 p-2 text-stone-400 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-3 border-t border-stone-100 pt-4">
        {saved ? <span className="flex items-center gap-1 text-xs text-emerald-600"><Check className="h-3 w-3" />Saved</span> : null}
        <button type="button" onClick={handleSave} disabled={isPending} className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Save Section
        </button>
      </div>
    </div>
  );
}

// function TeamEditor({
//   initial,
//   onSave,
// }: {
//   initial: TeamMemberData[];
//   onSave: (data: TeamMemberData[]) => Promise<void>;
// }) {
//   const [members, setMembers] = useState<TeamMemberData[]>(initial);
//   const [isPending, startTransition] = useTransition();
//   const [saved, setSaved] = useState(false);

//   function makeNew(): TeamMemberData {
//     return { id: `member-${Date.now()}`, name: "", role: "", bio: "", photo: { src: "", alt: "" } };
//   }

//   function update(id: string, field: keyof TeamMemberData | "photoSrc" | "photoAlt", value: string) {
//     setMembers((prev) => prev.map((m) => {
//       if (m.id !== id) return m;
//       if (field === "photoSrc") return { ...m, photo: { ...m.photo, src: value } };
//       if (field === "photoAlt") return { ...m, photo: { ...m.photo, alt: value } };
//       return { ...m, [field]: value };
//     }));
//   }

//   function handleSave() {
//     startTransition(async () => {
//       await onSave(members);
//       setSaved(true);
//       setTimeout(() => setSaved(false), 2500);
//     });
//   }

//   return (
//     <div className="space-y-4 pt-4">
//       {members.map((member) => (
//         <div key={member.id} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
//           <div className="grid gap-3 sm:grid-cols-2">
//             <div><label className="mb-1 block text-xs text-stone-500">Full Name</label><input type="text" value={member.name} onChange={(e) => update(member.id, "name", e.target.value)} className={inputCls} /></div>
//             <div><label className="mb-1 block text-xs text-stone-500">Role</label><input type="text" value={member.role} onChange={(e) => update(member.id, "role", e.target.value)} className={inputCls} /></div>
//             <div className="sm:col-span-2"><label className="mb-1 block text-xs text-stone-500">Bio</label><textarea rows={2} value={member.bio} onChange={(e) => update(member.id, "bio", e.target.value)} className={inputCls} /></div>
//             <div><label className="mb-1 block text-xs text-stone-500">Photo URL</label><input type="url" value={member.photo.src} onChange={(e) => update(member.id, "photoSrc", e.target.value)} placeholder="https://..." className={inputCls} /></div>
//             <div><label className="mb-1 block text-xs text-stone-500">Photo Alt Text</label><input type="text" value={member.photo.alt} onChange={(e) => update(member.id, "photoAlt", e.target.value)} className={inputCls} /></div>
//           </div>
//           <button type="button" onClick={() => setMembers((p) => p.filter((m) => m.id !== member.id))} className="mt-3 flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
//             <Trash2 className="h-3.5 w-3.5" /> Remove Member
//           </button>
//         </div>
//       ))}
//       <button type="button" onClick={() => setMembers((p) => [...p, makeNew()])} className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700">
//         <Plus className="h-4 w-4" /> Add Team Member
//       </button>
//       <div className="flex items-center justify-end gap-3 border-t border-stone-100 pt-4">
//         {saved ? <span className="flex items-center gap-1 text-xs text-emerald-600"><Check className="h-3 w-3" />Saved</span> : null}
//         <button type="button" onClick={handleSave} disabled={isPending} className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
//           {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save Team
//         </button>
//       </div>
//     </div>
//   );
// }

function TeamEditor({
	initial,
	onSave,
}: {
	initial: TeamMemberData[];
	onSave: (data: TeamMemberData[]) => Promise<void>;
}) {
	const [members, setMembers] = useState<TeamMemberData[]>(initial);
	const [isPending, startTransition] = useTransition();
	const [saved, setSaved] = useState(false);

	function makeNew(): TeamMemberData {
		return {
			id: `member-${Date.now()}`,
			name: "",
			role: "",
			bio: "",
			photo: { src: "", alt: "" },
		};
	}

	function updateText(
		id: string,
		field: "name" | "role" | "bio",
		value: string,
	) {
		setMembers((prev) =>
			prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
		);
	}

	function updatePhoto(id: string, src: string, alt: string) {
		setMembers((prev) =>
			prev.map((m) => (m.id === id ? { ...m, photo: { src, alt } } : m)),
		);
	}

	function handleSave() {
		startTransition(async () => {
			await onSave(members);
			setSaved(true);
			setTimeout(() => setSaved(false), 2500);
		});
	}

	return (
		<div className="space-y-6 pt-4">
			{members.map((member) => (
				<div
					key={member.id}
					className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-4"
				>
					{/* Photo upload */}
					<ImageUploadField
						label="Profile Photo"
						value={member.photo.src}
						altValue={member.photo.alt}
						onChange={(src, alt) => updatePhoto(member.id, src, alt)}
						folder="jimo-property/team-photos"
						aspectClass="aspect-square"
						hint="Square photo, minimum 400×400px."
					/>

					{/* Text fields */}
					<div className="grid gap-3 sm:grid-cols-2">
						<div>
							<label className="mb-1 block text-xs text-stone-500">
								Full Name *
							</label>
							<input
								type="text"
								value={member.name}
								onChange={(e) => updateText(member.id, "name", e.target.value)}
								className={inputCls}
							/>
						</div>
						<div>
							<label className="mb-1 block text-xs text-stone-500">
								Role / Title *
							</label>
							<input
								type="text"
								value={member.role}
								onChange={(e) => updateText(member.id, "role", e.target.value)}
								className={inputCls}
							/>
						</div>
					</div>
					<div>
						<label className="mb-1 block text-xs text-stone-500">Bio</label>
						<textarea
							rows={2}
							value={member.bio}
							onChange={(e) => updateText(member.id, "bio", e.target.value)}
							className={inputCls}
						/>
					</div>

					<button
						type="button"
						onClick={() =>
							setMembers((p) => p.filter((m) => m.id !== member.id))
						}
						className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
					>
						<Trash2 className="h-3.5 w-3.5" />
						Remove Member
					</button>
				</div>
			))}

			<button
				type="button"
				onClick={() => setMembers((p) => [...p, makeNew()])}
				className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
			>
				<Plus className="h-4 w-4" />
				Add Team Member
			</button>

			<div className="flex items-center justify-end gap-3 border-t border-stone-100 pt-4">
				{saved ? (
					<span className="flex items-center gap-1 text-xs text-emerald-600">
						<Check className="h-3 w-3" />
						Saved
					</span>
				) : null}
				<button
					type="button"
					onClick={handleSave}
					disabled={isPending}
					className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
				>
					{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
					Save Team
				</button>
			</div>
		</div>
	);
}

function CoreValuesEditor({
  initial,
  onSave,
}: {
  initial: CoreValueData[];
  onSave: (data: CoreValueData[]) => Promise<void>;
}) {
  const [values, setValues] = useState<CoreValueData[]>(initial);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function update(id: string, field: keyof CoreValueData, value: string) {
    setValues((p) => p.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  }

  function handleSave() {
    startTransition(async () => {
      await onSave(values);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="space-y-3 pt-4">
      {values.map((value) => (
        <div key={value.id} className="grid grid-cols-[180px_1fr_1fr] gap-2 rounded-xl border border-stone-200 bg-stone-50 p-3">
          <select value={value.icon} onChange={(e) => update(value.id, "icon", e.target.value)} className={selectCls}>
            {companyIconOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <input type="text" value={value.title} onChange={(e) => update(value.id, "title", e.target.value)} placeholder="Title" className={inputCls} />
          <input type="text" value={value.description} onChange={(e) => update(value.id, "description", e.target.value)} placeholder="Description" className={inputCls} />
        </div>
      ))}
      <div className="flex items-center justify-end gap-3 border-t border-stone-100 pt-4">
        {saved ? <span className="flex items-center gap-1 text-xs text-emerald-600"><Check className="h-3 w-3" />Saved</span> : null}
        <button type="button" onClick={handleSave} disabled={isPending} className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save Values
        </button>
      </div>
    </div>
  );
}

function ServicesEditor({
  initial,
  onSave,
}: {
  initial: CompanyServiceData[];
  onSave: (data: CompanyServiceData[]) => Promise<void>;
}) {
  const [services, setServices] = useState<CompanyServiceData[]>(initial);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function updateService(id: string, field: "icon" | "title" | "description", value: string) {
    setServices((p) => p.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  function updateBullet(serviceId: string, bulletId: string, label: string) {
    setServices((p) => p.map((s) => {
      if (s.id !== serviceId) return s;
      return { ...s, bullets: s.bullets.map((b) => (b.id === bulletId ? { ...b, label } : b)) };
    }));
  }

  function addBullet(serviceId: string) {
    setServices((p) => p.map((s) => {
      if (s.id !== serviceId) return s;
      return { ...s, bullets: [...s.bullets, { id: `bullet-${Date.now()}`, label: "" }] };
    }));
  }

  function removeBullet(serviceId: string, bulletId: string) {
    setServices((p) => p.map((s) => {
      if (s.id !== serviceId) return s;
      return { ...s, bullets: s.bullets.filter((b) => b.id !== bulletId) };
    }));
  }

  function handleSave() {
    startTransition(async () => {
      await onSave(services);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="space-y-4 pt-4">
      {services.map((service) => (
        <div key={service.id} className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
            <select value={service.icon} onChange={(e) => updateService(service.id, "icon", e.target.value)} className={selectCls}>
              {companyIconOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <input type="text" value={service.title} onChange={(e) => updateService(service.id, "title", e.target.value)} placeholder="Service title" className={inputCls} />
          </div>
          <textarea rows={2} value={service.description} onChange={(e) => updateService(service.id, "description", e.target.value)} placeholder="Description" className={inputCls} />
          <div className="space-y-2">
            <p className="text-xs font-medium text-stone-500">Bullet Points</p>
            {service.bullets.map((bullet) => (
              <div key={bullet.id} className="flex gap-2">
                <input type="text" value={bullet.label} onChange={(e) => updateBullet(service.id, bullet.id, e.target.value)} placeholder="Bullet point" className={`${inputCls} flex-1`} />
                <button type="button" onClick={() => removeBullet(service.id, bullet.id)} className="shrink-0 rounded-lg border border-stone-200 p-2 text-stone-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <button type="button" onClick={() => addBullet(service.id)} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"><Plus className="h-3.5 w-3.5" /> Add Bullet</button>
          </div>
        </div>
      ))}
      <div className="flex items-center justify-end gap-3 border-t border-stone-100 pt-4">
        {saved ? <span className="flex items-center gap-1 text-xs text-emerald-600"><Check className="h-3 w-3" />Saved</span> : null}
        <button type="button" onClick={handleSave} disabled={isPending} className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save Services
        </button>
      </div>
    </div>
  );
}

function PropertyTypesEditor({
  initial,
  onSave,
}: {
  initial: PropertyTypeCategoryData[];
  onSave: (data: PropertyTypeCategoryData[]) => Promise<void>;
}) {
  const [types, setTypes] = useState<PropertyTypeCategoryData[]>(initial);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function update(id: string, field: keyof PropertyTypeCategoryData, value: string) {
    setTypes((p) => p.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  }

  function handleSave() {
    startTransition(async () => {
      await onSave(types);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="space-y-3 pt-4">
      {types.map((type) => (
        <div key={type.id} className="grid grid-cols-[180px_1fr_1fr] gap-2 rounded-xl border border-stone-200 bg-stone-50 p-3">
          <select value={type.icon} onChange={(e) => update(type.id, "icon", e.target.value)} className={selectCls}>
            {companyIconOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <input type="text" value={type.title} onChange={(e) => update(type.id, "title", e.target.value)} placeholder="Type title" className={inputCls} />
          <input type="text" value={type.description} onChange={(e) => update(type.id, "description", e.target.value)} placeholder="Description" className={inputCls} />
        </div>
      ))}
      <div className="flex items-center justify-end gap-3 border-t border-stone-100 pt-4">
        {saved ? <span className="flex items-center gap-1 text-xs text-emerald-600"><Check className="h-3 w-3" />Saved</span> : null}
        <button type="button" onClick={handleSave} disabled={isPending} className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save Property Types
        </button>
      </div>
    </div>
  );
}

function CompanyPromiseEditor({
  initial,
  onSave,
}: {
  initial: CompanyPromiseData;
  onSave: (data: CompanyPromiseData) => Promise<void>;
}) {
  const [data, setData] = useState<CompanyPromiseData>(initial);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startTransition(async () => {
      await onSave(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="space-y-3 pt-4">
      {data.lines.map((line, i) => (
        <input key={i} type="text" value={line} onChange={(e) => {
          const next = [...data.lines];
          next[i] = e.target.value;
          setData((p) => ({ ...p, lines: next }));
        }} placeholder={`Line ${i + 1}`} className={inputCls} />
      ))}
      <input type="text" value={data.description} onChange={(e) => setData((p) => ({ ...p, description: e.target.value }))} placeholder="Description" className={inputCls} />
      <div className="flex items-center justify-end gap-3 border-t border-stone-100 pt-4">
        {saved ? <span className="flex items-center gap-1 text-xs text-emerald-600"><Check className="h-3 w-3" />Saved</span> : null}
        <button type="button" onClick={handleSave} disabled={isPending} className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save Promise
        </button>
      </div>
    </div>
  );
}

// ─── Props that include pre-fetched DB data ───────────────────────────────

export interface CompanyPageEditorProps {
	slug: CompanyPageSlug;
	title: string;
	previewHref: string | null;
	// DB data — undefined for slugs with no editor yet
	homePageData?: HomePageData | null;
	whoWeAreData?: CompanyWhoWeAreData;
	teamMembersData?: TeamMemberData[];
	coreValuesData?: CoreValueData[];
	servicesData?: CompanyServiceData[];
	propertyTypesData?: PropertyTypeCategoryData[];
	companyPromiseData?: CompanyPromiseData;
}

export function CompanyPageEditor({
  slug,
  title,
  previewHref,
  homePageData,
  whoWeAreData,
  teamMembersData,
  coreValuesData,
  servicesData,
  propertyTypesData,
  companyPromiseData,
}: CompanyPageEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const sections = PAGE_SECTIONS[slug];

  function renderSectionContent(sectionId: string) {
    // About page sections
    if (slug === "about") {
      if (sectionId === "who-we-are" && whoWeAreData) {
        return (
          <WhoWeAreEditor
            initial={whoWeAreData}
            onSave={async (data) => {
              const result = await saveWhoWeAre(data);
              if (!result.success) throw new Error(result.message);
            }}
          />
        );
      }
      if (sectionId === "team" && teamMembersData) {
        return (
          <TeamEditor
            initial={teamMembersData}
            onSave={async (data) => {
              const result = await saveTeamMembers(data);
              if (!result.success) throw new Error(result.message);
            }}
          />
        );
      }
      if (sectionId === "core-values" && coreValuesData) {
        return (
          <CoreValuesEditor
            initial={coreValuesData}
            onSave={async (data) => {
              const result = await saveCoreValues(data);
              if (!result.success) throw new Error(result.message);
            }}
          />
        );
      }
    }

    // Services page sections
    if (slug === "services") {
      if (sectionId === "services-list" && servicesData) {
        return (
          <ServicesEditor
            initial={servicesData}
            onSave={async (data) => {
              const result = await saveServices(data);
              if (!result.success) throw new Error(result.message);
            }}
          />
        );
      }
      if (sectionId === "property-types" && propertyTypesData) {
        return (
          <PropertyTypesEditor
            initial={propertyTypesData}
            onSave={async (data) => {
              const result = await savePropertyTypes(data);
              if (!result.success) throw new Error(result.message);
            }}
          />
        );
      }
      if (sectionId === "company-promise" && companyPromiseData) {
        return (
          <CompanyPromiseEditor
            initial={companyPromiseData}
            onSave={async (data) => {
              const result = await saveCompanyPromise(data);
              if (!result.success) throw new Error(result.message);
            }}
          />
        );
      }
    }

    // Placeholder for sections not yet built
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-stone-300 p-8 text-center">
        <p className="text-sm font-medium text-stone-500">
          Full editor for this section coming soon
        </p>
        <p className="text-xs text-stone-400">
          The Home page hero editor is planned for a dedicated follow-up stage.
        </p>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-950">
            Edit: {title}
          </h1>
        </div>
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
                onClick={() => setExpandedId(isExpanded ? null : section.id)}
                className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-stone-50"
              >
                <div>
                  <p className="text-sm font-bold text-ink-950">{section.label}</p>
                  <p className="mt-0.5 text-xs text-stone-500">{section.description}</p>
                </div>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 shrink-0 text-stone-400 transition-transform",
                    isExpanded && "rotate-90",
                  )}
                />
              </button>

              {isExpanded ? (
                <div className="border-t border-stone-100 px-6 pb-6">
                  {renderSectionContent(section.id)}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
    </>   
  );
}