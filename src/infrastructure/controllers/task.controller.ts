import { Request, Response, NextFunction } from "express";
import { GetTaskUseCase, CreateTaskUseCase } from "../../application/use-cases";

export class TaskController {
  constructor(
    private readonly getTaskUseCase: GetTaskUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase
  ) {}

  async getTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = req.params.taskId;
      const task = await this.getTaskUseCase.execute(taskId);
      return res.status(200).json({
        taskId: task._id,
        status: task.status,
        price: task.price,
        images: task.status === "completed" ? task.images : [],
      });
    } catch (error) {
      next(error);
    }
  }

  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { originalPath } = req.body;
      const task = await this.createTaskUseCase.execute(originalPath);
      return res.status(201).json({
        taskId: task._id,
        status: task.status,
        price: Number(task.price),
      });
    } catch (error) {
      next(error);
    }
  }
}
