import { Checkbox } from "@shared/ui/checkbox";
import { Label } from "@shared/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@shared/ui/select";

import type { JobSearchParams } from "@entities/job/types/types";

export type JobViewMode = "card" | "list";

type JobViewProps = {
	// viewMode: JobViewMode;
	// onViewModeChange: (mode: JobViewMode) => void;
	searchQuery: JobSearchParams;
	onSearchChange: (field: string, query: any) => void;
};

export function JobViewControls({
	// viewMode,
	// onViewModeChange,
	searchQuery,
	onSearchChange,
}: JobViewProps) {
	return (
		<div className="flex items-center  gap-4 mb-6">
			{/* <div className="flex-1 max-w-md relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
				<Input
					type="text"
					placeholder="Search jobs by name or ID..."
					value={searchQuery.}
					onChange={(e) => onSearchChange("query", e.target.value)}
					className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 rounded bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
				/>
			</div> */}
			<div>
				<Select
					onValueChange={(value) => {
						onSearchChange("status", value);
					}}
					value={searchQuery.status || ""}
				>
					<SelectTrigger>
						<SelectValue>
							{searchQuery.status
								? searchQuery.status.replace("_", " ")
								: "All Statuses"}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="ALL">All Statuses</SelectItem>
						<SelectItem value="PENDING">Pending</SelectItem>
						<SelectItem value="IN_PROGRESS">In Progress</SelectItem>
						<SelectItem value="COMPLETED">Completed</SelectItem>
						<SelectItem value="FAILED">Failed</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className=" flex items-center gap-2">
				<Label htmlFor="scheduled-jobs">Scheduled Jobs</Label>
				<Checkbox
					id="scheduled-jobs"
					checked={searchQuery.isScheduled}
					onCheckedChange={(checked) =>
						onSearchChange("isScheduled", checked)
					}
				/>
			</div>

			{/* <div className="flex items-center gap-2">
				<span className="text-xs text-neutral-600 mr-2">View:</span>
				<div className="flex gap-1 bg-neutral-100 rounded p-1">
					<button
						onClick={() => onViewModeChange("card")}
						className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-colors ${
							viewMode === "card"
								? "bg-white text-neutral-900 shadow-sm"
								: "text-neutral-600 hover:text-neutral-900"
						}`}
					>
						<Grid className="w-4 h-4" />
						Card
					</button>
					<button
						onClick={() => onViewModeChange("list")}
						className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-colors ${
							viewMode === "list"
								? "bg-white text-neutral-900 shadow-sm"
								: "text-neutral-600 hover:text-neutral-900"
						}`}
					>
						<List className="w-4 h-4" />
						List
					</button>
				</div>
			</div> */}
		</div>
	);
}
