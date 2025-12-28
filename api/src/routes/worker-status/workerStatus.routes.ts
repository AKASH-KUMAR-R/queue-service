import { Router } from "express";

import commonController from "@common/controller/common.controller";

const router = Router();

router.get("/list", commonController.list);

export default router;
