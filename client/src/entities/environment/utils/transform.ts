import type {
	CreateEnvironmentRequest,
	UpdateEnvironmentRequest,
} from "../types/apiTypes";
import type {
	Environment,
	EnvironmentSearchParams,
	RawEnvironment,
} from "../types/types";

export type EnvironmentFormData = {
	projectId: string;
	name: string;
	isDefault?: boolean;
};

export type EnvironmentUpdateFormData = {
	name?: string;
	isDefault?: boolean;
};

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

export const toCreateEnvironmentRequest = (
	data: EnvironmentFormData,
): CreateEnvironmentRequest => ({
	project_id: data.projectId,
	name: data.name,
	is_default: data.isDefault,
});

export const toUpdateEnvironmentRequest = (
	data: EnvironmentUpdateFormData,
): UpdateEnvironmentRequest => ({
	name: data.name,
	is_default: data.isDefault,
});
