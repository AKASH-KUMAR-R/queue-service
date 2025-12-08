import { Router } from "express";

import jobWorkerController from "@controllers/job/job.worker.controlller";
import commonController from "@common/controller/common.controller";
import {
	validateId,
	validationMiddleware,
} from "@common/middleware/zod.middleware";
import JobCreateRequest from "@models/job/requests/JobCreateRequest";
import JobUpdateRequest from "@models/job/requests/JobUpdateRequest";
import { workerAuthMiddleware } from "@common/middleware/auth.middleware";

const router = Router();

router.get("/list", workerAuthMiddleware, commonController.list);
router.get("/search", workerAuthMiddleware, commonController.search);
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
	"/update/:id",
	workerAuthMiddleware,
	validateId,
	validationMiddleware(JobUpdateRequest),
	jobWorkerController.updateJobById
);

export default router;
