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

const worker = createWorker({
    apiKey: process.env.WORKER_API_KEY || "",
    queueLabel: "email_queue",
    baseUrl: "http://localhost:4000",
    pollingTime: 3000,
    concurrency: 4,
});

const producer = createProducer({
    baseUrl: "http://localhost:4000",
    apiKey: process.env.WORKER_API_KEY || "",
});

const addMockJobs = async () => {
    try {
        for (let i = 1; i <= 5; i++) {
            await producer.addJob("email_queue", {
                payload: {
                    email: `example${i}@example.com`,
                },
            });
            console.log(`Added job ${i}`);
        }
    } catch (err) {
        console.log("Failed to create dummy jobs");
    }
};

addMockJobs();

app.listen(process.env.PORT || 8000, () => {
    console.log("Worker test server is running");

    worker.run(async (payload) => {
        console.log("Processing job:", payload);
        // Simulate job processing
        await new Promise((resolve) => setTimeout(resolve, 10000));
        console.log("Job completed:", payload);
    });
});
