import { Router } from "express";

import passport from "@config/passport.config";

import {
	queryValidationMiddleware,
	validateId,
	validationMiddleware,
} from "@common/middleware/zod.middleware";

import JobCreateRequest from "@models/job/requests/JobCreateRequest";
import JobUpdateRequest from "@models/job/requests/JobUpdateRequest";
import NextJobQueryParams from "@models/job/requests/NextJobQueryParams";

import jobWorkerController from "@controllers/job/job.worker.controlller";

import { extractProducerId, extractWorkerId } from "./job.middleware";

const router = Router();

router.get(
	"/next-job",
	passport.authenticate("api-key", {
		session: false,
		assignProperty: "project",
	}),
	queryValidationMiddleware(NextJobQueryParams),
	extractWorkerId,
	jobWorkerController.getNextJobFromQueue,
);
router.get(
	"/:id",
	passport.authenticate("api-key", {
		session: false,
		assignProperty: "project",
	}),
	validateId,
	extractWorkerId,
	jobWorkerController.getJobById,
);

router.post(
	"/create",
	passport.authenticate("api-key", {
		session: false,
		assignProperty: "project",
	}),
	validationMiddleware(JobCreateRequest),
	extractProducerId,
	jobWorkerController.addJobToQueue,
);

router.put(
	"/mark-as-completed/:id",
	passport.authenticate("api-key", {
		session: false,
		assignProperty: "project",
	}),
	validateId,
	extractWorkerId,
	jobWorkerController.markAsCompleted,
);

router.put(
	"/mark-as-failed/:id",
	passport.authenticate("api-key", {
		session: false,
		assignProperty: "project",
	}),
	validateId,
	extractWorkerId,
	jobWorkerController.markAsFailed,
);

router.put(
	"/heartbeat/:id",
	passport.authenticate("api-key", {
		session: false,
		assignProperty: "project",
	}),
	validateId,
	extractWorkerId,
	jobWorkerController.heartBeatCheck,
);

router.put(
	"/update/:id",
	passport.authenticate("api-key", {
		session: false,
		assignProperty: "project",
	}),
	validateId,
	extractWorkerId,
	validationMiddleware(JobUpdateRequest),
	jobWorkerController.updateJobById,
);
export default router;
