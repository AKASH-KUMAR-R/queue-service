import { Router } from "express";

import commonController from "@common/controller/common.controller";
import { authMiddleware } from "@common/middleware/auth.middleware";
import {
	queryValidationMiddleware,
	validateId,
} from "@common/middleware/zod.middleware";

import { JobEventsListRequest } from "@models/job/requests/JobEventsListRequest";

import jobDashboardController from "@controllers/job/job.dashboard.controller";

const router = Router();

router.get("/list", authMiddleware, commonController.list);
router.get("/search", authMiddleware, commonController.search);
router.get("/:id", authMiddleware, validateId, commonController.getById);

router.get(
	"/:id/events",
	authMiddleware,
	validateId,
	queryValidationMiddleware(JobEventsListRequest),
	jobDashboardController.getJobEvents,
);

export default router;
