import { Check, ChevronDown } from "lucide-react";
import { toast } from "sonner";

import type { PaginationParams } from "@shared/types/types";
import { EmptyState } from "@shared/ui/EmptyState";
import { Button } from "@shared/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@shared/ui/dialog";

import type { Project } from "@entities/project/types";

import { ProjectTable } from "./ProjectTable";

type ProjectSwitcherDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	currentProject: Project | null;
	projects: Project[];
	onProjectChange: (project: Project) => void;
	onCreateProject: () => void;
	pagination: PaginationParams & { totalPages?: number };
	onPageChange: (page: number) => void;
};

export function ProjectSwitcherDialog({
	isOpen,
	onClose,
	currentProject,
	projects,
	onProjectChange,
	onCreateProject,
	pagination,
	onPageChange,
}: ProjectSwitcherDialogProps) {
	const handleProjectSelect = (project: Project) => {
		onProjectChange(project);
		toast.info("Switched to project: " + project.label);
		onClose();
	};
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className=" w-full sm:max-w-7xl sm:h-[calc(100%-4rem)]">
				<DialogTitle>Project Switcher</DialogTitle>

				{projects.length === 0 ? (
					<EmptyState
						title="No Projects Available"
						description="You don't have any projects yet. Create a new project to get started."
						actionLabel="Create Project"
						onAction={onCreateProject}
					/>
				) : (
					<ProjectTable
						data={projects}
						page={pagination.page || 1}
						totalPages={pagination.totalPages || 1}
						onPageChange={onPageChange}
						renderActions={(project) => (
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => handleProjectSelect(project)}
								className={
									project.id === currentProject?.id
										? "bg-toggle-background hover:bg-toggle-background-hover text-white"
										: ""
								}
							>
								{project.id === currentProject?.id ? (
									<Check className="mr-2" />
								) : (
									<ChevronDown className="mr-2" />
								)}
								Switch
							</Button>
						)}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
}
