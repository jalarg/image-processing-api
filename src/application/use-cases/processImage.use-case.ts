import { TaskRepository } from "../../domain/task.repository";
import { processImage } from "../../helpers/processImage";

export class ProcessImageUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(taskId: string): Promise<any> {
    const task = await this.taskRepository.findById(taskId);
    if (!task || !task._id) {
      throw new Error("Task not found");
    }
    try {
      // Process the image with sharp
      const updatedTask = await processImage(task._id, this.taskRepository);
      return updatedTask;
    } catch (error) {
      task.markAsFailed();
      await this.taskRepository.save(task);
      throw new Error("Could not process the image");
    }
  }
}
