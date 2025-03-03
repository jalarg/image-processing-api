import { Task } from "../entities/task.entity";

export interface IImageProcessingService {
  process(task: Task): Promise<{ resolution: string; path: string }[]>;
}
