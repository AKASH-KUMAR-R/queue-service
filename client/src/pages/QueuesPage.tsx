import { useState } from "react";

import { useProject } from "@app/ProjectContext";
import { QueueGrid } from "@widgets/QueueGrid";
import { QueueTable } from "@widgets/QueueTable";
import {
	QueueViewControls,
	type QueueViewMode,
} from "@widgets/QueueViewControls";

import { EmptyState } from "@shared/ui/EmptyState";

import type { Queue, QueueSearchParams } from "@entities/queue/types/types";

import { CreateQueueButton } from "@features/queues/components/CreateQueueButton";
import { CreateQueueDialog } from "@features/queues/components/CreateQueueDialog";
import { useQueueList } from "@features/queues/data/listQueue";

const isAnyFilterActive = (filters: QueueSearchParams) => {
	return filters.label?.trim() !== "" || filters.status !== undefined;
};

export function QueuesPage() {
	const { currentProject } = useProject();
	const [viewMode, setViewMode] = useState<QueueViewMode>("card");
	const [filters, setFilters] = useState<QueueSearchParams>({
		label: "",
		projectId: currentProject?.id || "",
		status: undefined,
		page: 1,
		limit: 10,
	});

	const [showCreateDialog, setShowCreateDialog] = useState(false);

	const { data, isLoading: isQueueLoading } = useQueueList({
		...filters,
		projectId: currentProject?.id || "",
	});

	const handleCreateQueue = (newQueue: Queue) => {
		console.log("Creating queue:", newQueue);
	};

	const handlePageChange = (newPage: number) => {
		setFilters((prev) => ({ ...prev, page: newPage }));
	};

	const filteredQueues = data?.data.results || [];
	const pagination = {
		page: data?.data.page || 1,
		totalPages: data?.data.totalPages || 1,
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
				searchQuery={filters}
				onSearchChange={(field, value) =>
					setFilters((prev) => ({ ...prev, [field]: value }))
				}
			/>

			{filteredQueues.length === 0 ? (
				<EmptyState
					title={
						isQueueLoading ? "Fetching Queues" : "No queues found"
					}
					description={
						isQueueLoading
							? "Please wait while we load your queues."
							: filters.label
								? `No queues match "${filters.label}". Try a different search term.`
								: "No queues available. Create a queue to get started."
					}
					actionLabel={
						!isAnyFilterActive(filters) && !isQueueLoading
							? "Create Queue"
							: undefined
					}
					onAction={
						!isAnyFilterActive(filters)
							? () => setShowCreateDialog(true)
							: undefined
					}
				/>
			) : viewMode === "card" ? (
				<QueueGrid
					queues={filteredQueues}
					page={pagination.page}
					totalPages={pagination.totalPages}
					onPageChange={handlePageChange}
				/>
			) : (
				<QueueTable
					queues={filteredQueues}
					page={pagination.page}
					totalPages={pagination.totalPages}
					onPageChange={handlePageChange}
				/>
			)}

			{showCreateDialog && (
				<CreateQueueDialog
					open={showCreateDialog}
					onClose={() => setShowCreateDialog(false)}
					projectId={currentProject?.id || ""}
					onSubmit={handleCreateQueue}
				/>
			)}
		</div>
	);
}
