import { processImage } from "../../helpers/processImage";
import { Task } from "../entities/task.entity";
import { TaskRepository } from "../repositories/task.repository";

export class ImageProcessingService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async process(task: Task): Promise<any> {
    try {
      if (!task._id) {
        throw new Error("Task ID is required for image processing.");
      }
      return await processImage(task._id, this.taskRepository);
    } catch (error) {
      task.markAsFailed();
      await this.taskRepository.save(task);
      throw new Error(`Image processing failed for task ${task._id}: ${error}`);
    }
  }
}
