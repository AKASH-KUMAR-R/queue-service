import type { NextFunction, Request, Response } from "express";

import queueRateLimiterService from "@services/queue-limit/queueRateLimiter.service";
import queueService from "@services/queue/queue.service";

import { handleError } from "@utils/error.util";
import { logger } from "@utils/logger.util";

const jobRateLimiter = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const queueLabel = req.query.queue_label?.toString() || "";

		logger.info(`Within job rate limiter. ${queueLabel}`);

		const queue = await queueService.findByLabelWithQueueLimiter(
			req.db,
			queueLabel,
		);

		const queueRateLimit = queue?.queueRateLimiter;

		const now = new Date();

		if (!queue || !queueRateLimit) {
			logger.info("No queue rate limiter found");
			return next();
		}

		if (!queue.rate_limit_window_ms || !queue.rate_limit_count) {
			logger.info("No queue rate limiter config found");
			return next();
		}

		if (
			!queueRateLimit.last_reset_at ||
			now.getTime() >
				queueRateLimit.last_reset_at.getTime() +
					queue.rate_limit_window_ms
		) {
			logger.info("Job rate limiter entry expired");
			await queueRateLimiterService.queueRateLimitExpired(
				req.db,
				queueRateLimit.id,
			);
		} else if (queueRateLimit.job_count >= queue.rate_limit_count) {
			return handleError(
				res,
				new Error(
					"Rate limit exceeded for this queue. Please try again later",
				),
				429,
			);
		}

		next();
	} catch (err) {
		handleError(res, err);
	}
};

export const extractWorkerId = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const workerId = req.headers["x-worker-id"] as string;

	if (!workerId) {
		return handleError(res, "X-Worker-Id is required", 400);
	}

	req.worker_id = workerId;

	next();
};
export default jobRateLimiter;
