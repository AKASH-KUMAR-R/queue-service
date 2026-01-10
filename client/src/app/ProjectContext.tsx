import { type ReactNode, createContext, useContext, useState } from "react";

import type { Project } from "@entities/project/types";

type ProjectContextType = {
	currentProject: Project | null;
	projects: Project[];
	setCurrentProject: (project: Project) => void;
	addProject: (project: Project) => void;
	initializeProjects: (initialProjects: Project[]) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);
export function ProjectProvider({ children }: { children: ReactNode }) {
	const [currentProject, setCurrentProject] = useState<Project | null>(null);
	const [projects, setProjects] = useState<Project[]>([]);

	const initializeProjects = (initialProjects: Project[]) => {
		setProjects(initialProjects);
		if (initialProjects.length > 0) {
			setCurrentProject(initialProjects[0]);
		}
	};

	const addProject = (project: Project) => {
		setProjects((prev) => [...prev, project]);
		setCurrentProject(project);
	};

	return (
		<ProjectContext.Provider
			value={{
				currentProject,
				projects,
				setCurrentProject,
				addProject,
				initializeProjects,
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
