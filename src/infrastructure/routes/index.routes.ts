import { Router } from "express";
import healthRoutes from "./health.routes";
import taskRoutes from "./task.routes";
import { TaskRepository } from "../../domain/repositories/task.repository";
import { ITaskCacheService } from "../../domain/services/ITaskCacheService";
import { ITaskQueueService } from "../../domain/services/ITaskQueueService";

export default function createRouter(
  taskRepository: TaskRepository,
  taskCacheService: ITaskCacheService,
  taskQueueService: ITaskQueueService
) {
  const router = Router();

  router.use("/health", healthRoutes);
  router.use(
    "/tasks",
    taskRoutes(taskRepository, taskCacheService, taskQueueService)
  );

  return router;
}
