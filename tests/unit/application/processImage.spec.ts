import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProcessImageUseCase } from "../../../src/application/use-cases/index";
import { TaskRepository } from "../../../src/domain/task.repository";
import { Task } from "../../../src/domain/task.entity";
import { processImage } from "../../../src/helpers/processImage";

vi.mock("../../../src/helpers/processImage", () => ({
  processImage: vi.fn(),
}));

describe("ProcessImageUseCase", () => {
  let taskRepository: TaskRepository;
  let processImageUseCase: ProcessImageUseCase;

  beforeEach(() => {
    taskRepository = {
      findById: vi.fn(),
      save: vi.fn(),
    } as unknown as TaskRepository;
    processImageUseCase = new ProcessImageUseCase(taskRepository);
  });

  it("should process the image successfully", async () => {
    const taskId = "67c0452f0e6b87df0074d3f9";
    const imagePath = "https://example.com/image.jpg";
    const mockTask = {
      _id: taskId,
      originalPath: imagePath,
      status: "pending",
      markAsFailed: vi.fn(),
    } as unknown as Task;

    const mockUpdatedTask = {
      _id: taskId,
      originalPath: imagePath,
      status: "pending",
      images: [
        {
          resolution: "1024",
          url: "https://example.com/image-processed.jpg",
          _id: "67c0452f0e6b87df0074d3f9",
        },
        {
          resolution: "800",
          url: "https://example.com/image-processed.jpg",
          _id: "67c0452f0e6b87df00S2d3f9",
        },
      ],
      markAsFailed: vi.fn(),
    } as unknown as Task;

    (taskRepository.findById as vi.Mock).mockResolvedValue(mockTask);
    (processImage as vi.Mock).mockResolvedValue(mockUpdatedTask);

    const result = await processImageUseCase.execute(taskId, imagePath);

    expect(taskRepository.findById).toHaveBeenCalledWith(taskId);
    expect(processImage).toHaveBeenCalledWith(
      taskId,
      expect.objectContaining({
        findById: expect.any(Function),
        save: expect.any(Function),
      })
    );
    expect(taskRepository.save).not.toHaveBeenCalled();
    expect(result).toBe(mockUpdatedTask);
  });

  it("should throw an error if task is not found", async () => {
    const taskId = "non-existent";
    (taskRepository.findById as vi.Mock).mockResolvedValue(null);

    await expect(
      processImageUseCase.execute(taskId, "https://example.com/image.jpg")
    ).rejects.toThrow("Task not found");

    expect(taskRepository.findById).toHaveBeenCalledWith(taskId);
  });

  it("should mark task as failed and throw an error if processing fails", async () => {
    const taskId = "67c0452f0e6b87df0074d3f9";
    const imagePath = "https://example.com/image.jpg";
    const mockTask = {
      _id: taskId,
      originalPath: imagePath,
      status: "pending",
      markAsFailed: vi.fn(),
    } as unknown as Task;

    (taskRepository.findById as vi.Mock).mockResolvedValue(mockTask);
    (processImage as vi.Mock).mockRejectedValue(new Error("Processing error"));

    await expect(
      processImageUseCase.execute(taskId, imagePath)
    ).rejects.toThrow("Could not process the image");

    expect(taskRepository.findById).toHaveBeenCalledWith(taskId);
    expect(mockTask.markAsFailed).toHaveBeenCalled();
    expect(taskRepository.save).toHaveBeenCalledWith(mockTask);
  });
});
