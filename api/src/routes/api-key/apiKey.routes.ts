import { Router } from "express";

import passport from "@config/passport.config";

import commonController from "@common/controller/common.controller";
import { attachPrismaContext } from "@common/middleware/prisma.middleware";
import {
	queryValidationMiddleware,
	validateId,
	validationMiddleware,
} from "@common/middleware/zod.middleware";

import ApiKeyCreateRequest from "@models/api-key/requests/ApiKeyCreateRequest";
import ApiKeySearchRequest from "@models/api-key/requests/ApiKeySearchRequest";

import apiKeyController from "@controllers/api-key/apiKey.controller";

const router = Router();

router.get(
	"/search",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	queryValidationMiddleware(ApiKeySearchRequest),
	apiKeyController.search,
);
router.get(
	"/:id",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	validateId,
	commonController.getById,
);

router.put(
	"/revoke/:id",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	validateId,
	apiKeyController.revoke,
);

router.post(
	"/create",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	validationMiddleware(ApiKeyCreateRequest),
	apiKeyController.create,
);

export default router;
