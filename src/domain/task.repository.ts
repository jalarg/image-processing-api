import { Task } from "./task.entity";

export interface TaskRepository {
  save(task: Task): Promise<Task>;
  findById(taskId: string): Promise<Task | null>;
  updateTaskStatus(taskId: string, status: string): Promise<void>;
  completeTask(
    taskId: string,
    images: { resolution: string; path: string }[]
  ): Promise<void>;
}
