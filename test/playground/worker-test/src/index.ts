import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import { createWorker } from "@qaas/worker-sdk";
import { createProducer } from "@qaas/producer-sdk";

configDotenv();

const app = express();

app.use(
    cors({
        origin: "*",
        credentials: true,
        allowedHeaders: ["x-api-key"],
    }),
);

app.use(express.json());

const WORKER_COUNT = parseInt(process.env.TEST_WORKER_COUNT || "10", 10);
const TEST_QUEUE = process.env.TEST_QUEUE_LABEL || "test-3";
const TEST_JOBS_PER_SEC = parseInt(
    process.env.TEST_JOBS_IN_PER_SEC || "50",
    10,
);
const TEST_PER_JOB_PROCESSING_TIME_MS = parseInt(
    process.env.TEST_PER_JOB_PROCESSING_TIME_MS || "100",
    10,
);
const TEST_TOTAL_JOBS = parseInt(process.env.TEST_TOTAL_JOBS || "1000", 10);
const MAX_INFLIGHT_REQUESTS = parseInt(
    process.env.TEST_MAX_INFLIGHT_REQUESTS || "1000",
    10,
);
const TEST_ESTIMATED_TEST_DURATION_SEC = parseInt(
    process.env.TEST_ESTIMATED_TEST_DURATION_SEC || "300",
    10,
);

const worker = createWorker({
    apiKey: process.env.TEST_WORKER_API_KEY || "",
    queueLabel: TEST_QUEUE,
    baseUrl: "http://localhost:4000",
    pollingTime: 1000,
    concurrency: WORKER_COUNT,
});

const producer = createProducer({
    baseUrl: "http://localhost:4000",
    apiKey: process.env.TEST_WORKER_API_KEY || "",
});

let enqueueIntervalId: NodeJS.Timeout | null = null;

const addMockJobs = async () => {
    try {
        let requestedJobs = 0;

        enqueueIntervalId = setInterval(async () => {
            if (requestedJobs >= TEST_TOTAL_JOBS && enqueueIntervalId) {
                console.log("Finished adding jobs.");
                clearInterval(enqueueIntervalId);
                return;
            }

            if (producer.inflight() > MAX_INFLIGHT_REQUESTS) {
                console.log(
                    "Too many inflight requests, waiting before adding more jobs...",
                );
                return;
            }

            console.log(
                "Starting batch: ",
                requestedJobs / TEST_JOBS_PER_SEC,
                "Inflight requests: ",
                producer.inflight(),
                "Success: ",
                producer.success(),
                "Failed: ",
                producer.failed(),
            );

            for (let i = 1; i <= TEST_JOBS_PER_SEC - producer.inflight(); i++) {
                producer
                    .addJob(TEST_QUEUE, {
                        payload: {
                            email: `example${i}@example.com`,
                            test: "test-10workers-50jobs/sec",
                            batch: requestedJobs / TEST_JOBS_PER_SEC,
                        },
                    })
                    .catch((err) => {
                        console.log(err instanceof Error ? err.message : err);
                    });
                requestedJobs++;
            }
        }, 1000);
    } catch (err) {
        console.log("Failed to create dummy jobs");
    }
};

addMockJobs();

app.listen(process.env.PORT || 8000, () => {
    console.log(
        `Worker test server for queue ${TEST_QUEUE} is running with ${WORKER_COUNT} workers and adding ${TEST_JOBS_PER_SEC} jobs/sec`,
    );

    worker.run(async (payload) => {
        // Simulate job processing
        await new Promise((resolve) =>
            setTimeout(resolve, TEST_PER_JOB_PROCESSING_TIME_MS),
        );
    });

    setInterval(() => {
        const info = worker.info();
        console.log(
            `Worker Info - ID: ${info.workerId}, Queue: ${info.queueLabel}, Concurrency: ${info.concurrency}, Active Jobs: ${info.jobsCount}`,
        );
    }, 10000);

    setTimeout(() => {
        console.log("Stopping worker after test duration");
        clearInterval(enqueueIntervalId!);
        worker.stop();
    }, TEST_ESTIMATED_TEST_DURATION_SEC * 1000);
});
