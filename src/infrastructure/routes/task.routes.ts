import { Router, Request, Response, NextFunction } from "express";
import { TaskController } from "../controllers/task.controller";
import { GetTaskUseCase, CreateTaskUseCase } from "../../application/use-cases";
import { TaskRepository } from "../../domain/repositories/task.repository";
import { TaskCacheService } from "../services/TaskCacheService";
import { TaskQueueService } from "../services/TaskQueueService";

export default function taskRoutes(
  taskRepository: TaskRepository,
  taskCacheService: TaskCacheService,
  taskQueueService: TaskQueueService
) {
  const router = Router();

  // Usamos las dependencias inyectadas
  const getTaskUseCase = new GetTaskUseCase(taskRepository, taskCacheService);
  const createTaskUseCase = new CreateTaskUseCase(
    taskRepository,
    taskQueueService
  );
  const taskController = new TaskController(getTaskUseCase, createTaskUseCase);

  router.get(
    "/:taskId",
    async (req: Request, res: Response, next: NextFunction) => {
      await taskController.getTask(req, res, next);
    }
  );

  router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    await taskController.createTask(req, res, next);
  });

  return router;
}
