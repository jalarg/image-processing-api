import { taskQueue } from "../../infrastructure/queues/taskQueue";

export class TaskQueueService {
  async addTaskToQueue(taskId: string, originalPath: string): Promise<void> {
    try {
      await taskQueue.add(
        "imageProcessing",
        { taskId, originalPath },
        {
          attempts: 3,
          backoff: 5000,
          removeOnComplete: false,
          removeOnFail: false,
        }
      );
    } catch (error) {
      throw new Error(`Failed to add task ${taskId} to queue: ${error}`);
    }
  }
}
