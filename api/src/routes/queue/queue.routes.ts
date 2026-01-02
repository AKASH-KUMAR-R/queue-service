import { Router } from "express";

import commonController from "@common/controller/common.controller";
import {
	queryValidationMiddleware,
	validateId,
	validationMiddleware,
} from "@common/middleware/zod.middleware";

import { QueueCreateRequest } from "@models/queue/requests/QueueCreateRequest";
import { QueueJobsListRequest } from "@models/queue/requests/QueueJobsListRequest";
import { QueueUpdateRequest } from "@models/queue/requests/QueueUpdateRequest";

import queueController from "@controllers/queue/queue.controller";

const router = Router();

router.get("/list", commonController.list);
router.get("/search", commonController.search);
router.get("/:id", validateId, commonController.getById);

router.get(
	"/:id/jobs",
	validateId,
	queryValidationMiddleware(QueueJobsListRequest),
	queueController.getQueueJobs,
);
router.get("/:id/metrics", validateId, queueController.getQueueMetrics);
router.get("/:id/workers", validateId, queueController.getQueueRelatedWorkers);

router.post(
	"/create",
	validationMiddleware(QueueCreateRequest),
	queueController.addQueue,
);

router.put(
	"/:id",
	validateId,
	validationMiddleware(QueueUpdateRequest),
	commonController.update,
);

router.delete("/:id", validateId, commonController.remove);

export default router;
