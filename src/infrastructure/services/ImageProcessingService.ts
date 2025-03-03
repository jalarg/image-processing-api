import { Task, TaskStatus } from "../../domain/entities/task.entity";
import { TaskRepository } from "../../domain/repositories/task.repository";

export class ImageProcessingService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly processImage: (
      originalPath: string
    ) => Promise<{ resolution: string; path: string }[]>
  ) {}

  async process(task: Task): Promise<void> {
    if (!task || !task._id) {
      throw new Error("Task ID is required for image processing.");
    }
    console.log(`Processing image for task: ${task._id}`);
    try {
      const processedImages = await this.processImage(task.originalPath);
      await this.taskRepository.completeTask(task._id, processedImages);
    } catch (error) {
      console.error(`Error processing task ${task._id}:`, error);
      await this.taskRepository.updateTaskStatus(
        task._id.toString(),
        TaskStatus.FAILED
      );
    }
  }
}
