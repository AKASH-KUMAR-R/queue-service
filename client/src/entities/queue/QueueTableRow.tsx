import { useNavigate } from "react-router-dom";

import { AlertCircle, ExternalLink } from "lucide-react";

import { PauseQueueButton } from "../../features/queues/PauseQueueButton";
import { ResumeQueueButton } from "../../features/queues/ResumeQueueButton";
import { StatusBadge } from "../StatusBadge";
import type { Queue } from "./types";

interface QueueTableRowProps {
	queue: Queue;
}

export function QueueTableRow({ queue }: QueueTableRowProps) {
	const navigate = useNavigate();

	return (
		<tr className="hover:bg-neutral-50">
			<td className="px-4 py-3">
				<div>
					<div className="text-sm font-medium text-neutral-900 mb-1">
						{queue.name}
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
					{queue.pending.toLocaleString()}
				</span>
			</td>
			<td className="px-4 py-3">
				<span className="text-sm text-blue-600">
					{queue.inProgress}
				</span>
			</td>
			<td className="px-4 py-3">
				<div className="flex items-center gap-2">
					<span className="text-sm text-red-600">{queue.failed}</span>
					{queue.failed > 0 && (
						<AlertCircle
							className="w-4 h-4 text-red-600"
							title="Jobs in dead-letter queue"
						/>
					)}
				</div>
			</td>
			<td className="px-4 py-3">
				<span className="text-xs font-mono text-neutral-700">
					{queue.rateLimit}
				</span>
			</td>
			<td className="px-4 py-3">
				<span className="text-xs text-neutral-600">
					{queue.lastProcessed}
				</span>
			</td>
			<td className="px-4 py-3">
				<div className="flex items-center gap-2">
					{queue.status === "active" ? (
						<PauseQueueButton queue={queue} compact />
					) : (
						<ResumeQueueButton queue={queue} compact />
					)}
					<button
						onClick={() => navigate(`/jobs/${queue.id}`)}
						className="text-neutral-400 hover:text-neutral-600"
						title="View jobs"
					>
						<ExternalLink className="w-4 h-4" />
					</button>
				</div>
			</td>
		</tr>
	);
}
