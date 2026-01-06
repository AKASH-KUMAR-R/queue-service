import { type ReactNode, createContext, useContext, useState } from "react";

import type { Project } from "@entities/project/types";

interface ProjectContextType {
	currentProject: Project;
	projects: Project[];
	setCurrentProject: (project: Project) => void;
	addProject: (project: Project) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const mockProjects: Project[] = [
	{
		id: "proj_a8f3k2",
		name: "prod-core-api",
		environment: "production",
		region: "us-east-1",
		organization: "Acme Inc",
		createdAt: "2024-01-15T10:00:00Z",
	},
	{
		id: "proj_b9j2m1",
		name: "staging-core-api",
		environment: "staging",
		region: "us-west-2",
		organization: "Acme Inc",
		createdAt: "2024-02-01T10:00:00Z",
	},
	{
		id: "proj_c7n4p8",
		name: "dev-experimental",
		environment: "development",
		region: "eu-west-1",
		organization: "Acme Inc",
		createdAt: "2024-03-10T10:00:00Z",
	},
];

export function ProjectProvider({ children }: { children: ReactNode }) {
	const [currentProject, setCurrentProject] = useState<Project>(
		mockProjects[0],
	);
	const [projects, setProjects] = useState<Project[]>(mockProjects);

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
