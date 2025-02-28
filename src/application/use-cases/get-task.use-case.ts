import { TaskRepository } from "../../domain/task.repository";
import { Task } from "../../domain/task.entity";
import { AppError } from "../../infrastructure/middlewares/errorHandler";

export class GetTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  public async execute(taskId: string): Promise<Task> {
    if (!taskId) {
      throw new AppError("Task ID is required", 400);
    }
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new AppError("Task not found", 404);
    }
    return task;
  }
}
