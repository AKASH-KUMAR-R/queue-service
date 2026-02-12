import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { JobsTable } from "@widgets/JobsTable";

import { EmptyState } from "@shared/ui/EmptyState";
import { LoadingState } from "@shared/ui/LoadingState";

import type { JobSearchParams } from "@entities/job/types/types";

import { JobViewControls } from "@features/jobs/components/JobViewControls";
import ViewJobDialog from "@features/jobs/components/dialogs/ViewJobDialoag";
import { useJobsList } from "@features/jobs/data/listJobs";

type JobPageParams = {
	queueId: string;
};

export function JobsPage() {
	const { queueId } = useParams<JobPageParams>();
	const [searchQuery, setSearchQuery] = useSearchParams();

	const [filters, setFilters] = useState<JobSearchParams>({
		status: "ALL",
		page: 1,
		limit: 10,
	});
	const { data: jobs, isLoading: isJobListLoading } = useJobsList(
		queueId ?? "",
		filters,
	);

	const handlePageChange = (newPage: number) => {
		setFilters((prev) => ({ ...prev, page: newPage }));
	};

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

	const handleJobViewClick = (jobId: string) => {
		setSearchQuery((prev) => {
			prev.set("jobId", jobId);
			return prev;
		});
	};

	return (
		<div className="p-8 overflow-y-auto ">
			<div className="mb-6">
				<h1 className="text-2xl font-semibold text-foreground">Jobs</h1>
				<p className="text-sm text-muted-foreground mt-1">
					Queue: <span className="font-mono">{queueId}</span>
				</p>
			</div>
			<JobViewControls
				searchQuery={filters}
				onSearchChange={(field, value) => {
					setFilters((prev) => ({ ...prev, [field]: value }));
				}}
			/>
			<JobsTable
				jobs={jobList}
				onViewClick={handleJobViewClick}
				page={filters.page || 1}
				totalPages={jobs?.data.totalPages || 1}
				onPageChange={handlePageChange}
			/>

			<ViewJobDialog
				jobId={searchQuery.get("jobId")}
				isOpen={!!searchQuery.get("jobId")}
				onClose={() => {
					setSearchQuery((prev) => {
						prev.delete("jobId");
						return prev;
					});
				}}
			/>
		</div>
	);
}
