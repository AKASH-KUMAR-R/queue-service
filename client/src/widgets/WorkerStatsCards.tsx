import { Activity } from "lucide-react";

const mockWorkers = [
	{
		id: "worker_m9k2n4p1",
		status: "online",
		activeJobs: 3,
		uptimeHours: 47.2,
		processedTotal: 8934,
	},
	{
		id: "worker_x3v7j8n2",
		status: "online",
		activeJobs: 5,
		uptimeHours: 23.8,
		processedTotal: 2341,
	},
	{
		id: "worker_a5k9m2p4",
		status: "online",
		activeJobs: 1,
		uptimeHours: 72.1,
		processedTotal: 15672,
	},
	{
		id: "worker_c8n1v6k3",
		status: "offline",
		activeJobs: 0,
		uptimeHours: 0,
		processedTotal: 4523,
	},
];

export function WorkerStatsCards() {
	const onlineWorkers = mockWorkers.filter(
		(w) => w.status === "online",
	).length;
	const totalActiveJobs = mockWorkers.reduce(
		(sum, w) => sum + w.activeJobs,
		0,
	);
	const avgUptime =
		mockWorkers.reduce((sum, w) => sum + w.uptimeHours, 0) /
		mockWorkers.length;
	const totalProcessed = mockWorkers.reduce(
		(sum, w) => sum + w.processedTotal,
		0,
	);

	return (
		<div className="grid grid-cols-12 gap-4 mb-6">
			<div className="col-span-3 bg-white border border-neutral-200 rounded-lg p-4">
				<div className="flex items-center gap-3 mb-2">
					<Activity className="w-5 h-5 text-green-600" />
					<div className="text-xs text-neutral-500">
						Online Workers
					</div>
				</div>
				<div className="text-2xl font-semibold text-neutral-900">
					{onlineWorkers} / {mockWorkers.length}
				</div>
			</div>

			<div className="col-span-3 bg-white border border-neutral-200 rounded-lg p-4">
				<div className="text-xs text-neutral-500 mb-2">Active Jobs</div>
				<div className="text-2xl font-semibold text-blue-600">
					{totalActiveJobs}
				</div>
			</div>

			<div className="col-span-3 bg-white border border-neutral-200 rounded-lg p-4">
				<div className="text-xs text-neutral-500 mb-2">Avg Uptime</div>
				<div className="text-2xl font-semibold text-neutral-900">
					{avgUptime.toFixed(1)}h
				</div>
			</div>

			<div className="col-span-3 bg-white border border-neutral-200 rounded-lg p-4">
				<div className="text-xs text-neutral-500 mb-2">
					Total Processed
				</div>
				<div className="text-2xl font-semibold text-neutral-900">
					{totalProcessed.toLocaleString()}
				</div>
			</div>
		</div>
	);
}
