import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
	routeMapButtons,
	routeMapPrimaryRoutes,
} from "@/lib/data/admin/route-map";

export default function AdminRouteMapPage() {
	return (
		<div className="space-y-6">
			<AdminPageHeader
				title="Route Map & Button Handoff"
				description="Developer handoff showing every primary route and major button behaviour."
			/>

			<div className="rounded-2xl border border-stone-200 bg-white p-6">
				<h2 className="text-base font-bold text-ink-950">Primary Routes</h2>
				<div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
					{routeMapPrimaryRoutes.map((route) => (
						<div
							key={route.path}
							className="rounded-xl border border-stone-200 p-4"
						>
							<p className="text-sm font-bold text-ink-950">{route.label}</p>
							<p className="mt-1 font-mono text-xs text-stone-500">
								{route.path}
							</p>
						</div>
					))}
				</div>
			</div>

			<div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
				<table className="w-full min-w-160 text-left text-sm">
					<thead>
						<tr className="border-b border-stone-200 text-xs font-semibold uppercase tracking-wide text-stone-500">
							<th className="px-6 py-4">Button</th>
							<th className="px-6 py-4">Location</th>
							<th className="px-6 py-4">Destination</th>
							<th className="px-6 py-4">System Note</th>
						</tr>
					</thead>
					<tbody>
						{routeMapButtons.map((row) => (
							<tr
								key={row.button}
								className="border-b border-stone-100 last:border-none"
							>
								<td className="px-6 py-4 font-medium text-ink-950">
									{row.button}
								</td>
								<td className="px-6 py-4 text-stone-600">{row.location}</td>
								<td className="px-6 py-4 font-mono text-xs text-stone-600">
									{row.destination}
								</td>
								<td className="px-6 py-4 text-stone-600">{row.systemNote}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
