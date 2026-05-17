import { useEffect, useState } from "react";

import { useProject } from "@app/ProjectContext";
import { QueueGrid } from "@widgets/QueueGrid";
import { QueueTable } from "@widgets/QueueTable";
import {
	QueueViewControls,
	type QueueViewMode,
} from "@widgets/QueueViewControls";

import { EmptyState } from "@shared/ui/EmptyState";

import type { Queue, QueueSearchParams } from "@entities/queue/types/types";

import { useEnvironmentContext } from "@features/environment/context/EnvironmentContext";
import { CreateQueueButton } from "@features/queues/components/CreateQueueButton";
import { CreateQueueDialog } from "@features/queues/components/CreateQueueDialog";
import { QueueStatusFilter } from "@features/queues/components/QueueStatusFilter";
import { useQueueList } from "@features/queues/data/listQueue";

const isAnyFilterActive = (filters: QueueSearchParams) => {
	return (
		filters.label?.trim() !== "" ||
		(filters.status !== undefined && filters.status !== "ACTIVE")
	);
};

export function QueuesPage() {
	const { currentProject } = useProject();
	const { currentEnvironment } = useEnvironmentContext();
	const [viewMode, setViewMode] = useState<QueueViewMode>("card");
	const [filters, setFilters] = useState<QueueSearchParams>({
		label: "",
		projectId: currentProject?.id || "",
		status: "ACTIVE",
		page: 1,
		limit: 10,
	});
	const [debouncedLabel, setDebouncedLabel] = useState("");

	const [showCreateDialog, setShowCreateDialog] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedLabel(filters.label?.trim() || "");
		}, 350);

		return () => clearTimeout(timer);
	}, [filters.label]);

	const { data, isLoading: isQueueLoading } = useQueueList({
		...filters,
		label: debouncedLabel,
		projectId: currentProject?.id || "",
		environmentId: currentEnvironment?.id || "",
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
				onSearchChange={(field, value) => {
					if (field !== "label") return;
					setFilters((prev) => ({ ...prev, label: value, page: 1 }));
				}}
			/>
			<div className="mb-6">
				<QueueStatusFilter
					status={filters.status}
					onStatusChange={(status) => {
						setFilters((prev) => ({ ...prev, status, page: 1 }));
					}}
				/>
			</div>

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
					environmentId={currentEnvironment?.id || ""}
					onSubmit={handleCreateQueue}
				/>
			)}
		</div>
	);
}
