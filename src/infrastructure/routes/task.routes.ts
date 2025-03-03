import { Router, Request, Response, NextFunction } from "express";
import { TaskController } from "../controllers/task.controller";
import { GetTaskUseCase, CreateTaskUseCase } from "../../application/use-cases";
import { TaskRepository } from "../../domain/repositories/task.repository";
import { TaskCacheService } from "../services/TaskCacheService";
import { TaskQueueService } from "../services/TaskQueueService";

export default function taskRoutes(taskRepository: TaskRepository) {
  const router = Router();

  const taskCacheService = new TaskCacheService();
  const getTaskUseCase = new GetTaskUseCase(taskRepository, taskCacheService);
  const createTaskUseCase = new CreateTaskUseCase(
    taskRepository,
    new TaskQueueService()
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
