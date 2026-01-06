import type { ApiKey, ApiKeyWithSecret } from "./types";

export function generateMockApiKey(
	name: string,
	description?: string,
): ApiKeyWithSecret {
	const randomString =
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15);
	const fullKey = `qaas_live_${randomString}`;

	return {
		id: crypto.randomUUID(),
		projectId: "mock-project-id",
		name,
		description,
		prefix: fullKey.substring(0, 16), // "qaas_live_a8f9d2"
		suffix: fullKey.slice(-4), // "xyz1"
		fullKey,
		status: "active",
		createdAt: new Date().toISOString(),
		createdBy: "user@example.com",
	};
}

export const mockApiKeys: ApiKey[] = [
	{
		id: "1",
		projectId: "project-1",
		name: "Production Server",
		description: "Used for production job queue operations",
		prefix: "qaas_live_a8f9d2c1",
		suffix: "xyz1",
		status: "active",
		createdAt: "2026-01-03T10:30:00Z",
		lastUsedAt: "2026-01-05T09:15:00Z",
	},
	{
		id: "2",
		projectId: "project-1",
		name: "Staging Environment",
		description: "Testing API integration",
		prefix: "qaas_test_b3c4d5e6",
		suffix: "abc2",
		status: "revoked",
		createdAt: "2025-12-28T14:20:00Z",
		lastUsedAt: "2025-12-30T16:45:00Z",
		revokedAt: "2026-01-02T11:00:00Z",
	},
	{
		id: "3",
		projectId: "project-1",
		name: "Development Local",
		prefix: "qaas_test_c7d8e9f0",
		suffix: "def3",
		status: "active",
		createdAt: "2026-01-01T08:00:00Z",
	},
];
