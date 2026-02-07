import { ExternalLink } from "lucide-react";

import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { TableCell, TableRow } from "@shared/ui/table";
import { formatDateTime } from "@shared/utils/dateAndTimeUtils";

import { WorkerStatusMap } from "@entities/worker-status/lib/constants";
import type { WorkerStatus } from "@entities/worker-status/types/types";
import { getWorkerStatus } from "@entities/worker-status/utils/derive";

type WorkerTableRowProps = {
	worker: WorkerStatus;
	onViewJobs: (workerId: string) => void;
};

const WorkerTableRow: React.FC<WorkerTableRowProps> = ({
	worker,
	onViewJobs,
}) => {
	const status = getWorkerStatus(worker.lastSeen);

	return (
		<TableRow>
			<TableCell className="font-medium">{worker.workerId}</TableCell>

			<TableCell>
				<Badge variant="outline">{Number(worker.activeJobs)}</Badge>
			</TableCell>

			<TableCell>
				<Badge variant={WorkerStatusMap[status]}>{status}</Badge>
			</TableCell>

			<TableCell>{formatDateTime(worker.lastSeen)}</TableCell>

			<TableCell>{formatDateTime(worker.createdAt)}</TableCell>

			<TableCell>{formatDateTime(worker.updatedAt)}</TableCell>
			<TableCell>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => onViewJobs(worker.workerId)}
				>
					<ExternalLink className="w-4 h-4" />
				</Button>
			</TableCell>
		</TableRow>
	);
};

export default WorkerTableRow;
