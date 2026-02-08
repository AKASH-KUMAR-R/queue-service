import { useNavigate, useParams } from "react-router-dom";

import { EmptyState } from "@shared/ui/EmptyState";
import { LoadingState } from "@shared/ui/LoadingState";

import { WorkersTable } from "@features/queues/components/worker/WorkerTable";
import { useWorkerList } from "@features/queues/data/workerList";

export const WorkerStatusPage: React.FC = () => {
	const { queueId } = useParams();
	const navigate = useNavigate();

	const { data, isLoading } = useWorkerList({ queueId: queueId });

	const handleViewWorkerDoneJobs = (workerId: string) => {
		navigate(workerId);
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
		</div>
	);
};
