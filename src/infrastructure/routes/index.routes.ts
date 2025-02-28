import { Router } from "express";
import healthRoutes from "./health.routes";
import taskRoutes from "./task.routes";
import { TaskRepository } from "../../domain/task.repository";
import { ProcessImageUseCase } from "../../application/use-cases";

export default function createRouter(
  taskRepository: TaskRepository,
  processImageUseCase: ProcessImageUseCase
) {
  const router = Router();

  router.use("/health", healthRoutes);
  router.use("/tasks", taskRoutes(taskRepository, processImageUseCase));

  return router;
}
