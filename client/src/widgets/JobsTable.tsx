import { useState } from "react";

import type { PaginatedComponentProps } from "@shared/types/types";
import { Paginated } from "@shared/ui/pagination/Paginated";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@shared/ui/table";

import type { Job } from "../entities/job/types/types";
import { JobRow } from "../features/jobs/components/JobRow";
import { EmptyState } from "../shared/ui/EmptyState";

type JobsTableProps = PaginatedComponentProps & {
	jobs: Job[];
	onViewClick?: (jobId: string) => void;
};

export function JobsTable({
	jobs,
	onViewClick,
	page,
	totalPages,
	onPageChange,
}: JobsTableProps) {
	const [expandedJob, setExpandedJob] = useState<string | null>(null);

	if (jobs.length === 0) {
		return (
			<EmptyState
				title="No jobs found"
				description="This queue has no jobs yet. Jobs will appear here once they are added to the queue."
			/>
		);
	}

	return (
		<div className=" w-full">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Job ID</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Attempts</TableHead>
						<TableHead>Priority</TableHead>
						<TableHead>Scheduled</TableHead>
						<TableHead>Started</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{jobs.map((job) => (
						<JobRow
							key={job.id}
							job={job}
							isExpanded={expandedJob === job.id}
							onToggleExpand={() =>
								setExpandedJob(
									expandedJob === job.id ? null : job.id,
								)
							}
							onViewClick={onViewClick}
						/>
					))}
				</TableBody>
			</Table>

			<Paginated
				page={page}
				totalPages={totalPages}
				onPageChange={onPageChange}
			/>
		</div>
	);
}

{
}
