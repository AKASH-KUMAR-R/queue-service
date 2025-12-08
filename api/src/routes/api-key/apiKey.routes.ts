import { Router } from "express";

import commonController from "@common/controller/common.controller";
import {
	validateId,
	validationMiddleware,
} from "@common/middleware/zod.middleware";
import apiKeyController from "@controllers/api-key/apiKey.controller";
import ApiKeyCreateRequest from "@models/api-key/requests/ApiKeyCreateRequest";

const router = Router();

router.get("/list", commonController.list);
router.get("/:id", validateId, commonController.getById);

router.put("/revoke/:id", validateId, apiKeyController.revoke);

router.post(
	"/create",
	validationMiddleware(ApiKeyCreateRequest),
	apiKeyController.create
);

export default router;
