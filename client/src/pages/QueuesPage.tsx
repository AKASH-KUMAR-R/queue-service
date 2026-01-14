import { useMemo, useState } from "react";

import { QueueGrid } from "@widgets/QueueGrid";
import { QueueTable } from "@widgets/QueueTable";
import {
	QueueViewControls,
	type QueueViewMode,
} from "@widgets/QueueViewControls";

import { EmptyState } from "@shared/ui/EmptyState";

import type { Queue } from "@entities/queue/types";

import { CreateQueueButton } from "@features/queues/components/CreateQueueButton";
import {
	CreateQueueDialog,
	type CreateQueueFormData,
} from "@features/queues/components/CreateQueueDialog";

export function QueuesPage() {
	const [viewMode, setViewMode] = useState<QueueViewMode>("card");
	const [searchQuery, setSearchQuery] = useState("");
	const [showCreateDialog, setShowCreateDialog] = useState(false);

	// Mock data - in real app, this would come from API
	const allQueues: Queue[] = [
		{
			id: "queue_a8f3k2",
			name: "email-notifications",
			status: "active",
			pending: 1247,
			inProgress: 8,
			failed: 3,
			rateLimit: "100/min",
			lastProcessed: "2 seconds ago",
		},
		{
			id: "queue_b9j2m1",
			name: "image-processing",
			status: "active",
			pending: 523,
			inProgress: 12,
			failed: 0,
			rateLimit: "50/min",
			lastProcessed: "5 seconds ago",
		},
		{
			id: "queue_c7n4p8",
			name: "data-export",
			status: "paused",
			pending: 89,
			inProgress: 0,
			failed: 2,
			rateLimit: "10/min",
			lastProcessed: "3 hours ago",
		},
		{
			id: "queue_d1k8v5",
			name: "webhook-delivery",
			status: "active",
			pending: 0,
			inProgress: 2,
			failed: 15,
			rateLimit: "200/min",
			lastProcessed: "1 minute ago",
		},
	];

	// Filter queues based on search query
	const filteredQueues = useMemo(() => {
		if (!searchQuery.trim()) {
			return allQueues;
		}

		const query = searchQuery.toLowerCase();
		return allQueues.filter(
			(queue) =>
				queue.name.toLowerCase().includes(query) ||
				queue.id.toLowerCase().includes(query),
		);
	}, [searchQuery]);

	const handleCreateQueue = (formData: CreateQueueFormData) => {
		console.log("Creating queue:", formData);
		// In real app, this would call an API
		// Then refresh the queues list
	};

	return (
		<div className="p-8">
			<div className="mb-6 flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-foreground">
						Queues
					</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Manage and monitor job queues
					</p>
				</div>
				<CreateQueueButton onClick={() => setShowCreateDialog(true)} />
			</div>

			<QueueViewControls
				viewMode={viewMode}
				onViewModeChange={setViewMode}
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
			/>

			{filteredQueues.length === 0 ? (
				<EmptyState
					title="No queues found"
					description={
						searchQuery
							? `No queues match "${searchQuery}". Try a different search term.`
							: "No queues available. Create a queue to get started."
					}
					actionLabel={!searchQuery ? "Create Queue" : undefined}
					onAction={
						!searchQuery
							? () => setShowCreateDialog(true)
							: undefined
					}
				/>
			) : viewMode === "card" ? (
				<QueueGrid queues={filteredQueues} />
			) : (
				<QueueTable queues={filteredQueues} />
			)}

			{showCreateDialog && (
				<CreateQueueDialog
					open={showCreateDialog}
					onClose={() => setShowCreateDialog(false)}
					onSubmit={handleCreateQueue}
				/>
			)}
		</div>
	);
}
