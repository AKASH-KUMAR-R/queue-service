import { Router } from "express";

import commonController from "@common/controller/common.controller";
import { authMiddleware } from "@common/middleware/auth.middleware";
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

router.get("/list", authMiddleware, commonController.list);
router.get("/search", authMiddleware, commonController.search);
router.get("/:id", authMiddleware, validateId, commonController.getById);

router.get(
	"/:id/jobs",
	authMiddleware,
	validateId,
	queryValidationMiddleware(QueueJobsListRequest),
	queueController.getQueueJobs,
);
router.get(
	"/:id/metrics",
	authMiddleware,
	validateId,
	queueController.getQueueMetrics,
);
router.get(
	"/:id/workers",
	authMiddleware,
	validateId,
	queueController.getQueueRelatedWorkers,
);
router.post(
	"/create",
	authMiddleware,
	validationMiddleware(QueueCreateRequest),
	queueController.addQueue,
);

router.put(
	"/:id",
	authMiddleware,
	validateId,
	validationMiddleware(QueueUpdateRequest),
	commonController.update,
);

router.delete("/:id", authMiddleware, validateId, commonController.remove);

export default router;
