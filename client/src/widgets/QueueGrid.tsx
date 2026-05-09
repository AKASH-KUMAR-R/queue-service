import { useNavigate } from "react-router-dom";

import type { PaginatedComponentProps } from "@shared/types/types";
import { Paginated } from "@shared/ui/pagination/Paginated";

import type { QueueWithMetrics } from "@entities/queue/types/types";

import { QueueCard } from "@features/queues/components/QueueCard";

type QueueGridProps = PaginatedComponentProps & {
	queues: QueueWithMetrics[];
};

export function QueueGrid({
	queues,
	page,
	totalPages,
	onPageChange,
}: QueueGridProps) {
	const navigate = useNavigate();

	const handleSelectQueue = (queueId: string) => {
		navigate(`/queues/${queueId}/jobs`);
	};
	const handleViewWorkers = (queueId: string) => {
		navigate(`/queues/${queueId}/workers`);
	};
	const handleViewMetrics = (queueId: string, projectId: string) => {
		const queryParams = new URLSearchParams({
			projectId,
			queueId,
		});

		navigate(`/metrics?${queryParams.toString()}`);
	};

	return (
		<div className=" w-full">
			<div className="grid grid-cols-12 gap-4">
				{queues.map((queue) => (
					<QueueCard
						key={queue.id}
						queue={queue}
						onSelectQueue={handleSelectQueue}
						onViewWorkers={handleViewWorkers}
						onViewMetrics={handleViewMetrics}
					/>
				))}
			</div>
			<Paginated
				page={page}
				totalPages={totalPages}
				onPageChange={onPageChange}
			/>
		</div>
	);
}
