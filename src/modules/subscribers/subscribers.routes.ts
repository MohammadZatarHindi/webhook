import { Router } from "express";
import {
  addSubscriberHandler,
  listSubscribersHandler,
  removeSubscriberHandler,
} from "./subscribers.controller";

const router = Router({ mergeParams: true }); // important for :pipelineId param

router.post("/", addSubscriberHandler);
router.get("/", listSubscribersHandler);
router.delete("/:subscriberId", removeSubscriberHandler);

export default router;