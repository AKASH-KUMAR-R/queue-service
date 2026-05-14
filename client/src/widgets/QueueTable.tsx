import type { PaginatedComponentProps } from "@shared/types/types";
import { Paginated } from "@shared/ui/pagination/Paginated";
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "@shared/ui/table";

import type { QueueWithMetrics } from "@entities/queue/types/types";

import { QueueTableRow } from "@features/queues/components/QueueTableRow";

type QueueTableProps = PaginatedComponentProps & {
	queues: QueueWithMetrics[];
};

export function QueueTable({
	queues,
	page,
	onPageChange,
	totalPages,
}: QueueTableProps) {
	return (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableCell>Queue Name</TableCell>
						<TableCell>Status</TableCell>
						<TableCell>Active</TableCell>
						<TableCell>Completed</TableCell>
						<TableCell>Failed</TableCell>
						<TableCell>Rate Limit Per Unit</TableCell>
						{/* <TableCell >
								Last Processed
							</TableCell> */}
						<TableCell>Actions</TableCell>
					</TableRow>
				</TableHeader>
				<TableBody className="divide-y ">
					{queues.map((queue) => (
						<QueueTableRow key={queue.id} queue={queue} />
					))}
				</TableBody>
			</Table>
			<Paginated
				page={page}
				onPageChange={onPageChange}
				totalPages={totalPages}
			/>
		</>
	);
}
