import type { Project, RawApiResponseProject } from "../types";

export const toProject = (data: RawApiResponseProject): Project => {
	return {
		id: data.id,
		label: data.label,
		description: data.description,
		userId: data.user_id,
		createdAt: data.created_at,
		updatedAt: data.updated_at,
	};
};

export const toProjectList = (data: RawApiResponseProject[]): Project[] => {
	return data.map((project) => toProject(project));
};
