import { useParams, useSearchParams } from "react-router-dom";

import { JobsTable } from "@widgets/JobsTable";

import { EmptyState } from "@shared/ui/EmptyState";
import { LoadingState } from "@shared/ui/LoadingState";

import ViewJobDialog from "@features/jobs/components/dialogs/ViewJobDialoag";
import { useWorkerDoneJobList } from "@features/queues/data/workerDoneJobList";

const ViewWorkerJobs = () => {
	const { workerId } = useParams();
	const [searchQuery, setSearchQuery] = useSearchParams();

	const { data: workerDoneJobs, isLoading: isWorkerDoneJobsLoading } =
		useWorkerDoneJobList({}, workerId || null);

	const handleViewJobClick = (jobId: string) => {
		setSearchQuery((prev) => {
			const newParams = new URLSearchParams(prev);
			newParams.set("jobId", jobId);
			return newParams;
		});
	};

	const handleCloseJob = () => {
		setSearchQuery((prev) => {
			const newParams = new URLSearchParams(prev);
			newParams.delete("jobId");
			return newParams;
		});
	};

	return (
		<div>
			<div>View Worker Jobs</div>

			{isWorkerDoneJobsLoading ? (
				<LoadingState />
			) : workerDoneJobs?.data.results.length === 0 ? (
				<EmptyState
					title="No jobs found"
					description="This worker has not completed any jobs yet."
				/>
			) : (
				<JobsTable
					jobs={workerDoneJobs?.data.results || []}
					onViewClick={handleViewJobClick}
				/>
			)}

			<ViewJobDialog
				isOpen={searchQuery.has("jobId")}
				jobId={searchQuery.get("jobId")}
				onClose={handleCloseJob}
			/>
		</div>
	);
};

export default ViewWorkerJobs;
