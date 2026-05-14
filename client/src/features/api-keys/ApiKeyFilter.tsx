import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@shared/ui/select";

import type { ApiKeyFilterStatus } from "@entities/api-key/model/types";

type ApiKeyFilterProps = {
	revoked: ApiKeyFilterStatus;
	onStatusChange: (revoked: string) => void;
};

const getStatusLabel = (revoked: ApiKeyFilterStatus) => {
	switch (revoked) {
		case true:
			return "Revoked";
		default:
			return "Active";
	}
};

export function ApiKeyFilter({ revoked, onStatusChange }: ApiKeyFilterProps) {
	return (
		<div className="flex items-center gap-2">
			<span className="text-xs text-neutral-600">Status:</span>
			<Select onValueChange={onStatusChange} value={String(revoked)}>
				<SelectTrigger className="w-[180px]">
					<SelectValue>{getStatusLabel(revoked)}</SelectValue>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="false">Active</SelectItem>
					<SelectItem value="true">Revoked</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
