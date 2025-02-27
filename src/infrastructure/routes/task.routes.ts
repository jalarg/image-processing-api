import { Router, Request, Response, NextFunction } from "express";
import { TaskController } from "../controllers/task.controller";
import { GetTaskUseCase, CreateTaskUseCase } from "../../application/use-cases";
import { TaskRepositoryMongo } from "../../infrastructure/repositories/task.repository.mongo";
// Initialize the repository and use cases
const taskRepository = new TaskRepositoryMongo();
const getTaskUseCase = new GetTaskUseCase(taskRepository);
const createTaskUseCase = new CreateTaskUseCase(taskRepository);

// Pass the use cases to the TaskController
const taskController = new TaskController(getTaskUseCase, createTaskUseCase);

const router = Router();

router.get(
  "/:taskId",
  async (req: Request, res: Response, next: NextFunction) => {
    await taskController.getTask(req, res, next);
  }
);

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  await taskController.createTask(req, res, next);
});

export default router;
