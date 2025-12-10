import { Router } from "express";

import commonController from "@common/controller/common.controller";
import {
	validateId,
	validationMiddleware,
} from "@common/middleware/zod.middleware";

import { UserCreateRequest } from "@models/user/requests/UserCreateRequest";
import { UserUpdateRequest } from "@models/user/requests/UserUpdateRequest";

const router = Router();

router.get("/list", commonController.list);
router.get("/search", commonController.search);
router.get("/:id", validateId, commonController.getById);

router.post(
	"/create",
	validationMiddleware(UserCreateRequest),
	commonController.upsert,
);
router.put(
	"/:id",
	validateId,
	validationMiddleware(UserUpdateRequest),
	commonController.update,
);

router.delete("/:id", validateId, commonController.remove);

export default router;
