import { Router } from "express";
import commonController from "../../common/controller/common.controller";

const router = Router();

router.get("/:id", commonController.getById);

router.post("/list", commonController.list);
router.post("/search", commonController.search);

router.post("/", commonController.upsert);
router.put("/:id", commonController.update);
router.delete("/:id", commonController.remove);

export default router;
