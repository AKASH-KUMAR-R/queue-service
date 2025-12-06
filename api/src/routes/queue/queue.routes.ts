import { Router } from "express";
import commonController from "../../common/controller/common.controller";

const router = Router();

router.get("/list", commonController.list);
router.get("/search", commonController.search);
router.get("/:id", commonController.getById);

router.post("/create", commonController.upsert);
router.put("/:id", commonController.update);

router.delete("/:id", commonController.remove);

export default router;
