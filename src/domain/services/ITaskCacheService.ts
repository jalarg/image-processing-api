export interface ITaskCacheService {
  getTaskFromCache(taskId: string): Promise<any | null>;
  setTaskInCache(taskId: string, taskData: any): Promise<void>;
}
