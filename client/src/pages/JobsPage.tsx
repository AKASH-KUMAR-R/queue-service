import { useParams } from "react-router-dom";

import { JobsTable } from "@widgets/JobsTable";

import { EmptyState } from "@shared/ui/EmptyState";
import { LoadingState } from "@shared/ui/LoadingState";

import { useJobsList } from "@features/jobs/data/listJobs";

type JobPageParams = {
	queueId: string;
};
export function JobsPage() {
	const { queueId } = useParams<JobPageParams>();

	const { data: jobs, isLoading: isJobListLoading } = useJobsList(
		queueId ?? "",
		{},
	);

	if (!queueId) {
		return (
			<div className="p-8">
				<div className="mb-6">
					<h1 className="text-2xl font-semibold text-foreground">
						Jobs
					</h1>
					<p className="text-sm text-muted-foreground mt-1">
						View and manage job execution
					</p>
				</div>
				<EmptyState
					title="No queue selected"
					description="Select a queue from the Queues view to see its jobs"
				/>
			</div>
		);
	}

	if (isJobListLoading) {
		return (
			<div className="p-8">
				<div className="mb-6">
					<h1 className="text-2xl font-semibold text-foreground">
						Jobs
					</h1>
				</div>
				<LoadingState />
			</div>
		);
	}

	const jobList = jobs?.data.results ?? [];

	return (
		<div className="p-8">
			<div className="mb-6">
				<h1 className="text-2xl font-semibold text-foreground">Jobs</h1>
				<p className="text-sm text-muted-foreground mt-1">
					Queue: <span className="font-mono">{queueId}</span>
				</p>
			</div>

			<JobsTable jobs={jobList} />
		</div>
	);
}
