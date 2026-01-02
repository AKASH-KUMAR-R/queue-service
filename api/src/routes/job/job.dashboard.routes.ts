import { Router } from "express";

import commonController from "@common/controller/common.controller";
import {
	queryValidationMiddleware,
	validateId,
} from "@common/middleware/zod.middleware";

import { JobEventsListRequest } from "@models/job/requests/JobEventsListRequest";

import jobDashboardController from "@controllers/job/job.dashboard.controller";

const router = Router();

router.get("/list", commonController.list);
router.get("/search", commonController.search);

router.get(
	"/:id/events",
	validateId,
	queryValidationMiddleware(JobEventsListRequest),
	jobDashboardController.getJobEvents,
);

export default router;
