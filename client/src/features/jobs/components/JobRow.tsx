import { ChevronDown, ChevronRight, Copy, ExternalLink } from "lucide-react";

import { Button } from "@shared/ui/button";
import { copyToClipboard } from "@shared/utils/clipboard";
import { formatDateTime } from "@shared/utils/dateAndTimeUtils";

import { StatusBadge } from "@entities/StatusBadge";
import type { Job } from "@entities/job/types/types";

import { CancelJobButton } from "./CancelJobButton";
import { RetryJobButton } from "./RetryJobButton";

interface JobRowProps {
	job: Job;
	isExpanded: boolean;
	onViewClick?: (jobId: string) => void;
	onToggleExpand: () => void;
}

export function JobRow({
	job,
	isExpanded,
	onToggleExpand,
	onViewClick,
}: JobRowProps) {
	const handleCopy = async (text: string) => {
		const success = await copyToClipboard(text);
		if (!success) {
			// Optionally show a toast or error message
			console.error("Failed to copy to clipboard");
		}
	};

	const handleViewClick = () => {
		if (onViewClick) {
			onViewClick(job.id);
		}
	};

	return (
		<>
			<tr className="hover:bg-neutral-50">
				<td className="px-4 py-3">
					<button
						onClick={onToggleExpand}
						className="text-neutral-400 hover:text-neutral-600"
					>
						{isExpanded ? (
							<ChevronDown className="w-4 h-4" />
						) : (
							<ChevronRight className="w-4 h-4" />
						)}
					</button>
				</td>
				<td className="px-4 py-3">
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm text-neutral-900">
							{job.id}
						</span>
						<button
							onClick={() => handleCopy(job.id)}
							className="text-neutral-400 hover:text-neutral-600"
						>
							<Copy className="w-3 h-3" />
						</button>
					</div>
				</td>
				<td className="px-4 py-3">
					<StatusBadge status={job.status} type="job" />
				</td>
				<td className="px-4 py-3">
					<span className="text-sm text-neutral-700">
						{job.attempts} / 5
					</span>
				</td>
				<td className="px-4 py-3">
					<span className="text-sm text-neutral-700">
						{job.priority}
					</span>
				</td>
				<td className="px-4 py-3">
					<span className="text-xs text-neutral-600">
						{job.scheduledAt
							? formatDateTime(job.scheduledAt)
							: "—"}
					</span>
				</td>
				<td className="px-4 py-3">
					<span className="text-xs text-neutral-600">
						{job.startedAt ? formatDateTime(job.startedAt) : "—"}
					</span>
				</td>
				<td className="px-4 py-3">
					<div className="flex items-center gap-2">
						{job.status === "FAILED" && (
							<RetryJobButton jobId={job.id} />
						)}
						{(job.status === "PENDING" ||
							job.status === "IN_PROGRESS") && (
							<CancelJobButton jobId={job.id} />
						)}
						<Button
							type="button"
							className="text-neutral-400 hover:text-neutral-600"
							title="View details"
							onClick={handleViewClick}
						>
							<ExternalLink className="w-3 h-3" />
						</Button>
					</div>
				</td>
			</tr>
			{isExpanded && (
				<tr>
					<td colSpan={8} className="px-4 py-4 bg-neutral-50">
						<div className="space-y-3">
							<div>
								<div className="text-xs font-medium text-neutral-600 mb-2">
									Payload
								</div>
								<pre className="font-mono text-xs text-neutral-800 bg-white border border-neutral-200 rounded p-3 overflow-x-auto">
									{JSON.stringify(job.payload, null, 2)}
								</pre>
							</div>
						</div>
					</td>
				</tr>
			)}
		</>
	);
}
