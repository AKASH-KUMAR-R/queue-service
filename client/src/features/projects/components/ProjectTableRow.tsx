import { TableCell, TableRow } from "@shared/ui/table";
import { formatDateTime } from "@shared/utils/dateAndTimeUtils";

import type { Project } from "@entities/project/types";

type ProjectTableRowProps = {
	project: Project;
	onClick?: (project: Project) => void;
	renderActions?: (project: Project) => React.ReactNode;
};

const ProjectTableRow: React.FC<ProjectTableRowProps> = ({
	project,
	onClick,
	renderActions,
}) => {
	return (
		<TableRow className="cursor-pointer" onClick={() => onClick?.(project)}>
			<TableCell className="font-medium">{project.label}</TableCell>

			<TableCell className="text-muted-foreground">
				{project.description || "—"}
			</TableCell>

			<TableCell>{formatDateTime(project.createdAt)}</TableCell>

			<TableCell>{formatDateTime(project.updatedAt)}</TableCell>
			{renderActions && <TableCell>{renderActions(project)}</TableCell>}
		</TableRow>
	);
};

export default ProjectTableRow;
