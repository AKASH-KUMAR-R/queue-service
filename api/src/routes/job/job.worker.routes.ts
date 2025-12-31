import { Router } from "express";

import commonController from "@common/controller/common.controller";
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

import jobRateLimiter, { extractWorkerId } from "./job.middleware";

const router = Router();

router.get("/list", workerAuthMiddleware, commonController.list);
router.get("/search", workerAuthMiddleware, commonController.search);
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
	extractWorkerId,
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
