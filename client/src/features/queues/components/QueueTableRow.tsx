import { useNavigate } from "react-router-dom";

import { ExternalLink } from "lucide-react";

import { Button } from "@shared/ui/button";

import { StatusBadge } from "@entities/StatusBadge";
import type { QueueWithMetrics } from "@entities/queue/types/types";

import { PauseQueueButton } from "./PauseQueueButton";
import { ResumeQueueButton } from "./ResumeQueueButton";

type QueueTableRowProps = {
	queue: QueueWithMetrics;
};

export function QueueTableRow({ queue }: QueueTableRowProps) {
	const navigate = useNavigate();

	return (
		<tr className="hover:bg-neutral-50">
			<td className="px-4 py-3">
				<div>
					<div className="text-sm font-medium text-neutral-900 mb-1">
						{queue.label}
					</div>
					<div className="text-xs font-mono text-neutral-500">
						{queue.id}
					</div>
				</div>
			</td>
			<td className="px-4 py-3">
				<StatusBadge status={queue.status} type="queue" />
			</td>
			<td className="px-4 py-3">
				<span className="text-sm text-neutral-700">
					{queue.queueMetrics?.activeJobs ?? 0}
				</span>
			</td>
			<td className="px-4 py-3">
				<span className="text-sm text-blue-600">
					{queue.queueMetrics?.completedJobs ?? 0}
				</span>
			</td>
			<td className="px-4 py-3">
				<div className="flex items-center gap-2">
					<span className="text-sm text-red-600">
						{queue.queueMetrics?.failedJobs ?? 0}
					</span>
				</div>
			</td>
			<td className="px-4 py-3">
				<span className="text-xs font-mono text-neutral-700">
					{queue.rateLimitCount
						? `${queue.rateLimitCount} per ${queue.rateLimitWindowMs} ms`
						: "No limit"}
				</span>
			</td>
			{/* <td className="px-4 py-3">
				<span className="text-xs text-neutral-600">
					{queue.lastProcessed}
				</span>
			</td> */}
			<td className="px-4 py-3">
				<div className="flex items-center gap-2">
					{queue.status === "ACTIVE" ? (
						<PauseQueueButton queue={queue} compact />
					) : (
						<ResumeQueueButton queue={queue} compact />
					)}
					<Button
						onClick={() => navigate(`/queues/${queue.id}/jobs`)}
						title="View jobs"
					>
						<ExternalLink className="w-4 h-4" />
					</Button>
				</div>
			</td>
		</tr>
	);
}
