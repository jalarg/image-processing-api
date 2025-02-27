import { TaskRepository } from "../../domain/task.repository";
import { Task } from "../../domain/task.entity";

export class GetTaskUseCase {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  public async execute(taskId: string): Promise<Task | null> {
    try {
      const task = await this.taskRepository.findById(taskId);
      if (!task) {
        console.error("Task not found");
        return null;
      }
      return task;
    } catch (error) {
      throw new Error("Could not fetch the task");
    }
  }
}
