import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { toast } from "sonner";

import { Spinner } from "@shared/ui/spinner";

import { useProjectList } from "@features/projects/data/listProject";

import { useProject } from "../ProjectContext";

const ProjectExistenceWrapper = () => {
	const {
		currentProject,
		initializeProjects,
		setIsProjectsLoading,
		pagination,
		handlePaginationChange,
	} = useProject();

	const {
		data: projectList,
		isLoading: isProjectListLoading,
		isError: isProjectListError,
		isSuccess: isProjectListSuccess,
	} = useProjectList({
		page: pagination.page,
		limit: pagination.limit,
	});

	useEffect(() => {
		if (isProjectListLoading) return;

		if (isProjectListSuccess) {
			initializeProjects(projectList.data.results || []);
			handlePaginationChange({
				page: projectList.data.page,
				limit: projectList.data.limit,
				totalPages: projectList.data.totalPages,
			});
			setIsProjectsLoading(false);
		}

		if (isProjectListError) {
			setIsProjectsLoading(false);
			toast.error("Failed to load projects. Please try again.");
		}
	}, [
		projectList,
		isProjectListLoading,
		isProjectListError,
		isProjectListSuccess,
		initializeProjects,
		handlePaginationChange,
	]);

	if (isProjectListLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<p className="text-lg text-muted-foreground">
					<Spinner size="lg" /> Loading projects...
				</p>
			</div>
		);
	}

	if (!currentProject) {
		return (
			<div className="flex items-center justify-center">
				<p className="text-lg text-muted-foreground">
					No project selected. Please create or select a project to
					continue.
				</p>
			</div>
		);
	}

	return <Outlet />;
};

export default ProjectExistenceWrapper;
