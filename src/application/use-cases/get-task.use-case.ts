import { TaskRepository } from "../../domain/repositories/task.repository";
import { filteredTask } from "../../domain/entities/task.entity";
import { AppError } from "../../infrastructure/middlewares/errorHandler";
import { getCache, setCache } from "../../infrastructure/redis/cache";

export class GetTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  public async execute(taskId: string): Promise<filteredTask> {
    if (!taskId) {
      throw new AppError("Task ID is required", 400);
    }
    // Check cache
    const cacheKey = `cache:task:${taskId}`;
    const cachedTask = await getCache(cacheKey);
    if (cachedTask) {
      console.log("Servido desde Redis");
      return cachedTask;
    }
    // Fetch task from mongoDB database
    const task = await this.taskRepository.optimizedFindById(taskId);
    if (!task) {
      throw new AppError("Task not found", 404);
    }
    // Set cache with TTL 30min
    await setCache(cacheKey, task, 1800);
    return task;
  }
}
