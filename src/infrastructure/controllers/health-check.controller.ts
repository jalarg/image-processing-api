import { Request, Response, NextFunction } from "express";

export class HealthCheckController {
  public async healthCheck(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json({ status: "OK" });
    } catch (error) {
      return next(error);
    }
  }
}
