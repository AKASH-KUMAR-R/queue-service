import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@shared/ui/table";

import type { WorkerStatus } from "@entities/worker-status/types/types";

import WorkerTableRow from "./WorkerTableRow";

type WorkerTableProps = {
	data: WorkerStatus[];
	handleViewJobs: (workerId: string) => void;
};

export const WorkersTable: React.FC<WorkerTableProps> = ({
	data = [],
	handleViewJobs,
}) => {
	return (
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
	);
};
