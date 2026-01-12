import type { Project } from "@/entities/project/types";
import type { UpdateProjectFormData } from "@/pages/ProjectSettingsPage";
import api from "@/shared/api";

import type { CreateProjectFormData } from "../CreateProjectDialog";

type ProjectListResponse = {
	data: Project[];
};

type CreateProjectResponse = {
	data: Project;
};

type UpdateProjectResponse = {
	data: Project;
};

export const fetchProjects = async (): Promise<ProjectListResponse> => {
	const response = await api.get("/api/dashboard/project/list");

	return { data: response.data.data };
};

export const createProject = async (
	data: CreateProjectFormData,
): Promise<CreateProjectResponse> => {
	const response = await api.post("/api/dashboard/project/create", data);

	return { data: response.data };
};

export const updateProject = async (
	projectId: string,
	data: UpdateProjectFormData,
): Promise<UpdateProjectResponse> => {
	const response = await api.put(`/api/dashboard/project/${projectId}`, data);

	return { data: response.data };
};
