import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useState,
} from "react";

import { STORAGE_KEYS } from "@shared/lib/storage";
import type { PaginationParams } from "@shared/types/types";
import { setValueInLocalStorage } from "@shared/utils/storage";

import type { Project } from "@entities/project/types";

type ProjectContextType = {
	currentProject: Project | null;
	projects: Project[];
	setCurrentProject: (project: Project | null) => void;
	addProject: (project: Project) => void;
	initializeProjects: (initialProjects: Project[]) => void;
	isProjectsLoading: boolean;
	setIsProjectsLoading: (isLoading: boolean) => void;
	pagination: PaginationParams & {
		totalPages?: number;
	};
	handlePaginationChange: (
		pagination: PaginationParams & { totalPages?: number },
	) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);
export function ProjectProvider({ children }: { children: ReactNode }) {
	const [currentProject, setCurrentProject] = useState<Project | null>(null);

	const [projects, setProjects] = useState<Project[]>([]);
	const [isProjectsLoading, setIsProjectsLoading] = useState<boolean>(true);

	const [pagination, setPagination] = useState<
		PaginationParams & { totalPages?: number }
	>({
		page: 1,
		limit: 10,
		totalPages: 1,
	});

	const handlePaginationChange = useCallback(
		(pagination: PaginationParams & { totalPages?: number }) => {
			setPagination((prev) => ({ ...prev, ...pagination }));
		},
		[],
	);

	const initializeProjects = useCallback(
		(initialProjects: Project[]) => {
			setProjects(initialProjects);
		},
		[currentProject, setCurrentProject],
	);

	const addProject = useCallback((project: Project) => {
		setProjects((prev) => [...prev, project]);
		setCurrentProject(project);
	}, []);

	const changeCurrentProject = useCallback((project: Project | null) => {
		setCurrentProject(project);
		setValueInLocalStorage(
			STORAGE_KEYS.currentProject,
			project?.id || null,
		);
	}, []);

	return (
		<ProjectContext.Provider
			value={{
				currentProject,
				projects,
				setCurrentProject: changeCurrentProject,
				addProject,
				initializeProjects,
				isProjectsLoading,
				setIsProjectsLoading,
				pagination,
				handlePaginationChange,
			}}
		>
			{children}
		</ProjectContext.Provider>
	);
}

export function useProject() {
	const context = useContext(ProjectContext);
	if (context === undefined) {
		throw new Error("useProject must be used within a ProjectProvider");
	}
	return context;
}
