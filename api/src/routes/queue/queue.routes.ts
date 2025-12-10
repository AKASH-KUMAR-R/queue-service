import { Router } from "express";

import commonController from "@common/controller/common.controller";
import {
	validateId,
	validationMiddleware,
} from "@common/middleware/zod.middleware";

import { QueueCreateRequest } from "@models/queue/requests/QueueCreateRequest";
import { QueueUpdateRequest } from "@models/queue/requests/QueueUpdateRequest";

const router = Router();

router.get("/list", commonController.list);
router.get("/search", commonController.search);
router.get("/:id", validateId, commonController.getById);

router.post(
	"/create",
	validationMiddleware(QueueCreateRequest),
	commonController.upsert,
);
router.put(
	"/:id",
	validateId,
	validationMiddleware(QueueUpdateRequest),
	commonController.update,
);

router.delete("/:id", validateId, commonController.remove);

export default router;
