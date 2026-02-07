import type {
	ApiKey,
	ApiKeyWithSecret,
	RawApiResponseApiKey,
	RawApiResponseApiKeyWithSecret,
} from "../model/types";

export const toApiKey = (data: RawApiResponseApiKey): ApiKey => {
	return {
		id: data.id,
		projectId: data.project_id,
		revoked: data.revoked,
		description: data.description,
		createdAt: data.created_at,
		updatedAt: data.updated_at,
		revokedAt: data.revoked_at,
	};
};

export const toApiKeyWithSecret = (
	data: RawApiResponseApiKeyWithSecret,
): ApiKeyWithSecret => {
	return {
		...toApiKey(data),
		unhashedKey: data.unhashed_key,
	};
};

export const toApiKeyList = (data: RawApiResponseApiKey[]): ApiKey[] => {
	return data.map((apiKey) => toApiKey(apiKey));
};
