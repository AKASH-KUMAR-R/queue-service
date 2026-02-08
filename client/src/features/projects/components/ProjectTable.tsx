import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@shared/ui/table";

import type { Project } from "@entities/project/types";

import ProjectTableRow from "./ProjectTableRow";

type ProjectTableProps = {
	data: Project[];
	onRowClick?: (project: Project) => void;
	renderActions?: (project: Project) => React.ReactNode;
};

export const ProjectTable: React.FC<ProjectTableProps> = ({
	data = [],
	onRowClick,
	renderActions,
}) => {
	return (
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
	);
};
