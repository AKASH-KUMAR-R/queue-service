// API Key entity types

export type ApiKeyStatus = 'active' | 'revoked';

export interface ApiKey {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  
  // Key display
  prefix: string;           // e.g., "qaas_live_abc"
  suffix: string;           // e.g., "xyz" (last 4 chars)
  
  // Status
  status: ApiKeyStatus;
  
  // Timestamps
  createdAt: string;        // ISO 8601
  lastUsedAt?: string;      // ISO 8601 (optional)
  revokedAt?: string;       // ISO 8601 (only if revoked)
  
  // Metadata
  createdBy?: string;       // User ID or email
}

export interface ApiKeyWithSecret extends ApiKey {
  fullKey: string;          // Only available on creation
}

export interface CreateApiKeyRequest {
  name: string;
  description?: string;
}

export interface CreateApiKeyResponse {
  apiKey: ApiKeyWithSecret; // Includes full key
  warning: string;          // Warning message to display
}
