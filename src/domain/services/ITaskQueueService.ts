export interface ITaskQueueService {
  addTaskToQueue(taskId: string, originalPath: string): Promise<void>;
}
