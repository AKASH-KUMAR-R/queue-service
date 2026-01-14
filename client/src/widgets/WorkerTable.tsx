import { WorkerRow } from "../entities/worker/WorkerRow";
import type { Worker } from "../entities/worker/types";

export function WorkerTable() {
	const workers: Worker[] = [
		{
			id: "worker_m9k2n4p1",
			status: "online",
			activeJobs: 3,
			lastHeartbeat: "2 seconds ago",
			queues: ["email-notifications", "webhook-delivery"],
			uptimeHours: 47.2,
			processedTotal: 8934,
		},
		{
			id: "worker_x3v7j8n2",
			status: "online",
			activeJobs: 5,
			lastHeartbeat: "1 second ago",
			queues: ["image-processing"],
			uptimeHours: 23.8,
			processedTotal: 2341,
		},
		{
			id: "worker_a5k9m2p4",
			status: "online",
			activeJobs: 1,
			lastHeartbeat: "3 seconds ago",
			queues: ["email-notifications", "data-export"],
			uptimeHours: 72.1,
			processedTotal: 15672,
		},
		{
			id: "worker_c8n1v6k3",
			status: "offline",
			activeJobs: 0,
			lastHeartbeat: "2 hours ago",
			queues: ["webhook-delivery"],
			uptimeHours: 0,
			processedTotal: 4523,
		},
	];

	return (
		<div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
			<table className="w-full">
				<thead className="bg-neutral-50 border-b border-neutral-200 sticky top-0">
					<tr>
						<th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
							Worker ID
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
							Status
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
							Active Jobs
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
							Last Heartbeat
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
							Queues
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
							Uptime
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
							Processed
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
							Actions
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-neutral-200">
					{workers.map((worker) => (
						<WorkerRow key={worker.id} worker={worker} />
					))}
				</tbody>
			</table>
		</div>
	);
}
