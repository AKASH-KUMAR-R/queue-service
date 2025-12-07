import { Router } from "express";

import jobWorkerController from "@controllers/job/job.worker.controlller";
import commonController from "@common/controller/common.controller";
import {
	validateId,
	validationMiddleware,
} from "@common/middleware/zod.middleware";
import JobCreateRequest from "@models/job/requests/JobCreateRequest";
import JobUpdateRequest from "@models/job/requests/JobUpdateRequest";

const router = Router();

router.get("/list", commonController.list);
router.get("/search", commonController.search);
router.get("/:id", validateId, jobWorkerController.getJobById);

router.post(
	"/add-job",
	validationMiddleware(JobCreateRequest),
	jobWorkerController.addJobToQueue
);
router.put(
	"/:id",
	validateId,
	validationMiddleware(JobUpdateRequest),
	jobWorkerController.updateJobById
);

export default router;
