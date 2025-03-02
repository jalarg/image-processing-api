import { Task } from "../../domain/entities/task.entity";
import { TaskRepository } from "../../domain/repositories/task.repository";
import { AppError } from "../../infrastructure/middlewares/errorHandler";
import { taskQueue } from "../../infrastructure/queues/taskQueue";

export class CreateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(originalPath: string): Promise<Task> {
    if (!originalPath) {
      throw new AppError("originalPath is required", 400);
    }
    const price = parseFloat((Math.random() * (50 - 5) + 5).toFixed(1));
    const task = new Task(originalPath, price);
    const savedTask = await this.taskRepository.save(task);
    const taskId = savedTask._id;
    if (!taskId) {
      throw new AppError("Task ID is required", 400);
    }
    console.log("Adding job to queue with data:", { taskId, originalPath });
    await taskQueue.add(
      "processImage",
      { taskId },
      { attempts: 3, backoff: 5000 }
    );

    console.log("Job added successfully to queue");
    return savedTask;
  }
}
