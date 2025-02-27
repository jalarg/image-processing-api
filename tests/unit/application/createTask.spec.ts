import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  CreateTaskUseCase,
  ProcessImageUseCase,
} from "../../../src/application/use-cases/index";
import { Task } from "../../../src/domain/task.entity";
import { TaskRepository } from "../../../src/domain/task.repository";

describe("CreateTaskUseCase", () => {
  let taskRepository: TaskRepository;
  let createTaskUseCase: CreateTaskUseCase;
  let processImageUseCase: ProcessImageUseCase;

  beforeEach(() => {
    taskRepository = {
      save: vi.fn().mockImplementation(async (task: Task) => ({
        ...task,
        _id: "67c0452f0e6b87df0074d3f9",
      })),
    } as unknown as TaskRepository;
    processImageUseCase = {
      execute: vi.fn().mockResolvedValue(undefined),
    } as unknown as ProcessImageUseCase;
    createTaskUseCase = new CreateTaskUseCase(
      taskRepository,
      processImageUseCase
    );
  });

  it("should successfully create a task", async () => {
    const originalPath = "https://example.com/image.jpg";
    const task = await createTaskUseCase.execute(originalPath);

    expect(taskRepository.save).toHaveBeenCalled();
    expect(task.originalPath).toBe(originalPath);
    expect(task.status).toBe("pending");

    const priceAsNumber = Number(task.price);
    expect(priceAsNumber).toBeGreaterThanOrEqual(5);
    expect(priceAsNumber).toBeLessThanOrEqual(50);
  });

  it("should throw an error when originalPath is missing", async () => {
    await expect(createTaskUseCase.execute("")).rejects.toThrow(
      "originalPath is required"
    );
  });
});
