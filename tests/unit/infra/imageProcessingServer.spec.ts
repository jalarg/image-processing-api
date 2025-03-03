import { describe, it, expect, vi, beforeEach } from "vitest";
import { ImageProcessingService } from "../../../src/infrastructure/services/ImageProcessingService";
import { TaskRepository } from "../../../src/domain/repositories/task.repository";
import { Task, TaskStatus } from "../../../src/domain/entities/task.entity";

describe("ImageProcessingService", () => {
  let taskRepository: TaskRepository;
  let processImageMock: (
    originalPath: string
  ) => Promise<{ resolution: string; path: string }[]>;
  let imageProcessingService: ImageProcessingService;

  beforeEach(() => {
    taskRepository = {
      completeTask: vi.fn(),
      updateTaskStatus: vi.fn(),
    } as unknown as TaskRepository;

    processImageMock = vi.fn();

    imageProcessingService = new ImageProcessingService(
      taskRepository,
      processImageMock
    );
  });

  it("should process the image and complete the task successfully", async () => {
    const taskId = "67c0452f0e6b87df0074d3f9";
    const mockTask = {
      _id: taskId,
      originalPath: "https://example.com/image.jpg",
    } as unknown as Task;

    const processedImages = [
      { resolution: "1024px", path: "/output/image/1024/image_hash.jpg" },
      { resolution: "800px", path: "/output/image/800/image_hash.jpg" },
    ];

    (processImageMock as vi.Mock).mockResolvedValue(processedImages);

    await imageProcessingService.process(mockTask);

    expect(processImageMock).toHaveBeenCalledWith(mockTask.originalPath);
    expect(taskRepository.completeTask).toHaveBeenCalledWith(
      taskId,
      processedImages
    );
  });

  it("should update task status to FAILED if processing fails", async () => {
    const taskId = "67c0452f0e6b87df0074d3f9";
    const mockTask = {
      _id: taskId,
      originalPath: "https://example.com/image.jpg",
    } as unknown as Task;

    (processImageMock as vi.Mock).mockRejectedValue(
      new Error("Processing error")
    );

    await imageProcessingService.process(mockTask);

    expect(processImageMock).toHaveBeenCalledWith(mockTask.originalPath);
    expect(taskRepository.updateTaskStatus).toHaveBeenCalledWith(
      taskId,
      TaskStatus.FAILED
    );
  });

  it("should throw an error if the task ID is missing", async () => {
    const invalidTask = {
      originalPath: "https://example.com/image.jpg",
    } as unknown as Task;

    await expect(imageProcessingService.process(invalidTask)).rejects.toThrow(
      "Task ID is required for image processing."
    );
  });
});
