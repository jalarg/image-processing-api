import { TaskRepository } from "../../domain/task.repository";
import { processImage } from "../../helpers/processImage";

export class ProcessImageUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(taskId: string, imagePath: string): Promise<any> {
    try {
      const task = await this.taskRepository.findById(taskId);
      if (!task) {
        throw new Error("Task not found");
      }
      // Process the image with sharp
      const updatedTask = await processImage(task._id);
      return updatedTask;
    } catch (error) {
      const task = await this.taskRepository.findById(taskId);
      if (task) {
        task.markAsFailed();
        await this.taskRepository.save(task);
      }
      throw new Error("Could not process the image");
    }
  }
}
