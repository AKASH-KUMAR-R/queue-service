import { Router } from "express";

import commonController from "@common/controller/common.controller";
import { authMiddleware } from "@common/middleware/auth.middleware";
import {
	validateId,
	validationMiddleware,
} from "@common/middleware/zod.middleware";

import ApiKeyCreateRequest from "@models/api-key/requests/ApiKeyCreateRequest";

import apiKeyController from "@controllers/api-key/apiKey.controller";

const router = Router();

router.get("/search", authMiddleware, commonController.search);
router.get("/:id", authMiddleware, validateId, commonController.getById);

router.put("/revoke/:id", authMiddleware, validateId, apiKeyController.revoke);

router.post(
	"/create",
	authMiddleware,
	validationMiddleware(ApiKeyCreateRequest),
	apiKeyController.create,
);

export default router;
