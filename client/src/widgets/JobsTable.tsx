import { useState } from "react";

import type { Job } from "../entities/job/types/types";
import { JobRow } from "../features/jobs/components/JobRow";
import { EmptyState } from "../shared/ui/EmptyState";

type JobsTableProps = {
	jobs: Job[];
};

export function JobsTable({ jobs }: JobsTableProps) {
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
		<div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-neutral-50 border-b border-neutral-200 sticky top-0">
						<tr>
							<th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider w-8"></th>
							<th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
								Job ID
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
								Status
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
								Attempts
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
								Priority
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
								Scheduled
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
								Started
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-neutral-200">
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
							/>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
