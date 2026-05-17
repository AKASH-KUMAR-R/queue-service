import type {
	Base,
	PaginationParams,
	RawApiResponseBase,
} from "@shared/types/types";

export type Environment = Base & {
	id: string;
	name: string;
	projectId: string;
	isDefault: boolean;
	isActive: boolean;
};

export type RawEnvironment = RawApiResponseBase & {
	id: string;
	name: string;
	project_id: string;
	is_default: boolean;
	is_active: boolean;
};

export type EnvironmentSearchParams = PaginationParams & {
	projectId?: string;
	name?: string;
	isDefault?: boolean;
	page?: number;
	limit?: number;
};

export type RawEnvironmentSearchParams = PaginationParams & {
	project_id?: string;
	name?: string;
	is_default?: boolean;
};
