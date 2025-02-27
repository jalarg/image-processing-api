import { Router, Request, Response, NextFunction } from "express";
import { HealthCheckController } from "../controllers/health-check.controller";

const router = Router();
const healthCheckController = new HealthCheckController();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  await healthCheckController.healthCheck(req, res, next);
});

export default router;
