import { AxiosError } from "axios";

import getApiClient from "../config/axios.config";
import type { Job, WorkerOptions } from "../types/worker";
import { wait } from "../utils/run.util";

import { logger } from "../config/logger.config";
import handleError from "../utils/error.util";

export default function createWorker(options: WorkerOptions) {
	const api = getApiClient({
		baseURL: options.baseUrl,
		apiKey: options.apiKey,
	});

	let isShuttingDown = false;

	async function findNextJob() {
		const res = await api.get(
			`/api/worker/job/next-job?queue_label=${options.queueLabel}`
		);

		logger.info("Fetched next job:", { data: res.data });
		return res.data.data || null;
	}

	async function heartBeat(jobId: string) {
		logger.info("Sending heartbeat for job:", { jobId });
		const res = await api.put(`/api/worker/job/heartbeat/${jobId}`);
		return res;
	}

	async function jobFailed(jobId: string) {
		const res = await api.put(`/api/worker/job/mark-as-failed/${jobId}`);

		logger.info("Marked job as failed:", { jobId });
		return res.data || null;
	}

	async function jobCompleted(jobId: string) {
		const res = await api.put(`/api/worker/job/mark-as-completed/${jobId}`);

		logger.info("Marked job as completed:", { jobId });
		return res.data || null;
	}

	async function runJob(job: Job, handler: (payload: any) => Promise<void>) {
		let intervalId: NodeJS.Timeout | undefined;
		let cancelJob = false;

		try {
			intervalId = setInterval(async () => {
				try {
					const res = await heartBeat(job.id);

					const jobStatus = res.data;

					if (jobStatus.shouldStop) {
						cancelJob = true;
					}
				} catch (err) {
					if (err instanceof AxiosError) {
						if (err.response?.status === 409) {
							cancelJob = true;
							return;
						}
					}
					handleError(err);
				}
			}, 4000);

			await handler(job.payload);

			if (cancelJob) {
				throw new Error("Job was cancelled during execution.");
			}

			await jobCompleted(job.id);
		} catch (err) {
			handleError(err);
			await jobFailed(job.id);
		} finally {
			if (intervalId) {
				clearInterval(intervalId);
			}
		}
	}

	function stop() {
		logger.info("Gracefully shutting down worker...");
		isShuttingDown = true;
	}

	async function run(handler: (payload: any) => Promise<void>) {
		logger.info(`Worker started for queue: ${options.queueLabel}`);

		// Setup signal handlers for graceful shutdown
		const signalHandler = () => {
			stop();
		};
		process.on("SIGTERM", signalHandler);
		process.on("SIGINT", signalHandler);

		while (!isShuttingDown) {
			let nextJob: Job | null = null;

			try {
				nextJob = await findNextJob();
			} catch (err) {
				handleError(err);
			}

			if (!nextJob) {
				logger.info("Worker found no job, waiting...");
				await wait(options.pollingTime || 1000);
				continue;
			}

			await runJob(nextJob, handler);
		}

		// Cleanup signal handlers
		process.off("SIGTERM", signalHandler);
		process.off("SIGINT", signalHandler);

		logger.info("Worker shutdown complete");
	}

	return {
		run,
		stop,
	};
}
