import { MoreVertical, RefreshCw } from "lucide-react";

import { Button } from "@shared/ui/button";
import { formatDurationMilliseconds } from "@shared/utils/dateAndTimeUtils";

import { StatusBadge } from "@entities/StatusBadge";
import type { QueueWithMetrics } from "@entities/queue/types/types";

import { PauseQueueButton } from "./PauseQueueButton";
import { ResumeQueueButton } from "./ResumeQueueButton";

type QueueCardProps = {
	queue: QueueWithMetrics;
	onSelectQueue: (queueId: string) => void;
	onViewWorkers: (queueId: string) => void;
	onViewMetrics: (queueId: string, projectId: string) => void;
};

export function QueueCard({
	queue,
	onSelectQueue,
	onViewWorkers,
	onViewMetrics,
}: QueueCardProps) {
	return (
		<div className="col-span-6  rounded-lg p-6  transition-colors border border-foreground">
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1">
					<div className="flex items-center gap-3 mb-2">
						<h3 className="text-base font-medium ">
							{queue.label}
						</h3>
						<StatusBadge status={queue.status} type="queue" />
					</div>
					<p className="text-xs font-mono ">{queue.id}</p>
				</div>
				<Button type="button" size="sm" variant="ghost">
					<MoreVertical className="w-5 h-5" />
				</Button>
			</div>

			<div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b ">
				{queue.queueMetrics ? (
					<>
						<div>
							<div className="text-xs  mb-1">Active</div>
							<div className="text-xl font-semibold text-blue-700">
								{queue.queueMetrics.activeJobs}
							</div>
						</div>
						<div>
							<div className="text-xs  mb-1">Completed</div>
							<div className="text-xl font-semibold ">
								{queue.queueMetrics.completedJobs}
							</div>
						</div>
						<div>
							<div className="text-xs  mb-1">Failed</div>
							<div className="text-xl font-semibold text-red-600">
								{queue.queueMetrics.failedJobs}
							</div>
						</div>
					</>
				) : (
					<div>No metrics available</div>
				)}
			</div>

			<div className="flex items-center justify-between text-xs  mb-4">
				<div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
					<div className="flex justify-between">
						<span className=" mr-1">Rate Limit:</span>
						{!queue.rateLimitCount || !queue.rateLimitWindowMs ? (
							<span>Unlimited</span>
						) : (
							<>
								<span>{queue.rateLimitCount}</span>
								<span className=" mx-1">per</span>
								<span>
									{formatDurationMilliseconds(
										queue.rateLimitWindowMs,
									)}
								</span>
							</>
						)}
					</div>
				</div>
				{/* <div>Last: {queue.lastProcessed}</div> */}
			</div>

			{/* {queue.failed > 0 && (
				<div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 px-3 py-2 rounded mb-4">
					<AlertCircle className="w-4 h-4" />
					<span>
						{queue.failed} job{queue.failed > 1 ? "s" : ""} in
						dead-letter queue
					</span>
				</div>
			)} */}

			<div className="flex items-center gap-2">
				{queue.status === "ACTIVE" ? (
					<PauseQueueButton queue={queue} />
				) : (
					<ResumeQueueButton queue={queue} />
				)}
				<Button
					onClick={() => onSelectQueue(queue.id)}
					className="flex-1 px-3 py-2 text-sm "
				>
					View Jobs
				</Button>
				<Button
					onClick={() => onViewWorkers(queue.id)}
					className="flex-1 px-3 py-2 text-sm "
				>
					View Workers
				</Button>
				<Button
					onClick={() => onViewMetrics(queue.id, queue.projectId)}
					className="flex-1 px-3 py-2 text-sm "
				>
					Metrics
				</Button>
				<Button className="">
					<RefreshCw className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
}
