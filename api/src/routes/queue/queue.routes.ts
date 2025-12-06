import { Router } from "express";
import commonController from "../../common/controller/common.controller";

const router = Router();

router.get("/:id", commonController.getById);
router.get("/list", commonController.list);
router.get("/search", commonController.search);

router.post("/create", commonController.upsert);
router.put("/:id", commonController.upsert);

router.delete("/:id", commonController.remove);

export default router;
