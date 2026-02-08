import { useEffect } from "react";

import { toast } from "sonner";

import { Spinner } from "@shared/ui/spinner";

import { useProjectList } from "@features/projects/data/listProject";

import { useProject } from "../ProjectContext";

type ProjectExistenceWrapperProps = {
	children: React.ReactNode;
};

const ProjectExistenceWrapper: React.FC<ProjectExistenceWrapperProps> = ({
	children,
}) => {
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
			console.log("Fetched projects:", projectList.data);
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

	return children;
};

export default ProjectExistenceWrapper;
