import { Router } from "express";

import commonController from "@common/controller/common.controller";
import { authMiddleware } from "@common/middleware/auth.middleware";
import {
	validateId,
	validationMiddleware,
} from "@common/middleware/zod.middleware";

import { UserUpdateRequest } from "@models/user/requests/UserUpdateRequest";

import userController from "@controllers/user/user.controller";

const router = Router();

router.get("/list", authMiddleware, commonController.list);
router.get("/search", authMiddleware, commonController.search);
router.get("/current-user", authMiddleware, userController.getCurrentUser);
router.get("/:id", authMiddleware, validateId, commonController.getById);

router.put(
	"/:id",
	authMiddleware,
	validateId,
	validationMiddleware(UserUpdateRequest),
	commonController.update,
);

router.delete("/:id", authMiddleware, validateId, commonController.remove);
export default router;
