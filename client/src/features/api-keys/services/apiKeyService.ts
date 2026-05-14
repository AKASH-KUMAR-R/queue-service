import api from "@shared/api";
import { generateQueryParams } from "@shared/api/utils/requestUtils";
import type { PaginatedResult } from "@shared/types/utils";

import type {
	ApiKey,
	ApiKeySearchParams,
	ApiKeyWithSecret,
} from "@entities/api-key/model/types";
import {
	toApiKey,
	toApiKeyList,
	toApiKeyWithSecret,
} from "@entities/api-key/utils/transform";

export type ApiKeyCreateData = {
	project_id: string;
	description: string;
};

type ApiKeyCreateResponse = {
	data: ApiKeyWithSecret;
};

type ApiKeyListResponse = {
	data: PaginatedResult<ApiKey>;
};

type ApiKeyRevokeResponse = {
	data: ApiKey;
	success: boolean;
};

export const create = async (
	data: ApiKeyCreateData,
): Promise<ApiKeyCreateResponse> => {
	const response = await api.post("/api/dashboard/api-key/create", data);

	return { data: toApiKeyWithSecret(response.data.data) };
};

export const list = async (
	projectId: string,
	filters: ApiKeySearchParams,
): Promise<ApiKeyListResponse> => {
	const urlParams = generateQueryParams({
		project_id: projectId,
		...filters,
	});

	const response = await api.get(
		`/api/dashboard/api-key/search?${urlParams.toString()}`,
	);

	return {
		data: {
			...response.data.data,
			results: toApiKeyList(response.data.data.results),
		},
	};
};

export const revoke = async (
	apiKeyId: string,
): Promise<ApiKeyRevokeResponse> => {
	const response = await api.put(`/api/dashboard/api-key/revoke/${apiKeyId}`);

	return {
		data: toApiKey(response.data.data),
		success: response.data.success,
	};
};
