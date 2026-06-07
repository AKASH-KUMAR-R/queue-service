import { useEffect, useMemo, useState } from "react";

import { Check, ChevronDown, Search } from "lucide-react";

import type { PaginationParams } from "@shared/types/types";
import { EmptyState } from "@shared/ui/EmptyState";
import { Button } from "@shared/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@shared/ui/dialog";
import { Input } from "@shared/ui/input";

import type { Project } from "@entities/project/types";

import { useProjectList } from "../data/listProject";
import { ProjectTable } from "./ProjectTable";

type ProjectSwitcherDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	currentProject: Project | null;
	projects: Project[];
	onProjectChange: (project: Project) => void;
	onCreateProject: () => void;
	pagination: PaginationParams & { totalPages?: number };
};

export function ProjectSwitcherDialog({
	isOpen,
	onClose,
	currentProject,
	projects,
	onProjectChange,
	onCreateProject,
	pagination,
}: ProjectSwitcherDialogProps) {
	const [searchValue, setSearchValue] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [page, setPage] = useState(pagination.page || 1);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchValue.trim());
			setPage(1);
		}, 350);

		return () => clearTimeout(timer);
	}, [searchValue]);

	const filters = useMemo(
		() => ({
			page,
			limit: pagination.limit,
			title: debouncedSearch || undefined,
			id: debouncedSearch || undefined,
		}),
		[page, pagination.limit, debouncedSearch],
	);

	const { data: projectList, isLoading: isProjectsLoading } = useProjectList(
		filters,
		{ enabled: isOpen },
	);

	const displayedProjects = projectList?.data.results ?? projects;
	const currentPage = projectList?.data.page ?? page;
	const totalPages =
		projectList?.data.totalPages ?? pagination.totalPages ?? 1;

	const handleProjectSelect = (project: Project) => {
		onProjectChange(project);
		onClose();
	};

	const handleDialogOpenChange = (open: boolean) => {
		if (!open) {
			setSearchValue("");
			setDebouncedSearch("");
			setPage(1);
			onClose();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
			<DialogContent className="w-full sm:max-w-7xl sm:h-[calc(100%-4rem)]">
				<DialogTitle className=" flex justify-between py-6">
					Project Switcher
					<Button type="button" onClick={onCreateProject}>
						Create Project
					</Button>
				</DialogTitle>

				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<Input
						value={searchValue}
						onChange={(event) => setSearchValue(event.target.value)}
						placeholder="Search by project title or ID"
						className="pl-9"
					/>
				</div>

				{displayedProjects.length === 0 ? (
					<EmptyState
						title="No Projects Available"
						description={
							searchValue.trim()
								? `No projects match "${searchValue.trim()}".`
								: "You don't have any projects yet. Create a new project to get started."
						}
						actionLabel={
							searchValue.trim() ? undefined : "Create Project"
						}
						onAction={
							searchValue.trim() ? undefined : onCreateProject
						}
					/>
				) : (
					<ProjectTable
						data={displayedProjects}
						page={currentPage}
						totalPages={totalPages}
						onPageChange={setPage}
						renderActions={(project) => (
							<Button
								type="button"
								variant="ghost"
								size="sm"
								disabled={isProjectsLoading}
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
