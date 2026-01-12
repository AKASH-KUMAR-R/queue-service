import { useEffect } from "react";

import { useProjectList } from "@/features/projects/data/listProject";
import { Spinner } from "@/shared/ui/spinner";
import { toast } from "sonner";

import { useProject } from "../ProjectContext";

type ProjectExistenceWrapperProps = {
	children: React.ReactNode;
};

const ProjectExistenceWrapper: React.FC<ProjectExistenceWrapperProps> = ({
	children,
}) => {
	const { currentProject, initializeProjects, setIsProjectsLoading } =
		useProject();

	const {
		data: projectList,
		isLoading: isProjectListLoading,
		isError: isProjectListError,
		isSuccess: isProjectListSuccess,
	} = useProjectList();

	useEffect(() => {
		if (isProjectListLoading) return;

		if (isProjectListSuccess) {
			console.log("Fetched projects:", projectList.data);
			initializeProjects(projectList.data || []);
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
			<div className="flex items-center justify-center h-full">
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
