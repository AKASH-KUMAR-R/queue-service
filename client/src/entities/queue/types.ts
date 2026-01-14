export type QueueStatus = "active" | "paused" | "disabled";

export interface Queue {
	id: string;
	name: string;
	status: QueueStatus;
	pending: number;
	inProgress: number;
	failed: number;
	rateLimit: string;
	lastProcessed: string;
}
