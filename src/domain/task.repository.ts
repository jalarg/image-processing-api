import { Task, filteredTask } from "./task.entity";

export interface TaskRepository {
  save(task: Task): Promise<Task>;
  findById(taskId: string): Promise<Task | null>;
  optimizedFindById(taskId: string): Promise<filteredTask | null>;
  updateTaskStatus(taskId: string, status: string): Promise<void>;
  completeTask(
    taskId: string,
    images: { resolution: string; path: string }[]
  ): Promise<void>;
}
