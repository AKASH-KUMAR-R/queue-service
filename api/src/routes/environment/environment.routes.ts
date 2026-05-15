import { Router } from "express";

import passport from "@config/passport.config";

import { attachPrismaContext } from "@common/middleware/prisma.middleware";
import {
	queryValidationMiddleware,
	validateId,
	validationMiddleware,
} from "@common/middleware/zod.middleware";

import { EnvironmentCreateRequest } from "@models/environment/requests/EnvironmentCreateRequest";
import { EnvironmentSearchRequest } from "@models/environment/requests/EnvironmentSearchRequest";
import { EnvironmentUpdateRequest } from "@models/environment/requests/EnvironmentUpdateRequest";

import environmentController from "@controllers/environment/environment.controller";

const router = Router();

router.get(
	"/search",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	queryValidationMiddleware(EnvironmentSearchRequest),
	environmentController.searchEnvironments,
);

router.get(
	"/:id",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	validateId,
	environmentController.getEnvironmentById,
);

router.post(
	"/create",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	validationMiddleware(EnvironmentCreateRequest),
	environmentController.createEnvironment,
);

router.put(
	"/:id",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	validateId,
	validationMiddleware(EnvironmentUpdateRequest),
	environmentController.updateEnvironment,
);

router.put(
	"/:id/default",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	validateId,
	environmentController.setDefaultEnvironment,
);

router.delete(
	"/:id",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	validateId,
	environmentController.deleteEnvironment,
);

export default router;
