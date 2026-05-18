import { useParams, useSearchParams } from "react-router-dom";

import { useContextNavigate } from "@app/hooks/useContextNavigate";

import { EmptyState } from "@shared/ui/EmptyState";
import { LoadingState } from "@shared/ui/LoadingState";

import { WorkersTable } from "@features/queues/components/worker/WorkerTable";
import { useWorkerList } from "@features/queues/data/workerList";

export const WorkerStatusPage: React.FC = () => {
	const { queueId } = useParams();
	const navigate = useContextNavigate();

	const [searchQuery, setSearchQuery] = useSearchParams();

	const { data, isLoading } = useWorkerList({
		queueId: queueId,
		page: Number(searchQuery.get("page")) || 1,
	});

	const handleViewWorkerDoneJobs = (workerId: string) => {
		navigate(workerId);
	};

	const handlePageChange = (newPage: number) => {
		setSearchQuery((prev) => {
			const newParams = new URLSearchParams(prev);
			newParams.set("page", newPage.toString());
			return newParams;
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
				page={Number(searchQuery.get("page")) || 1}
				totalPages={data?.data.totalPages || 1}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};
