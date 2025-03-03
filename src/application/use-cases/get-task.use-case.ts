import { TaskRepository } from "../../domain/repositories/task.repository";
import { filteredTask } from "../../domain/entities/task.entity";
import { AppError } from "../../infrastructure/middlewares/errorHandler";
import { TaskCacheService } from "../../domain/services/TaskCacheService";

export class GetTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly taskCacheService: TaskCacheService
  ) {}

  public async execute(taskId: string): Promise<filteredTask> {
    if (!taskId) {
      throw new AppError("Task ID is required", 400);
    }
    // Check cache first
    const cachedTask = await this.taskCacheService.getTaskFromCache(taskId);
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
    await this.taskCacheService.setTaskInCache(taskId, task);
    return task;
  }
}
