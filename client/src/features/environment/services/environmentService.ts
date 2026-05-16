import api from "@shared/api";
import { generateQueryParams } from "@shared/api/utils/requestUtils";

import type { EnvironmentSearchResponse } from "@entities/environment/types/apiTypes";
import type { RawEnvironmentSearchParams } from "@entities/environment/types/types";
import { toEnvironments } from "@entities/environment/utils/transform";

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
