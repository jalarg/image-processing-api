import { taskQueue } from "../queues/taskQueue";

export class TaskQueueService {
  async addTaskToQueue(taskId: string, originalPath: string): Promise<void> {
    try {
      const job = await taskQueue.add(
        "imageProcessing",
        { taskId, originalPath },
        {
          attempts: 3,
          backoff: 5000,
          removeOnComplete: false,
          removeOnFail: false,
        }
      );
      console.log(`Job added to queue: ${job.id}`);
    } catch (error) {
      console.error(`Failed to add task ${taskId} to queue:`, error);
      throw new Error(`Failed to add task ${taskId} to queue: ${error}`);
    }
  }
}
