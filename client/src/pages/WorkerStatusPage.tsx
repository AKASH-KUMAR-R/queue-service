import { useParams, useSearchParams } from "react-router-dom";

import { EmptyState } from "@shared/ui/EmptyState";
import { LoadingState } from "@shared/ui/LoadingState";

import JobTableDialog from "@features/jobs/components/dialogs/JobTableDialog";
import ViewJobDialog from "@features/jobs/components/dialogs/ViewJobDialoag";
import { WorkersTable } from "@features/queues/components/worker/WorkerTable";
import { useWorkerDoneJobList } from "@features/queues/data/workerDoneJobList";
import { useWorkerList } from "@features/queues/data/workerList";

export const WorkerStatusPage: React.FC = () => {
	const { queueId } = useParams();
	const [searchQuery, setSearchQuery] = useSearchParams();

	const { data, isLoading } = useWorkerList({ queueId: queueId });
	const { data: workerDoneJobs, isLoading: isWorkerDoneJobsLoading } =
		useWorkerDoneJobList({}, searchQuery.get("workerId"));

	const handleViewWorkerDoneJobs = (workerId: string) => {
		setSearchQuery((prev) => {
			prev.set("workerId", workerId);
			return prev;
		});
	};

	const handleViewJob = (jobId: string) => {
		setSearchQuery((prev) => {
			prev.set("jobId", jobId);
			return prev;
		});
	};

	const handleCloseJob = () => {
		setSearchQuery((prev) => {
			prev.delete("jobId");
			return prev;
		});
	};

	const handleCloseWorkerJobs = () => {
		setSearchQuery((prev) => {
			prev.delete("workerId");
			return prev;
		});
	};

	if (!queueId) {
		return (
			<div className="p-8">
				<div className="mb-6">
					<h1 className="text-2xl font-semibold text-foreground">
						Worker Status
					</h1>
					<p className="text-sm text-muted-foreground mt-1">
						View and manage worker status
					</p>
				</div>
				<EmptyState
					title="No queue selected"
					description="Select a queue from the Queues view to see its workers"
				/>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="p-8">
				<div className="mb-6">
					<h1 className="text-2xl font-semibold text-foreground">
						Worker Status
					</h1>
				</div>
				<LoadingState />
			</div>
		);
	}

	return (
		<div>
			<div>
				<h1 className="text-2xl font-semibold text-foreground">
					Worker Status
				</h1>
				<p className="text-sm text-muted-foreground mt-1">
					View and manage worker status
				</p>
			</div>
			<WorkersTable
				data={data?.data.results || []}
				handleViewJobs={handleViewWorkerDoneJobs}
			/>

			<JobTableDialog
				isOpen={searchQuery.has("workerId")}
				onClose={handleCloseWorkerJobs}
				data={workerDoneJobs?.data.results || []}
				onViewJob={handleViewJob}
				isLoading={isWorkerDoneJobsLoading}
			/>

			<ViewJobDialog
				isOpen={searchQuery.has("jobId")}
				jobId={searchQuery.get("jobId")}
				onClose={handleCloseJob}
			/>
		</div>
	);
};
