// API Key entity types

export type ApiKeyStatus = boolean;

export type ApiKey = {
	id: string;
	projectId: string;
	revoked: boolean;
	//` Timestamps
	createdAt: string; // ISO 8601
	updatedAt: string; // ISO 8601
	revokedAt?: string; // ISO 8601 (only if revoked)
};

export type ApiKeyWithSecret = ApiKey & {
	unhashedKey: string; // Only available on creation
};

export interface CreateApiKeyRequest {
	name: string;
	description?: string;
}

export interface CreateApiKeyResponse {
	apiKey: ApiKeyWithSecret; // Includes full key
	warning: string; // Warning message to display
}
