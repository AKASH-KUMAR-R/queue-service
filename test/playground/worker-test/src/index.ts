import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import { createWorker } from "@qaas/worker-sdk";

configDotenv();

const app = express();

app.use(
	cors({
		origin: "*",
		credentials: true,
		allowedHeaders: ["x-api-key"],
	})
);

app.use(express.json());

const worker = createWorker({
	apiKey: process.env.WORKER_API_KEY || "",
	queue_label: "email_queue",
	baseUrl: "http://localhost:4000",
});

app.listen(process.env.PORT || 8000, () => {
	console.log("Worker test server is running");

	worker.run(async (payload) => {
		console.log("Processing job:", payload);
		// Simulate job processing
		await new Promise((resolve) => setTimeout(resolve, 2000));
		console.log("Job completed:", payload);
	});
});
