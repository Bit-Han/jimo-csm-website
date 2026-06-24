// // import { ButtonLink } from "@/components/ui/Button";
// // import type { ProjectDetail } from "@/lib/types/project-detail";

// // export interface ProjectFactsCardProps {
// //   project: ProjectDetail;
// // }

// // export function ProjectFactsCard({ project }: ProjectFactsCardProps) {
// //   return (
// //     <aside className="sticky top-24 rounded-3xl border border-stone-200 bg-white p-6">
// //       <h2 className="text-lg font-bold text-ink-950">Project Facts</h2>
// //       <dl className="mt-4 space-y-4">
// //         {project.facts.map((fact) => (
// //           <div
// //             key={fact.label}
// //             className="border-b border-stone-100 pb-3 last:border-none last:pb-0"
// //           >
// //             <dt className="text-xs font-medium uppercase tracking-wide text-stone-500">
// //               {fact.label}
// //             </dt>
// //             <dd className="mt-1 text-sm font-semibold text-ink-950">{fact.value}</dd>
// //           </div>
// //         ))}
// //       </dl>
// //       <ButtonLink
// //         href={project.secondaryCta.href}
// //         variant="accent"
// //         size="md"
// //         className="mt-6 w-full"
// //       >
// //         Register Interest
// //       </ButtonLink>
// //     </aside>
// //   );
// // }

// import { ButtonLink } from "@/components/ui/Button";
// import { cn } from "@/lib/utils/helpers";
// import type { ProjectDetail } from "@/lib/types/project-detail";

// export interface ProjectFactsCardProps {
// 	project: ProjectDetail;
// 	className?: string;
// }

// export function ProjectFactsCard({
// 	project,
// 	className,
// }: ProjectFactsCardProps) {
// 	return (
// 		<div
// 			className={cn(
// 				"rounded-3xl border border-stone-200 bg-white p-6",
// 				className,
// 			)}
// 		>
// 			<h2 className="text-lg font-bold text-ink-950">Project Facts</h2>
// 			<dl className="mt-4 space-y-4">
// 				{project.facts.map((fact) => (
// 					<div
// 						key={fact.label}
// 						className="border-b border-stone-100 pb-3 last:border-none last:pb-0"
// 					>
// 						<dt className="text-xs font-medium uppercase tracking-wide text-stone-500">
// 							{fact.label}
// 						</dt>
// 						<dd className="mt-1 text-sm font-semibold text-ink-950">
// 							{fact.value}
// 						</dd>
// 					</div>
// 				))}
// 			</dl>
// 			<ButtonLink
// 				href={project.secondaryCta.href}
// 				variant="accent"
// 				size="md"
// 				className="mt-6 w-full"
// 			>
// 				Register Interest
// 			</ButtonLink>
// 		</div>
// 	);
// }

import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils/helpers";
import type { ProjectDetail } from "@/lib/types/project-detail";

export interface ProjectFactsCardProps {
	project: ProjectDetail;
	className?: string;
}

export function ProjectFactsCard({
	project,
	className,
}: ProjectFactsCardProps) {
	return (
		<div
			className={cn(
				"rounded-3xl border border-stone-200 bg-white p-6",
				className,
			)}
		>
			<h2 className="text-lg font-bold text-ink-950">Project Facts</h2>
			<dl className="mt-4 space-y-4">
				{project.facts.map((fact) => (
					<div
						key={fact.label}
						className="border-b border-stone-100 pb-3 last:border-none last:pb-0"
					>
						<dt className="text-xs font-medium uppercase tracking-wide text-stone-500">
							{fact.label}
						</dt>
						<dd className="mt-1 text-sm font-semibold text-ink-950">
							{fact.value}
						</dd>
					</div>
				))}
			</dl>
			<ButtonLink
				href={project.secondaryCta.href}
				variant="accent"
				size="md"
				className="mt-6 w-full"
			>
				Register Interest
			</ButtonLink>
		</div>
	);
}