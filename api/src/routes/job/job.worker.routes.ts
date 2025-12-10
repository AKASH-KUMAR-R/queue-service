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

const router = Router();

router.get("/list", workerAuthMiddleware, commonController.list);
router.get("/search", workerAuthMiddleware, commonController.search);
router.get(
	"/next-job",
	workerAuthMiddleware,
	queryValidationMiddleware(NextJobQueryParams),
	jobWorkerController.getNextJobFromQueue,
);
router.get(
	"/:id",
	workerAuthMiddleware,
	validateId,
	jobWorkerController.getJobById,
);

router.post(
	"/create",
	workerAuthMiddleware,
	validationMiddleware(JobCreateRequest),
	jobWorkerController.addJobToQueue,
);

router.put(
	"/mark-as-completed/:id",
	workerAuthMiddleware,
	validateId,
	jobWorkerController.markAsCompleted,
);

router.put(
	"/mark-as-failed/:id",
	workerAuthMiddleware,
	validateId,
	jobWorkerController.markAsFailed,
);

router.put(
	"/update/:id",
	workerAuthMiddleware,
	validateId,
	validationMiddleware(JobUpdateRequest),
	jobWorkerController.updateJobById,
);
export default router;
