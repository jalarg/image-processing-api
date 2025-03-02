import { Router, Request, Response, NextFunction } from "express";
import { TaskController } from "../controllers/task.controller";
import { GetTaskUseCase, CreateTaskUseCase } from "../../application/use-cases";
import { TaskRepository } from "../../domain/repositories/task.repository";

export default function taskRoutes(taskRepository: TaskRepository) {
  const router = Router();

  const getTaskUseCase = new GetTaskUseCase(taskRepository);
  const createTaskUseCase = new CreateTaskUseCase(taskRepository);
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
