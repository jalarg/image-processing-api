import { Task } from "../../domain/task.entity";
import { TaskRepository } from "../../domain/task.repository";
import { ProcessImageUseCase } from "./processImage.use-case";

export class CreateTaskUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private processImageUseCase: ProcessImageUseCase
  ) {}

  async execute(originalPath: string): Promise<Task> {
    if (!originalPath) {
      throw new Error("originalPath is required");
    }
    const price = parseFloat((Math.random() * (50 - 5) + 5).toFixed(1));

    const task = new Task(originalPath, price);
    const savedTask = await this.taskRepository.save(task);
    const taskId = savedTask._id;
    await this.processImageUseCase.execute(taskId, originalPath);

    return savedTask;
  }
}
