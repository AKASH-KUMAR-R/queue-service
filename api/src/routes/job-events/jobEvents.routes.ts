import { Router } from "express";

import commonController from "@common/controller/common.controller";
import { authMiddleware } from "@common/middleware/auth.middleware";

const router = Router();

// TODO: Add auth middleware after implementing auth routes
router.get("/list", authMiddleware, commonController.list);
router.get("/search", authMiddleware, commonController.search);
router.get("/:id", authMiddleware, commonController.getById);

export default router;
