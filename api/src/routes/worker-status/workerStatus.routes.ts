import { Router } from "express";

import commonController from "@common/controller/common.controller";
import { authMiddleware } from "@common/middleware/auth.middleware";
import { queryValidationMiddleware } from "@common/middleware/zod.middleware";

import WorkerCompletedListRequest from "@models/worker-status/requests/WorkerCompletedJobsListRequest";
import WorkerStatusSearchRequest from "@models/worker-status/requests/WorkerStatusSearchRequest";

import workerStatueController from "@controllers/worker-status/wokerStatus.controller";

const router = Router();

router.get("/list", authMiddleware, commonController.list);
router.get(
	"/search",
	authMiddleware,
	queryValidationMiddleware(WorkerStatusSearchRequest),
	commonController.search,
);

router.get(
	"/:id/completed-jobs",
	authMiddleware,
	queryValidationMiddleware(WorkerCompletedListRequest),
	workerStatueController.getJobsByWorker,
);

router.get("/:id", authMiddleware, commonController.getById);

export default router;
