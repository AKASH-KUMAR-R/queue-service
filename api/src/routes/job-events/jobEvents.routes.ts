import { Router } from "express";

import commonController from "@common/controller/common.controller";

const router = Router();

// TODO: Add auth middleware after implementing auth routes
router.get("/list", commonController.list);
router.get("/search", commonController.search);
router.get("/:id", commonController.getById);

export default router;
