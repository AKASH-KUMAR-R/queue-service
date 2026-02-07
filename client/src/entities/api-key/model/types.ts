// API Key entity types

export type ApiKeyStatus = boolean;

export type ApiKey = {
	id: string;
	projectId: string;
	revoked: boolean;
	description: string;
	//` Timestamps
	createdAt: string; // ISO 8601
	updatedAt: string; // ISO 8601
	revokedAt?: string; // ISO 8601 (only if revoked)
};

export type RawApiResponseApiKey = {
	id: string;
	project_id: string;
	revoked: boolean;
	description: string;
	created_at: string;
	updated_at: string;
	revoked_at?: string;
};

export type ApiKeyWithSecret = ApiKey & {
	unhashedKey: string; // Only available on creation
};

export type RawApiResponseApiKeyWithSecret = RawApiResponseApiKey & {
	unhashed_key: string; // Only available on creation
};

export type CreateApiKeyRequest = {
	description: string;
	project_id: string;
};

export type CreateApiKeyResponse = {
	apiKey: ApiKeyWithSecret;
	warning: string;
};
