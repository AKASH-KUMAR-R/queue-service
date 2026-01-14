export interface CreateQueueFormData {
	name: string;
	description: string;
	rateLimit: number;
	rateLimitUnit: "second" | "minute" | "hour";
	maxAttempts: number;
	timeout: number;
	retryDelay: number;
	priority: number;
}
