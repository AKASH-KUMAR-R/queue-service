import { WorkerStatsCards } from "@widgets/WorkerStatsCards";
import { WorkerTable } from "@widgets/WorkerTable";

export function WorkersPage() {
	return (
		<div className="p-8">
			<div className="mb-6">
				<h1 className="text-2xl font-semibold text-foreground">
					Workers
				</h1>
				<p className="text-sm text-muted-foreground mt-1">
					Monitor worker health and activity
				</p>
			</div>

			<WorkerStatsCards />
			<WorkerTable />
		</div>
	);
}
