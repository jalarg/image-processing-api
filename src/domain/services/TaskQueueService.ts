import { taskQueue } from "../../infrastructure/queues/taskQueue";

export class TaskQueueService {
  async addTaskToQueue(taskId: string, originalPath: string): Promise<void> {
    try {
      await taskQueue.add(
        "processImage",
        { taskId, originalPath },
        { attempts: 3, backoff: 5000 }
      );
    } catch (error) {
      throw new Error(`Failed to add task ${taskId} to queue: ${error}`);
    }
  }
}
