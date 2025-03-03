import { TaskRepository } from "../../domain/repositories/task.repository";
import { ImageProcessingService } from "../../domain/services/ImageProcessingService";

export class ProcessImageUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly imageProcessingService: ImageProcessingService
  ) {}

  async execute(taskId: string): Promise<void> {
    const task = await this.taskRepository.findById(taskId);
    if (!task || !task._id) {
      throw new Error("Task not found");
    }
    await this.imageProcessingService.process(task);
  }
}
