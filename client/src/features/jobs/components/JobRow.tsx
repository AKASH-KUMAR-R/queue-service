import { ChevronDown, ChevronRight, Copy, ExternalLink } from "lucide-react";

import { Button } from "@shared/ui/button";
import { TableCell, TableRow } from "@shared/ui/table";
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
			<TableRow>
				<TableCell>
					<Button
						size="sm"
						variant="ghost"
						onClick={onToggleExpand}
						className="text-neutral-400 hover:text-neutral-600"
					>
						{isExpanded ? (
							<ChevronDown className="w-4 h-4" />
						) : (
							<ChevronRight className="w-4 h-4" />
						)}
					</Button>
				</TableCell>
				<TableCell>
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm ">{job.id}</span>
						<Button
							size="sm"
							variant="ghost"
							onClick={() => handleCopy(job.id)}
						>
							<Copy className="w-3 h-3" />
						</Button>
					</div>
				</TableCell>
				<TableCell>
					<StatusBadge status={job.status} type="job" />
				</TableCell>
				<TableCell>
					<span className="text-sm ">{job.attempts} / 5</span>
				</TableCell>
				<TableCell>
					<span className="text-sm ">{job.priority}</span>
				</TableCell>
				<TableCell>
					<span className="text-xs ">
						{job.scheduledAt
							? formatDateTime(job.scheduledAt)
							: "—"}
					</span>
				</TableCell>
				<TableCell>
					<span className="text-xs ">
						{job.startedAt ? formatDateTime(job.startedAt) : "—"}
					</span>
				</TableCell>
				<TableCell>
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
							size="sm"
							variant="ghost"
							title="View details"
							onClick={handleViewClick}
						>
							<ExternalLink className="w-3 h-3" />
						</Button>
					</div>
				</TableCell>
			</TableRow>
			{isExpanded && (
				<TableRow>
					<TableCell colSpan={8}>
						<div className="space-y-3">
							<div>
								<div className="text-xs font-medium mb-2">
									Payload
								</div>
								<pre className="font-mono text-xs  rounded p-3 overflow-x-auto">
									{JSON.stringify(job.payload, null, 2)}
								</pre>
							</div>
						</div>
					</TableCell>
				</TableRow>
			)}
		</>
	);
}
