import { getCache, setCache } from "../redis/cache";
import { filteredTask } from "../../domain/entities/task.entity";

export class TaskCacheService {
  async getTaskFromCache(taskId: string): Promise<filteredTask | null> {
    const cacheKey = `cache:task:${taskId}`;
    try {
      return await getCache(cacheKey);
    } catch (error) {
      console.error(`Cache error for task ${taskId}: ${error}`);
      return null;
    }
  }

  async setTaskInCache(taskId: string, taskData: any): Promise<void> {
    const cacheKey = `cache:task:${taskId}`;
    try {
      await setCache(cacheKey, taskData, 1800);
    } catch (error) {
      console.error(`Failed to cache task ${taskId}: ${error}`);
    }
  }
}
