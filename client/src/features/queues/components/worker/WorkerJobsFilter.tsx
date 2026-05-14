import { Checkbox } from "@shared/ui/checkbox";
import { Label } from "@shared/ui/form/Label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@shared/ui/select";

import type { ApiKeyFilterStatus } from "@entities/api-key/model/types";
import type { WorkerJobsFilters } from "@entities/job/types/types";

type WorkerJobsFilterProps = {
	filters: WorkerJobsFilters;
	onFilterChange: (name: string, value: string) => void;
};

export function WorkerJobsFilter({
	filters,
	onFilterChange,
}: WorkerJobsFilterProps) {
	return (
		<div className="flex items-center gap-2">
			<Label htmlFor="scheduled-jobs">Scheduled Jobs</Label>
			<Checkbox
				id="scheduled-jobs"
				checked={filters.isScheduled}
				onCheckedChange={(checked) =>
					onFilterChange("isScheduled", checked.toString())
				}
			/>
		</div>
	);
}
