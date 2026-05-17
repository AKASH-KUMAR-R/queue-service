import api from "@shared/api";
import { generateQueryParams } from "@shared/api/utils/requestUtils";

import type {
	CreateEnvironmentRequest,
	EnvironmentResponse,
	EnvironmentSearchResponse,
	UpdateEnvironmentRequest,
} from "@entities/environment/types/apiTypes";
import type { RawEnvironmentSearchParams } from "@entities/environment/types/types";
import {
	toEnvironment,
	toEnvironments,
} from "@entities/environment/utils/transform";

export const listEnvironment = async (params: RawEnvironmentSearchParams) => {
	const queryParams = generateQueryParams(params);

	const response = await api.get<EnvironmentSearchResponse>(
		`/api/dashboard/environment/search?${queryParams.toString()}`,
	);

	return {
		data: {
			...response.data.data,
			results: toEnvironments(response.data.data.results),
		},
	};
};

export const createEnvironment = async (data: CreateEnvironmentRequest) => {
	const response = await api.post<EnvironmentResponse>(
		"/api/dashboard/environment/create",
		data,
	);

	return { data: toEnvironment(response.data.data) };
};

export const updateEnvironment = async (
	environmentId: string,
	data: UpdateEnvironmentRequest,
) => {
	const response = await api.put<EnvironmentResponse>(
		`/api/dashboard/environment/${environmentId}`,
		data,
	);

	return { data: toEnvironment(response.data.data) };
};
