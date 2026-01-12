import { Router } from "express";

import commonController from "@common/controller/common.controller";
import { authMiddleware } from "@common/middleware/auth.middleware";
import {
	validateId,
	validationMiddleware,
} from "@common/middleware/zod.middleware";

import { ProjectCreateRequest } from "@models/project/requests/ProjectCreateRequest";
import { ProjectUpdateRequest } from "@models/project/requests/ProjectUpdateRequest";

import projectController from "@controllers/project/project.controller";

const router = Router();

router.get("/list", authMiddleware, commonController.list);
router.get("/search", authMiddleware, commonController.search);
router.get("/:id", authMiddleware, validateId, commonController.getById);

router.post(
	"/create",
	authMiddleware,
	validationMiddleware(ProjectCreateRequest),
	projectController.createProject,
);
router.put(
	"/:id",
	authMiddleware,
	validateId,
	validationMiddleware(ProjectUpdateRequest),
	commonController.update,
);
router.delete("/:id", authMiddleware, validateId, commonController.remove);

export default router;
