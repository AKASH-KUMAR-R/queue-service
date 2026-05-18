import { useContextNavigate } from "@app/hooks/useContextNavigate";

import type { PaginatedComponentProps } from "@shared/types/types";
import { Paginated } from "@shared/ui/pagination/Paginated";

import type { QueueWithMetrics } from "@entities/queue/types/types";

import { QueueCard } from "@features/queues/components/QueueCard";

type QueueGridProps = PaginatedComponentProps & {
	queues: QueueWithMetrics[];
	onEditQueue: (queue: QueueWithMetrics) => void;
};

export function QueueGrid({
	queues,
	page,
	totalPages,
	onPageChange,
	onEditQueue,
}: QueueGridProps) {
	const navigate = useContextNavigate();

	const handleSelectQueue = (queueId: string) => {
		navigate(`/queues/${queueId}/jobs`);
	};
	const handleViewWorkers = (queueId: string) => {
		navigate(`/queues/${queueId}/workers`);
	};
	const handleViewMetrics = (queueId: string) => {
		navigate(`/metrics`, {
			params: {
				queueId,
			},
		});
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
						onEdit={onEditQueue}
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
