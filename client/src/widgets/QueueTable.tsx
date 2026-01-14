import type { Queue } from "../entities/queue/types/types";
import { QueueTableRow } from "../features/queues/components/QueueTableRow";

interface QueueTableProps {
	queues: Queue[];
}

export function QueueTable({ queues }: QueueTableProps) {
	return (
		<div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-neutral-50 border-b border-neutral-200 sticky top-0">
						<tr>
							<th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
								Queue Name
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
								Status
							</th>
							{/* <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
								Pending
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
								In Progress
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
								Failed
							</th> */}
							<th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
								Rate Limit Per Unit
							</th>
							{/* <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
								Last Processed
							</th> */}
							<th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-neutral-200">
						{queues.map((queue) => (
							<QueueTableRow key={queue.id} queue={queue} />
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
