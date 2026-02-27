import { Router } from "express";

import { workerAuthMiddleware } from "@common/middleware/auth.middleware";
import {
	queryValidationMiddleware,
	validateId,
	validationMiddleware,
} from "@common/middleware/zod.middleware";

import JobCreateRequest from "@models/job/requests/JobCreateRequest";
import JobUpdateRequest from "@models/job/requests/JobUpdateRequest";
import NextJobQueryParams from "@models/job/requests/NextJobQueryParams";

import jobWorkerController from "@controllers/job/job.worker.controlller";

import jobRateLimiter, {
	extractProducerId,
	extractWorkerId,
} from "./job.middleware";

const router = Router();

router.get(
	"/next-job",
	workerAuthMiddleware,
	queryValidationMiddleware(NextJobQueryParams),
	jobRateLimiter,
	extractWorkerId,
	jobWorkerController.getNextJobFromQueue,
);
router.get(
	"/:id",
	workerAuthMiddleware,
	validateId,
	extractWorkerId,
	jobWorkerController.getJobById,
);

router.post(
	"/create",
	workerAuthMiddleware,
	validationMiddleware(JobCreateRequest),
	extractProducerId,
	jobWorkerController.addJobToQueue,
);

router.put(
	"/mark-as-completed/:id",
	workerAuthMiddleware,
	validateId,
	extractWorkerId,
	jobWorkerController.markAsCompleted,
);

router.put(
	"/mark-as-failed/:id",
	workerAuthMiddleware,
	validateId,
	extractWorkerId,
	jobWorkerController.markAsFailed,
);

router.put(
	"/heartbeat/:id",
	workerAuthMiddleware,
	validateId,
	extractWorkerId,
	jobWorkerController.heartBeatCheck,
);

router.put(
	"/update/:id",
	workerAuthMiddleware,
	validateId,
	extractWorkerId,
	validationMiddleware(JobUpdateRequest),
	jobWorkerController.updateJobById,
);
export default router;
