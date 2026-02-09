import type { PaginatedComponentProps } from "@shared/types/types";
import { Paginated } from "@shared/ui/pagination/Paginated";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@shared/ui/table";

import type { WorkerStatus } from "@entities/worker-status/types/types";

import WorkerTableRow from "./WorkerTableRow";

type WorkerTableProps = PaginatedComponentProps & {
	data: WorkerStatus[];
	handleViewJobs: (workerId: string) => void;
};

export const WorkersTable: React.FC<WorkerTableProps> = ({
	data = [],
	handleViewJobs,
	page,
	totalPages,
	onPageChange,
}) => {
	return (
		<div className=" w-full">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Worker</TableHead>
						<TableHead>Active Jobs</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Last Seen</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Updated</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{data.map((worker) => (
						<WorkerTableRow
							key={worker.id}
							worker={worker}
							onViewJobs={handleViewJobs}
						/>
					))}
				</TableBody>
			</Table>

			<Paginated
				page={page}
				totalPages={totalPages}
				onPageChange={onPageChange}
			/>
		</div>
	);
};
