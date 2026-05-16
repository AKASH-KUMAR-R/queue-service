import type {
	Environment,
	EnvironmentSearchParams,
	RawEnvironment,
} from "../types/types";

export const toEnvironment = (raw: RawEnvironment): Environment => ({
	id: raw.id,
	name: raw.name,
	projectId: raw.project_id,
	isDefault: raw.is_default,
	isActive: raw.is_active,
	createdAt: raw.created_at,
	updatedAt: raw.updated_at,
});

export const toEnvironments = (
	rawEnvironments: RawEnvironment[],
): Environment[] => rawEnvironments.map(toEnvironment);

export const toRawEnvironmentSearchParams = (
	params: EnvironmentSearchParams,
) => ({
	project_id: params.projectId,
	name: params.name,
	is_default: params.isDefault,
	page: params.page,
	limit: params.limit,
});
