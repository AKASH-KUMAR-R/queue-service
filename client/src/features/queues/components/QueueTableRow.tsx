import { useContextNavigate } from "@app/hooks/useContextNavigate";
import { ExternalLink, SquarePen } from "lucide-react";

import { Button } from "@shared/ui/button";
import { TableCell, TableRow } from "@shared/ui/table";
import { formatDurationMilliseconds } from "@shared/utils/dateAndTimeUtils";

import { StatusBadge } from "@entities/StatusBadge";
import type { QueueWithMetrics } from "@entities/queue/types/types";

import { PauseQueueButton } from "./PauseQueueButton";
import { ResumeQueueButton } from "./ResumeQueueButton";

type QueueTableRowProps = {
	queue: QueueWithMetrics;
	onEdit: (queue: QueueWithMetrics) => void;
};

export function QueueTableRow({ queue, onEdit }: QueueTableRowProps) {
	const navigate = useContextNavigate();

	const handleQueueMetrics = () => {
		navigate(`/metrics`, {
			params: {
				queueId: queue.id,
			},
		});
	};

	return (
		<TableRow>
			<TableCell>
				<div>
					<div className="text-sm font-medium  mb-1">
						{queue.label}
					</div>
					<div className="text-xs font-mono ">{queue.id}</div>
					<div className="text-xs font-mono pt-1">
						{queue.description}
					</div>
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
					{queue.rateLimitCount && queue.rateLimitWindowMs
						? `${queue.rateLimitCount} per ${formatDurationMilliseconds(queue.rateLimitWindowMs)}`
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
					<Button onClick={() => onEdit(queue)} title="Edit queue">
						<SquarePen className="w-4 h-4" />
					</Button>
					<Button onClick={handleQueueMetrics}>Metrics</Button>
				</div>
			</TableCell>
		</TableRow>
	);
}
