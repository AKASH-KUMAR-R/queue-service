import { Router } from "express";

import commonController from "@common/controller/common.controller";

const router = Router();

router.get("/search", commonController.search);

export default router;
