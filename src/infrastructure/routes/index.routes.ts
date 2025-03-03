import { Router } from "express";
import healthRoutes from "./health.routes";
import taskRoutes from "./task.routes";
import { TaskRepository } from "../../domain/repositories/task.repository";

export default function createRouter(taskRepository: TaskRepository) {
  const router = Router();

  router.use("/health", healthRoutes);
  router.use("/tasks", taskRoutes(taskRepository));

  return router;
}
