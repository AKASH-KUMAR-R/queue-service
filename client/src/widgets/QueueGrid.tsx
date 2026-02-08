import { useNavigate } from "react-router-dom";

import type { QueueWithMetrics } from "@entities/queue/types/types";

import { QueueCard } from "@features/queues/components/QueueCard";

type QueueGridProps = {
	queues: QueueWithMetrics[];
};

export function QueueGrid({ queues }: QueueGridProps) {
	const navigate = useNavigate();

	const handleSelectQueue = (queueId: string) => {
		navigate(`/queues/${queueId}/jobs`);
	};
	const handleViewWorkers = (queueId: string) => {
		navigate(`/queues/${queueId}/workers`);
	};

	return (
		<div className="grid grid-cols-12 gap-4">
			{queues.map((queue) => (
				<QueueCard
					key={queue.id}
					queue={queue}
					onSelectQueue={handleSelectQueue}
					onViewWorkers={handleViewWorkers}
				/>
			))}
		</div>
	);
}
