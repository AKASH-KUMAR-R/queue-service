import { useNavigate } from "react-router-dom";

import { ExternalLink } from "lucide-react";

import { Button } from "@shared/ui/button";
import { TableCell, TableRow } from "@shared/ui/table";

import { StatusBadge } from "@entities/StatusBadge";
import type { QueueWithMetrics } from "@entities/queue/types/types";

import { PauseQueueButton } from "./PauseQueueButton";
import { ResumeQueueButton } from "./ResumeQueueButton";

type QueueTableRowProps = {
	queue: QueueWithMetrics;
};

export function QueueTableRow({ queue }: QueueTableRowProps) {
	const navigate = useNavigate();
	const queueMetricsQuery = new URLSearchParams({
		projectId: queue.projectId,
		queueId: queue.id,
	}).toString();

	return (
		<TableRow>
			<TableCell>
				<div>
					<div className="text-sm font-medium  mb-1">
						{queue.label}
					</div>
					<div className="text-xs font-mono ">{queue.id}</div>
				</div>
			</TableCell>
			<TableCell>
				<StatusBadge status={queue.status} type="queue" />
			</TableCell>
			<TableCell>
				<span className="text-sm">
					{queue.queueMetrics?.activeJobs ?? 0}
				</span>
			</TableCell>
			<TableCell>
				<span className="text-sm text-blue-600">
					{queue.queueMetrics?.completedJobs ?? 0}
				</span>
			</TableCell>
			<TableCell>
				<div className="flex items-center gap-2">
					<span className="text-sm text-red-600">
						{queue.queueMetrics?.failedJobs ?? 0}
					</span>
				</div>
			</TableCell>
			<TableCell>
				<span className="text-xs font-mono ">
					{queue.rateLimitCount
						? `${queue.rateLimitCount} per ${queue.rateLimitWindowMs} ms`
						: "No limit"}
				</span>
			</TableCell>
			{/* <TableCell >
				<span className="text-xs text-neutral-600">
					{queue.lastProcessed}
				</span>
			</TableCell> */}
			<TableCell>
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
					<Button
						onClick={() =>
							navigate(`/metrics?${queueMetricsQuery}`)
						}
					>
						Metrics
					</Button>
				</div>
			</TableCell>
		</TableRow>
	);
}
