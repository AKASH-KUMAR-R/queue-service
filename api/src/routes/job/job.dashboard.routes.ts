import { Router } from "express";

import commonController from "@common/controller/common.controller";
import { validateId } from "@common/middleware/zod.middleware";

import jobDashboardController from "@controllers/job/job.dashboard.controller";

const router = Router();

router.get("/list", commonController.list);
router.get("/search", commonController.search);

router.get("/:id/events", validateId, jobDashboardController.getJobEvents);

export default router;
