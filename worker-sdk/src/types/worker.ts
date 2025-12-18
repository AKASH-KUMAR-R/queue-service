export type WorkerOptions = {
    baseUrl: string;
    apiKey: string;
    queueLabel: string;
    pollingTime?: number;
    concurrency?: number;
};

export type Job = {
    id: string;
    queue_id: string;
    payload: any;
    attempts: number;
    status: JobStatus;
    priority?: number;
    scheduled_at?: Date;

    created_at: Date;
    updated_at: Date;
};

export enum JobStatus {
    IN_PROGRESS,
    PENDING,
    COMPLETED,
    FAILED,
}

export type JobHandlerFunc = (
    payload: any,
    cancelledCallbackFunc?: () => boolean
) => Promise<void>;
