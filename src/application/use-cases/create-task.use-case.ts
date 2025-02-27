import { Task } from "../../domain/task.entity";
import { TaskRepository } from "../../domain/task.repository";

export class CreateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(originalPath: string): Promise<Task> {
    if (!originalPath) {
      throw new Error("originalPath is required");
    }
    const price = parseFloat((Math.random() * (50 - 5) + 5).toFixed(1));

    const task = new Task(originalPath, price);
    return await this.taskRepository.save(task);
  }
}
