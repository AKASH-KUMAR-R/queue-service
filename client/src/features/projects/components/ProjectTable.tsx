import type { PaginatedComponentProps } from "@shared/types/types";
import { Paginated } from "@shared/ui/pagination/Paginated";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@shared/ui/table";

import type { Project } from "@entities/project/types";

import ProjectTableRow from "./ProjectTableRow";

type ProjectTableProps = PaginatedComponentProps & {
	data: Project[];
	onRowClick?: (project: Project) => void;
	renderActions?: (project: Project) => React.ReactNode;
};

export const ProjectTable: React.FC<ProjectTableProps> = ({
	data = [],
	onRowClick,
	renderActions,
	page,
	totalPages,
	onPageChange,
}) => {
	return (
		<div className=" w-full space-y-2">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Label</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Updated</TableHead>
						{renderActions && <TableHead>Actions</TableHead>}
					</TableRow>
				</TableHeader>

				<TableBody>
					{data.map((project) => (
						<ProjectTableRow
							key={project.id}
							project={project}
							onClick={onRowClick}
							renderActions={renderActions}
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
