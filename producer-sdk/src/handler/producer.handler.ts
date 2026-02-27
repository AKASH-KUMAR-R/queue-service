import getApiClient from "../config/axios.config";
import { logger } from "../config/logger.config";
import { AddJobOptions, ProducerOptions } from "../types/producer";
import handleError from "../utils/error.util";
import { generateProducerId } from "../utils/producer.util";

export default function createProducer(options: ProducerOptions) {
    const producerId = generateProducerId(
        options.metaData?.label || "producer",
    );

    const client = getApiClient({
        apiKey: options.apiKey,
        baseURL: options.baseUrl,
        producerId,
    });

    async function addJob(queueLabel: string, options: AddJobOptions) {
        try {
            const res = await client.post("/api/worker/job/create", {
                ...options,
                queue_label: queueLabel,
            });

            logger.info(`Job added to ${queueLabel}`);
            return res.data;
        } catch (err) {
            handleError(err);
            throw err;
        }
    }

    return {
        addJob,
    };
}
