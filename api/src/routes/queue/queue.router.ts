import { Router } from "express";
import { addQueue } from "../../controllers/queue/queue.controller";
const router = Router();

router.post("/create", addQueue);

export default router;
