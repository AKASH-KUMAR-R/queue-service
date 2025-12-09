import { Router } from "express";

import jobWorkerController from "@controllers/job/job.worker.controlller";
import commonController from "@common/controller/common.controller";
import {
	paramsValidationMiddleware,
	validateId,
	validationMiddleware,
} from "@common/middleware/zod.middleware";
import JobCreateRequest from "@models/job/requests/JobCreateRequest";
import JobUpdateRequest from "@models/job/requests/JobUpdateRequest";
import { workerAuthMiddleware } from "@common/middleware/auth.middleware";
import NextJobQueryParams from "@models/job/requests/NextJobQueryParams";

const router = Router();

router.get("/list", workerAuthMiddleware, commonController.list);
router.get("/search", workerAuthMiddleware, commonController.search);
router.get(
	"/next-job",
	workerAuthMiddleware,
	paramsValidationMiddleware(NextJobQueryParams),
	jobWorkerController.getNextJobFromQueue
);
router.get(
	"/:id",
	workerAuthMiddleware,
	validateId,
	jobWorkerController.getJobById
);

router.post(
	"/create",
	workerAuthMiddleware,
	validationMiddleware(JobCreateRequest),
	jobWorkerController.addJobToQueue
);

router.put(
	"/mark-as-completed/:id",
	workerAuthMiddleware,
	validateId,
	jobWorkerController.markAsCompleted
);

router.put(
	"/mark-as-failed/:id",
	workerAuthMiddleware,
	validateId,
	jobWorkerController.markAsFailed
);

router.put(
	"/update/:id",
	workerAuthMiddleware,
	validateId,
	validationMiddleware(JobUpdateRequest),
	jobWorkerController.updateJobById
);
export default router;
