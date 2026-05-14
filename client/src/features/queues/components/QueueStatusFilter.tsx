import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@shared/ui/select";

import type { QueueStatus } from "@entities/queue/types/types";

type QueueStatusFilterProps = {
	status?: QueueStatus;
	onStatusChange: (status?: QueueStatus) => void;
};

type QueueStatusSelectOption = QueueStatus | "ALL";

const getStatusLabel = (status?: QueueStatus) => {
	switch (status) {
		case "ACTIVE":
			return "Active";
		case "PAUSED":
			return "Paused";
		case "DELETED":
			return "Deleted";
		default:
			return "All Statuses";
	}
};

export function QueueStatusFilter({
	status,
	onStatusChange,
}: QueueStatusFilterProps) {
	return (
		<div className="flex items-center gap-2">
			<span className="text-xs text-neutral-600">Status:</span>
			<Select
				onValueChange={(value) => {
					const selectedStatus = value as QueueStatusSelectOption;
					onStatusChange(
						selectedStatus === "ALL" ? undefined : selectedStatus,
					);
				}}
				value={status ?? "ALL"}
			>
				<SelectTrigger className="w-[180px]">
					<SelectValue>{getStatusLabel(status)}</SelectValue>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="ALL">All Statuses</SelectItem>
					<SelectItem value="ACTIVE">Active</SelectItem>
					<SelectItem value="PAUSED">Paused</SelectItem>
					<SelectItem value="DELETED">Deleted</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
