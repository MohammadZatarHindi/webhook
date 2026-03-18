import { Router } from "express";
import { receiveWebhookHandler } from "./webhooks.controller";

const router = Router();

/**
 * POST /api/webhooks
 * Receives webhook events from external systems
 * Validates input and delegates to service layer
 */
router.post("/", receiveWebhookHandler);

export default router;