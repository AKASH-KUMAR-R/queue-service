import { FolderKanban } from "lucide-react";

import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";

import type { Project } from "@entities/project/types";

type CurrentProjectProps = {
	project: Project | null;
	onClick?: () => void;
};

const ProjectSwitcherDisplayCurrent: React.FC<CurrentProjectProps> = ({
	project,
	onClick,
}) => {
	return (
		<div className="w-full border-b">
			<Button
				type="button"
				variant="ghost"
				onClick={onClick}
				className="
					w-full h-16 px-3
					flex items-center gap-3
					justify-start
					rounded-none
					hover:bg-sidebar-accent
				"
			>
				<Badge
					variant="default"
					className=" w-8 h-8 bg-blue-500 text-white"
				>
					<FolderKanban className="h-4 w-4" />
				</Badge>
				<div className="flex flex-col text-left overflow-hidden">
					<span className="text-xs text-muted-foreground">
						Current Project
					</span>

					<span className="text-sm font-semibold truncate">
						{project?.label || "No Project Selected"}
					</span>
				</div>
			</Button>
		</div>
	);
};

export default ProjectSwitcherDisplayCurrent;
