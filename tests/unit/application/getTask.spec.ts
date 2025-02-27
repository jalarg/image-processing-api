import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetTaskUseCase } from "../../../src/application/use-cases/get-task.use-case";
import { Task } from "../../../src/domain/task.entity";
import { TaskRepository } from "../../../src/domain/task.repository";

describe("GetTaskUseCase", () => {
  let taskRepository: TaskRepository;
  let getTaskUseCase: GetTaskUseCase;

  beforeEach(() => {
    taskRepository = {
      findById: vi.fn(),
    } as unknown as TaskRepository;

    getTaskUseCase = new GetTaskUseCase(taskRepository);
  });

  it("should return a task when found", async () => {
    const taskId = "67c0452f0e6b87df0074d3f9";
    const mockTask: Task = {
      _id: taskId,
      originalPath: "https://example.com/image.jpg",
      status: "pending",
      price: 15.5,
    };

    (taskRepository.findById as vi.Mock).mockResolvedValue(mockTask);

    const result = await getTaskUseCase.execute(taskId);

    expect(taskRepository.findById).toHaveBeenCalledWith(taskId);
    expect(result).toEqual(mockTask);
  });

  it("should return null when task is not found", async () => {
    (taskRepository.findById as vi.Mock).mockResolvedValue(null);

    const result = await getTaskUseCase.execute("1234");

    expect(taskRepository.findById).toHaveBeenCalledWith("1234");
    expect(result).toBeNull();
  });

  it("should throw an error if repository throws an error", async () => {
    (taskRepository.findById as vi.Mock).mockRejectedValue(
      new Error("Database error")
    );

    await expect(getTaskUseCase.execute("error-id")).rejects.toThrow(
      "Could not fetch the task"
    );
  });
});
