// components/projects/project-editor-shell.tsx
"use client";

import { useState } from "react";
import { ProjectEditorTabs, type TabKey } from "./ProjectEditorTabs";
import { BasicInfoTab } from "./tabs/BasicInfoTab";
import { UnitsPricingTab } from "./tabs/UnitsPricingTab";
import { updateProjectAction } from "@/lib/actions/projects.actions";
import { formatRelativeTime } from "@/lib/utils/helpers";
import type { ProjectDetail } from "@/lib/types";

type ProjectEditorShellProps = { project: ProjectDetail; canEditPricing: boolean };

export function ProjectEditorShell({ project, canEditPricing }: ProjectEditorShellProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("basic_info");
  // Single source of truth for "what the project currently looks like on
  // this client". Both the top action bar AND BasicInfoTab report into this
  // via applyUpdate — that's deliberate: there are two places in this UI
  // that can change `status` (this bar's Publish button, and the Status
  // dropdown inside Basic Info), and without a shared source they'd drift.
  const [currentProject, setCurrentProject] = useState(project);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function applyUpdate(patch: Partial<ProjectDetail>) {
    setCurrentProject((prev) => ({ ...prev, ...patch, updatedAt: new Date() }));
  }

  async function handleStatusAction(status: "draft" | "active") {
    setIsPublishing(true);
    setError(null);
    const result = await updateProjectAction(currentProject.id, { status });
    if (result.success) applyUpdate({ status });
    else setError(result.error);
    setIsPublishing(false);
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {currentProject.name} • Last edited {formatRelativeTime(currentProject.updatedAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleStatusAction("draft")} disabled={isPublishing} className="px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-60">
            Save Draft
          </button>
          <a href={`/projects/${currentProject.slug}`} target="_blank" rel="noreferrer" className="px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            Preview
          </a>
          <button onClick={() => handleStatusAction("active")} disabled={isPublishing} className="px-5 py-2.5 text-sm font-semibold bg-[#c8a84b] hover:bg-[#b8962e] text-white rounded-lg transition disabled:opacity-60">
            {isPublishing ? "Publishing…" : "Publish ▾"}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      <ProjectEditorTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "basic_info" && <BasicInfoTab project={currentProject} onSaved={applyUpdate} />}
      {activeTab === "units_pricing" && <UnitsPricingTab project={currentProject} canEditPricing={canEditPricing} />}
    </div>
  );
}