export type WorkerOptions = {
	baseUrl: string;
	apiKey: string;
	queueLabel: string;
	pollingTime?: number;
};

export type Job = {
	id: string;
	queue_id: string;
	payload: any;
	attempts: number;
	status: JobStatus;
};

export enum JobStatus {
	IN_PROGRESS,
	PENDING,
	COMPLETED,
	FAILED,
}
