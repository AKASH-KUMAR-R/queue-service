import type { ApiKey, ApiKeyWithSecret } from "@/entities/api-key/model/types";
import api from "@/shared/api";
import type { PaginatedResult } from "@/shared/types/utils";

export type ApiKeyCreateData = {
	project_id: string;
};

type ApiKeyCreateResponse = {
	data: {
		data: ApiKeyWithSecret;
	};
};

type ApiKeyListResponse = {
	data: {
		data: PaginatedResult<ApiKey>;
	};
};

type ApiKeyRevokeResponse = {
	data: {
		data: ApiKey;
		success: boolean;
	};
};

export const create = async (
	data: ApiKeyCreateData,
): Promise<ApiKeyCreateResponse> => {
	const response = await api.post("/api/dashboard/api-key/create", data);

	return { data: response.data };
};

export const list = async (projectId: string): Promise<ApiKeyListResponse> => {
	const urlParams = new URLSearchParams({ project_id: projectId });

	const response = await api.get(
		`/api/dashboard/api-key/search?${urlParams.toString()}`,
	);

	return { data: response.data };
};

export const revoke = async (
	apiKeyId: string,
): Promise<ApiKeyRevokeResponse> => {
	const response = await api.put(`/api/dashboard/api-key/revoke/${apiKeyId}`);

	return { data: response.data };
};
