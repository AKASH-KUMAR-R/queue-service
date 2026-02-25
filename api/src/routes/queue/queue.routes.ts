import { Router } from "express";

import passport from "@config/passport.config";

import commonController from "@common/controller/common.controller";
import { attachPrismaContext } from "@common/middleware/prisma.middleware";
import {
	queryValidationMiddleware,
	validateId,
	validationMiddleware,
} from "@common/middleware/zod.middleware";

import { QueueCreateRequest } from "@models/queue/requests/QueueCreateRequest";
import { QueueJobsListRequest } from "@models/queue/requests/QueueJobsListRequest";
import { QueueSearchRequest } from "@models/queue/requests/QueueSearchRequest";
import { QueueUpdateRequest } from "@models/queue/requests/QueueUpdateRequest";

import queueController from "@controllers/queue/queue.controller";

const router = Router();

router.get(
	"/list",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	commonController.list,
);
router.get(
	"/search",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	queryValidationMiddleware(QueueSearchRequest),
	queueController.searchQueues,
);
router.get(
	"/:id",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	validateId,
	commonController.getById,
);

router.get(
	"/:id/jobs",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	validateId,
	queryValidationMiddleware(QueueJobsListRequest),
	queueController.getQueueJobs,
);
router.get(
	"/:id/metrics",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	validateId,
	queueController.getQueueMetrics,
);
router.get(
	"/:id/workers",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	validateId,
	queueController.getQueueRelatedWorkers,
);
router.post(
	"/create",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	validationMiddleware(QueueCreateRequest),
	queueController.addQueue,
);

router.put(
	"/:id",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	validateId,
	validationMiddleware(QueueUpdateRequest),
	commonController.update,
);

router.delete(
	"/:id",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	validateId,
	commonController.remove,
);

export default router;
