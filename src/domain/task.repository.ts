import { Task } from "./task.entity";

export interface TaskRepository {
  save(task: Task): Promise<Task>;
  findById(taskId: string): Promise<Task | null>;
}
