import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProcessImageUseCase } from "../../../src/application/use-cases/processImage.use-case";
import { TaskRepository } from "../../../src/domain/repositories/task.repository";
import { ImageProcessingService } from "../../../src/infrastructure/services/ImageProcessingService";
import { Task } from "../../../src/domain/entities/task.entity";

describe("ProcessImageUseCase", () => {
  let taskRepository: TaskRepository;
  let imageProcessingService: ImageProcessingService;
  let processImageUseCase: ProcessImageUseCase;

  beforeEach(() => {
    taskRepository = {
      findById: vi.fn(),
    } as unknown as TaskRepository;

    imageProcessingService = {
      process: vi.fn(),
    } as unknown as ImageProcessingService;

    processImageUseCase = new ProcessImageUseCase(
      taskRepository,
      imageProcessingService
    );
  });

  it("should call process() when a valid task is found", async () => {
    const taskId = "67c0452f0e6b87df0074d3f9";
    const mockTask = {
      _id: taskId,
      originalPath: "https://example.com/image.jpg",
    } as unknown as Task;

    (taskRepository.findById as vi.Mock).mockResolvedValue(mockTask);

    await processImageUseCase.execute(taskId);

    expect(taskRepository.findById).toHaveBeenCalledWith(taskId);
    expect(imageProcessingService.process).toHaveBeenCalledWith(mockTask);
  });

  it("should throw an error if the task is not found", async () => {
    const taskId = "67c0452f0e6b87df0074d3f9";

    (taskRepository.findById as vi.Mock).mockResolvedValue(null);

    await expect(processImageUseCase.execute(taskId)).rejects.toThrow(
      "Task not found"
    );

    expect(taskRepository.findById).toHaveBeenCalledWith(taskId);
    expect(imageProcessingService.process).not.toHaveBeenCalled();
  });
});
