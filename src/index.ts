// Load environment variables from .env file
import 'dotenv/config';
import express from "express";

// Import module routes
import pipelineRoutes from "./modules/pipelines/pipelines.routes";
import webhookRoutes from "./modules/webhooks/webhooks.routes";
import subscribersRoutes from "./modules/subscribers/subscribers.routes";
import jobsRoutes from "./modules/jobs/jobs.routes";

const app = express();

console.log("Starting Webhook Pipeline Service...");

// Middleware to parse incoming JSON requests
app.use(express.json());

// Health check / root endpoint
app.get("/", (_req, res) => {
  res.send("Webhook Pipeline Service Running");
});

// Mount module routes
app.use("/api/pipelines", pipelineRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/subscribers", subscribersRoutes); // NEW
app.use("/api/jobs", jobsRoutes);               // NEW

app.use("/api/pipelines/:pipelineId/subscribers", subscribersRoutes);

// Global error handler middleware
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Use PORT from environment or fallback to 3000
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Optional: initialize worker if you want it to run in same process
// import { processJobs } from "./worker/worker";
// setInterval(processJobs, 3000);  // every 3 seconds

app.post("/mock-subscriber", (req, res) => {
  console.log("Mock subscriber received payload:", req.body);
  res.status(200).json({ received: true });
});

export default app;