import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProcessImageUseCase } from "../../../src/application/use-cases/processImage.use-case";
import { TaskRepository } from "../../../src/domain/repositories/task.repository";
import { Task } from "../../../src/domain/entities/task.entity";
import { ImageProcessingService } from "../../../src/domain/services/ImageProcessingService";
import { processImage } from "../../../src/helpers/processImage";

vi.mock("../../../src/helpers/processImage", () => ({
  processImage: vi.fn(),
}));
describe("ProcessImageUseCase", () => {
  let taskRepository: TaskRepository;
  let processImageUseCase: ProcessImageUseCase;
  let imageProcessingService: ImageProcessingService;

  beforeEach(() => {
    taskRepository = {
      findById: vi.fn(),
      save: vi.fn(),
    } as unknown as TaskRepository;
    imageProcessingService = new ImageProcessingService(taskRepository);
    processImageUseCase = new ProcessImageUseCase(
      taskRepository,
      imageProcessingService
    );
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
    (vi.mocked(processImage) as vi.Mock).mockRejectedValue(
      new Error("Processing error")
    );

    await expect(processImageUseCase.execute(taskId)).rejects.toThrow(
      "Processing error"
    );
    expect(mockTask.markAsFailed).toHaveBeenCalled();
    expect(taskRepository.save).toHaveBeenCalledWith(mockTask);
  });
});
