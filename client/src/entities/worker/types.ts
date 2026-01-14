export type WorkerStatus = "online" | "offline";

export interface Worker {
	id: string;
	status: WorkerStatus;
	activeJobs: number;
	lastHeartbeat: string;
	queues: string[];
	uptimeHours: number;
	processedTotal: number;
}
