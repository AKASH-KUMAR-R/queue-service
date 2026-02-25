import { Router } from "express";

import passport from "@config/passport.config";

import commonController from "@common/controller/common.controller";
import { attachPrismaContext } from "@common/middleware/prisma.middleware";
import { queryValidationMiddleware } from "@common/middleware/zod.middleware";

import WorkerCompletedListRequest from "@models/worker-status/requests/WorkerCompletedJobsListRequest";
import WorkerStatusSearchRequest from "@models/worker-status/requests/WorkerStatusSearchRequest";

import workerStatueController from "@controllers/worker-status/wokerStatus.controller";

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
	queryValidationMiddleware(WorkerStatusSearchRequest),
	commonController.search,
);

router.get(
	"/:id/completed-jobs",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	queryValidationMiddleware(WorkerCompletedListRequest),
	workerStatueController.getJobsByWorker,
);

router.get(
	"/:id",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	commonController.getById,
);

export default router;
