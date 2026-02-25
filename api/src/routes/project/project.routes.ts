import { Router } from "express";

import passport from "@config/passport.config";

import commonController from "@common/controller/common.controller";
import { attachPrismaContext } from "@common/middleware/prisma.middleware";
import {
	validateId,
	validationMiddleware,
} from "@common/middleware/zod.middleware";

import { ProjectCreateRequest } from "@models/project/requests/ProjectCreateRequest";
import { ProjectUpdateRequest } from "@models/project/requests/ProjectUpdateRequest";

import projectController from "@controllers/project/project.controller";

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
	commonController.search,
);
router.get(
	"/:id",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	validateId,
	commonController.getById,
);

router.post(
	"/create",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	validationMiddleware(ProjectCreateRequest),
	projectController.createProject,
);
router.put(
	"/:id",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	validateId,
	validationMiddleware(ProjectUpdateRequest),
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
