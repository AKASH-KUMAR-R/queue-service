import { Router } from "express";

import commonController from "@common/controller/common.controller";
import { authMiddleware } from "@common/middleware/auth.middleware";

const router = Router();

router.get("/search", authMiddleware, commonController.search);

export default router;
