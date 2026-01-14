import { useState } from "react";

import { JobRow } from "../entities/job/JobRow";
import type { Job } from "../entities/job/types";
import { EmptyState } from "../shared/ui/EmptyState";

interface JobsTableProps {
	queueId: string;
}

export function JobsTable({ queueId }: JobsTableProps) {
	const [expandedJob, setExpandedJob] = useState<string | null>(null);

	const jobs: Job[] = [
		{
			id: "job_x9k2m4a3",
			status: "in-progress",
			attempts: 1,
			maxAttempts: 3,
			priority: 10,
			scheduledAt: "2026-01-03T14:32:15Z",
			startedAt: "2026-01-03T14:32:18Z",
			completedAt: null,
			payload: {
				userId: "usr_123",
				emailType: "welcome",
				template: "v2",
			},
		},
		{
			id: "job_b4n7p1k9",
			status: "completed",
			attempts: 1,
			maxAttempts: 3,
			priority: 5,
			scheduledAt: "2026-01-03T14:30:02Z",
			startedAt: "2026-01-03T14:30:05Z",
			completedAt: "2026-01-03T14:30:12Z",
			payload: { userId: "usr_456", emailType: "notification" },
		},
		{
			id: "job_c8v3j2m1",
			status: "failed",
			attempts: 3,
			maxAttempts: 3,
			priority: 8,
			scheduledAt: "2026-01-03T14:28:45Z",
			startedAt: "2026-01-03T14:28:48Z",
			completedAt: null,
			payload: { userId: "usr_789", emailType: "reminder" },
			error: "SMTP connection timeout after 30s",
		},
		{
			id: "job_d2k8n5p7",
			status: "pending",
			attempts: 0,
			maxAttempts: 3,
			priority: 3,
			scheduledAt: "2026-01-03T14:35:00Z",
			startedAt: null,
			completedAt: null,
			payload: {
				userId: "usr_101",
				emailType: "digest",
				frequency: "daily",
			},
		},
		{
			id: "job_e5m1k9n3",
			status: "scheduled",
			attempts: 0,
			maxAttempts: 3,
			priority: 7,
			scheduledAt: "2026-01-03T16:00:00Z",
			startedAt: null,
			completedAt: null,
			payload: { userId: "usr_202", emailType: "scheduled-report" },
		},
	];

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
