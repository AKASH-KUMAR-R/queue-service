import { Router } from "express";
import commonController from "@common/controller/common.controller";
import {
	validateId,
	validationMiddleware,
} from "@common/middleware/zod.middleware";
import { ProjectCreateRequest } from "@models/project/requests/ProjectCreateRequest";
import { ProjectUpdateRequest } from "@models/project/requests/ProjectUpdateRequest";

const router = Router();

router.get("/list", commonController.list);
router.get("/search", commonController.search);
router.get("/:id", validateId, commonController.getById);

router.post(
	"/create",
	validationMiddleware(ProjectCreateRequest),
	commonController.upsert
);
router.put(
	"/:id",
	validateId,
	validationMiddleware(ProjectUpdateRequest),
	commonController.upsert
);
router.delete("/:id", validateId, commonController.remove);

export default router;
