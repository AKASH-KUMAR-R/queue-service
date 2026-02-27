export type ProducerOptions = {
    baseUrl: string;
    apiKey: string;
    metaData?: Record<string, any>;
};

export type AddJobOptions = {
    payload: Record<string, any>;
    timeout_ms?: number;
    priority?: number;
    scheduled_at?: Date;
};
