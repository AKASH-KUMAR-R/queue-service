import { useEffect } from "react";
import { Outlet, useSearchParams } from "react-router-dom";

import { toast } from "sonner";

import { STORAGE_KEYS } from "@shared/lib/storage";
import { Spinner } from "@shared/ui/spinner";
import { getValueFromLocalStorage } from "@shared/utils/storage";

import { useProjectList } from "@features/projects/data/listProject";
import { useProjectById } from "@features/projects/data/projectById";

import { useProject } from "../ProjectContext";

//TODO: This component is responsible for ensuring that a valid project context is established before rendering any child routes that depend on it. It checks for the presence of a projectId in the URL or local storage, fetches the corresponding project data, and handles loading and error states appropriately. If no valid project is found, it prompts the user to select or create a project.
const ProjectsExistenceWrapper = () => {
	const [searchParams] = useSearchParams();

	const {
		setCurrentProject,
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

	const {
		data: project,
		isLoading: isProjectLoading,
		isError: isProjectError,
	} = useProjectById(
		searchParams.get("projectId") ||
			getValueFromLocalStorage<string | null>(
				STORAGE_KEYS.currentProject,
				null,
			),
	);

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

	// Syncing current project with URL changes
	// This ensures that if the user manually changes the URL or if we programmatically change it from somewhere else, the current project in context stays in sync.

	useEffect(() => {
		if (isProjectLoading) return;

		if (isProjectError) {
			toast.error(
				"Failed to load the selected project. Please try again.",
			);
			setCurrentProject(null);
			return;
		}

		if (project) {
			setCurrentProject(project.data);
		} else {
			setCurrentProject(null);
		}
	}, [project, isProjectLoading, isProjectError]);

	if (isProjectListLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<p className="text-lg text-muted-foreground">
					<Spinner size="lg" /> Loading projects...
				</p>
			</div>
		);
	}

	if (isProjectLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<p className="text-lg text-muted-foreground">
					<Spinner size="lg" /> Loading project
					<span className=" font-semibold">
						{searchParams.get("projectId")}
					</span>
					...
				</p>
			</div>
		);
	}

	return <Outlet />;
};

export default ProjectsExistenceWrapper;
