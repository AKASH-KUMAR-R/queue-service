import { useNavigate } from "react-router-dom";

import type { Queue } from "../entities/queue/types";
import { QueueCard } from "../features/queues/components/QueueCard";

interface QueueGridProps {
	queues: Queue[];
}

export function QueueGrid({ queues }: QueueGridProps) {
	const navigate = useNavigate();

	const handleSelectQueue = (queueId: string) => {
		navigate(`/jobs/${queueId}`);
	};

	return (
		<div className="grid grid-cols-12 gap-4">
			{queues.map((queue) => (
				<QueueCard
					key={queue.id}
					queue={queue}
					onSelectQueue={handleSelectQueue}
				/>
			))}
		</div>
	);
}
