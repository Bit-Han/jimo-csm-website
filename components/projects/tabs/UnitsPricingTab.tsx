// // components/projects/tabs/units-pricing-tab.tsx
// "use client";

// import { useState } from "react";
// import type { ProjectDetail, ProjectUnit } from "@/lib/types";
// import type { CreateProjectUnitInput } from "@/lib/validations/projects";
// import { formatNaira, nairaToKobo, koboToNaira } from "@/lib/utils/helpers";
// import { StatusBadge } from "@/components/ui/StatusBadge";
// import { Plus, MoreVertical } from "lucide-react";

// type UnitsPricingTabProps = {
//   project: ProjectDetail;
//   onUpdateUnit: (unitId: string, input: Partial<CreateProjectUnitInput>) => Promise<ProjectUnit | null>;
//   onAddUnit: (input: CreateProjectUnitInput) => Promise<ProjectUnit | null>;
// };

// // Local editable copy keeps the Live Preview instant while edits persist on blur.
// export function UnitsPricingTab({ project, onUpdateUnit, onAddUnit }: UnitsPricingTabProps) {
//   const [units, setUnits] = useState<ProjectUnit[]>(project.units);
//   const [openMenuId, setOpenMenuId] = useState<string | null>(null);

//   // Updates the local copy instantly so the Live Preview reflects keystrokes.
//   function patchLocal(unitId: string, patch: Partial<ProjectUnit>) {
//     setUnits((prev) => prev.map((u) => (u.id === unitId ? { ...u, ...patch } : u)));
//   }

//   // Persists to the server — typed against CreateProjectUnitInput (what the
//   // API actually accepts), not Partial<ProjectUnit>.
//   async function persist(unitId: string, patch: Partial<CreateProjectUnitInput>) {
//     await onUpdateUnit(unitId, patch);
//   }

//   async function handleAddUnit() {
//     const newUnit = await onAddUnit({
//       name: "New Unit Type",
//       status: "active",
//       totalUnits: 0,
//       availableUnits: 0,
//       orderIndex: units.length,
//     });
//     if (newUnit) setUnits((prev) => [...prev, newUnit]);
//   }

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//       {/* ── Editable units list ───────────────────────────────────────── */}
//       <div className="bg-white rounded-xl border border-gray-200 p-5">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h2 className="font-semibold text-gray-900">Units & Pricing</h2>
//             <p className="text-xs text-gray-500">Manage available unit types, pricing and calls-to-action.</p>
//           </div>
//           <div className="flex items-center gap-2">
//             <button className="text-xs font-medium px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
//               Reorder Units
//             </button>
//             <button
//               onClick={handleAddUnit}
//               className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#c8a84b] text-white rounded-lg hover:bg-[#b8962e] transition"
//             >
//               <Plus size={13} /> Add Unit
//             </button>
//           </div>
//         </div>

//         <div className="space-y-4">
//           {units.map((unit) => (
//             <div key={unit.id} className="border border-gray-200 rounded-xl p-4 relative">
//               <div className="flex items-start justify-between mb-3">
//                 <div className="flex items-center gap-2">
//                   <input
//                     value={unit.name}
//                     onChange={(e) => patchLocal(unit.id, { name: e.target.value })}
//                     onBlur={(e) => persist(unit.id, { name: e.target.value })}
//                     className="font-semibold text-gray-900 text-sm outline-none border-b border-transparent focus:border-[#c8a84b] bg-transparent"
//                   />
//                   <StatusBadge status={unit.status} />
//                 </div>
//                 <div className="relative">
//                   <button onClick={() => setOpenMenuId(openMenuId === unit.id ? null : unit.id)} className="p-1 hover:bg-gray-100 rounded">
//                     <MoreVertical size={14} className="text-gray-400" />
//                   </button>
//                   {openMenuId === unit.id && (
//                     <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 text-xs min-w-[100px]">
//                       <button className="w-full text-left px-3 py-1.5 hover:bg-gray-50">Duplicate</button>
//                       <button className="w-full text-left px-3 py-1.5 hover:bg-gray-50">Preview</button>
//                       <button className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600">Remove</button>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="block text-xs text-gray-500 mb-1">Number of Units</label>
//                   <input
//                     type="number"
//                     value={unit.totalUnits}
//                     onChange={(e) => patchLocal(unit.id, { totalUnits: Number(e.target.value) })}
//                     onBlur={(e) => persist(unit.id, { totalUnits: Number(e.target.value) })}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs text-gray-500 mb-1">Availability</label>
//                   <input
//                     value={`${unit.availableUnits} Available`}
//                     onChange={(e) => {
//                       const n = parseInt(e.target.value, 10) || 0;
//                       patchLocal(unit.id, { availableUnits: n });
//                     }}
//                     onBlur={() => persist(unit.id, { availableUnits: unit.availableUnits })}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs text-gray-500 mb-1">Launch Price</label>
//                   <input
//                     type="number"
//                     value={koboToNaira(unit.launchPriceKobo)}
//                     onChange={(e) => patchLocal(unit.id, { launchPriceKobo: nairaToKobo(Number(e.target.value)) })}
//                     onBlur={(e) => persist(unit.id, { launchPriceKobo: nairaToKobo(Number(e.target.value)) })}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs text-gray-500 mb-1">Current Price</label>
//                   <input
//                     type="number"
//                     value={koboToNaira(unit.currentPriceKobo)}
//                     onChange={(e) => patchLocal(unit.id, { currentPriceKobo: nairaToKobo(Number(e.target.value)) })}
//                     onBlur={(e) => persist(unit.id, { currentPriceKobo: nairaToKobo(Number(e.target.value)) })}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs text-gray-500 mb-1">CTA Label</label>
//                   <input
//                     value={unit.ctaLabel ?? ""}
//                     onChange={(e) => patchLocal(unit.id, { ctaLabel: e.target.value })}
//                     onBlur={(e) => persist(unit.id, { ctaLabel: e.target.value })}
//                     placeholder={`Enquire About ${unit.name}`}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs text-gray-500 mb-1">CTA Link</label>
//                   <input
//                     value={unit.ctaLink ?? ""}
//                     onChange={(e) => patchLocal(unit.id, { ctaLink: e.target.value })}
//                     onBlur={(e) => persist(unit.id, { ctaLink: e.target.value })}
//                     placeholder="/enquiry?unit=..."
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30"
//                   />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ── Live preview — reflects local state instantly ───────────────── */}
//       <div className="bg-white rounded-xl border border-gray-200 p-5">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="font-semibold text-gray-900">Live Preview</h2>
//           <a href={`/projects/${project.slug}`} target="_blank" rel="noreferrer" className="text-xs text-[#c8a84b] font-medium hover:underline">
//             Open in new tab ↗
//           </a>
//         </div>

//         <div className="bg-[#0f1f35] rounded-xl p-6 space-y-1">
//           <p className="text-xs text-[#c8a84b] font-semibold uppercase tracking-wide">Flexible Living Space</p>
//           <h3 className="text-xl font-bold text-white">Choose Your Ideal Home</h3>
//           <p className="text-sm text-slate-300">Thoughtfully designed units to match your lifestyle and investment goals.</p>
//         </div>

//         <div className="space-y-4 mt-4">
//           {units.map((unit) => (
//             <div key={unit.id} className="border border-gray-200 rounded-xl p-4 flex items-center gap-4">
//               <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0" />
//               <div className="flex-1 min-w-0">
//                 <p className="font-semibold text-gray-900 text-sm">{unit.name}</p>
//                 <p className="text-xs text-gray-500 truncate">Detailed public description appears here for buyers and investors.</p>
//                 <div className="flex items-center justify-between mt-2">
//                   <div>
//                     <p className="text-[10px] text-gray-400 uppercase">From</p>
//                     <p className="text-sm font-bold text-gray-900">{formatNaira(unit.currentPriceKobo)}</p>
//                   </div>
//                   <p className="text-xs font-semibold text-green-600">{unit.availableUnits} Available</p>
//                   <button className="bg-[#c8a84b] text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap">
//                     {unit.ctaLabel || `Enquire${unit.name.replace(/\s+/g, "")}`}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }




// components/projects/tabs/units-pricing-tab.tsx
"use client";

import { useState } from "react";
import type { ProjectDetail, ProjectUnit } from "@/lib/types";
import type { CreateProjectUnitInput } from "@/lib/validations/projects";
import { createProjectUnitAction, updateProjectUnitAction } from "@/lib/actions/projects.actions";
import { formatNaira, nairaToKobo, koboToNaira } from "@/lib/utils/helpers";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Plus, MoreVertical } from "lucide-react";

type UnitsPricingTabProps = { project: ProjectDetail; canEditPricing: boolean };

export function UnitsPricingTab({ project, canEditPricing }: UnitsPricingTabProps) {
  const [units, setUnits] = useState<ProjectUnit[]>(project.units);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Instant feedback while typing — local only, not yet persisted.
  function patchLocal(unitId: string, patch: Partial<ProjectUnit>) {
    setUnits((prev) => prev.map((u) => (u.id === unitId ? { ...u, ...patch } : u)));
  }

  // The action returns the row the server actually saved — we replace our
  // local copy with that, not with what we sent. No router.refresh needed.
  async function persist(unitId: string, patch: Partial<CreateProjectUnitInput>) {
    setError(null);
    const result = await updateProjectUnitAction(project.id, unitId, patch);
    if (result.success) setUnits((prev) => prev.map((u) => (u.id === unitId ? result.data : u)));
    else setError(result.error);
  }

  async function handleAddUnit() {
    setError(null);
    const result = await createProjectUnitAction(project.id, {
      name: "New Unit Type", status: "active", totalUnits: 0, availableUnits: 0, orderIndex: units.length,
    });
    if (result.success) setUnits((prev) => [...prev, result.data]);
    else setError(result.error);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">Units & Pricing</h2>
            <p className="text-xs text-gray-500">Manage available unit types, pricing and calls-to-action.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-xs font-medium px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition">Reorder Units</button>
            <button onClick={handleAddUnit} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#c8a84b] text-white rounded-lg hover:bg-[#b8962e] transition">
              <Plus size={13} /> Add Unit
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{error}</p>}

        <div className="space-y-4">
          {units.map((unit) => (
            <div key={unit.id} className="border border-gray-200 rounded-xl p-4 relative">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <input
                    value={unit.name}
                    onChange={(e) => patchLocal(unit.id, { name: e.target.value })}
                    onBlur={(e) => persist(unit.id, { name: e.target.value })}
                    className="font-semibold text-gray-900 text-sm outline-none border-b border-transparent focus:border-[#c8a84b] bg-transparent"
                  />
                  <StatusBadge status={unit.status} />
                </div>
                <div className="relative">
                  <button onClick={() => setOpenMenuId(openMenuId === unit.id ? null : unit.id)} className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical size={14} className="text-gray-400" />
                  </button>
                  {openMenuId === unit.id && (
                    <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 text-xs min-w-[100px]">
                      <button className="w-full text-left px-3 py-1.5 hover:bg-gray-50">Duplicate</button>
                      <button className="w-full text-left px-3 py-1.5 hover:bg-gray-50">Preview</button>
                      <button className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600">Remove</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Number of Units</label>
                  <input
                    type="number"
                    value={unit.totalUnits}
                    onChange={(e) => patchLocal(unit.id, { totalUnits: Number(e.target.value) })}
                    onBlur={(e) => persist(unit.id, { totalUnits: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Availability</label>
                  <input
                    value={`${unit.availableUnits} Available`}
                    onChange={(e) => patchLocal(unit.id, { availableUnits: parseInt(e.target.value, 10) || 0 })}
                    onBlur={() => persist(unit.id, { availableUnits: unit.availableUnits })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Launch Price {!canEditPricing && <span className="text-gray-400">(no permission)</span>}
                  </label>
                  <input
                    type="number"
                    disabled={!canEditPricing}
                    value={koboToNaira(unit.launchPriceKobo)}
                    onChange={(e) => patchLocal(unit.id, { launchPriceKobo: nairaToKobo(Number(e.target.value)) })}
                    onBlur={(e) => persist(unit.id, { launchPriceKobo: nairaToKobo(Number(e.target.value)) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30 disabled:bg-gray-50 disabled:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Current Price {!canEditPricing && <span className="text-gray-400">(no permission)</span>}
                  </label>
                  <input
                    type="number"
                    disabled={!canEditPricing}
                    value={koboToNaira(unit.currentPriceKobo)}
                    onChange={(e) => patchLocal(unit.id, { currentPriceKobo: nairaToKobo(Number(e.target.value)) })}
                    onBlur={(e) => persist(unit.id, { currentPriceKobo: nairaToKobo(Number(e.target.value)) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30 disabled:bg-gray-50 disabled:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">CTA Label</label>
                  <input
                    value={unit.ctaLabel ?? ""}
                    onChange={(e) => patchLocal(unit.id, { ctaLabel: e.target.value })}
                    onBlur={(e) => persist(unit.id, { ctaLabel: e.target.value })}
                    placeholder={`Enquire About ${unit.name}`}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">CTA Link</label>
                  <input
                    value={unit.ctaLink ?? ""}
                    onChange={(e) => patchLocal(unit.id, { ctaLink: e.target.value })}
                    onBlur={(e) => persist(unit.id, { ctaLink: e.target.value })}
                    placeholder="/enquiry?unit=..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b]/30"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Live Preview</h2>
          <a href={`/projects/${project.slug}`} target="_blank" rel="noreferrer" className="text-xs text-[#c8a84b] font-medium hover:underline">Open in new tab ↗</a>
        </div>
        <div className="bg-[#0f1f35] rounded-xl p-6 space-y-1">
          <p className="text-xs text-[#c8a84b] font-semibold uppercase tracking-wide">Flexible Living Space</p>
          <h3 className="text-xl font-bold text-white">Choose Your Ideal Home</h3>
          <p className="text-sm text-slate-300">Thoughtfully designed units to match your lifestyle and investment goals.</p>
        </div>
        <div className="space-y-4 mt-4">
          {units.map((unit) => (
            <div key={unit.id} className="border border-gray-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{unit.name}</p>
                <p className="text-xs text-gray-500 truncate">Detailed public description appears here for buyers and investors.</p>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase">From</p>
                    <p className="text-sm font-bold text-gray-900">{formatNaira(unit.currentPriceKobo)}</p>
                  </div>
                  <p className="text-xs font-semibold text-green-600">{unit.availableUnits} Available</p>
                  <button className="bg-[#c8a84b] text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap">
                    {unit.ctaLabel || `Enquire${unit.name.replace(/\s+/g, "")}`}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}