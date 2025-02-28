import { describe, it, vi, beforeEach, expect } from "vitest";
import { TaskController } from "../../../src/infrastructure/controllers/task.controller";
import { Request, Response } from "express";
import { AppError } from "../../../src/infrastructure/middlewares/errorHandler";

// Mock implementations of the use cases (getTask and createTask)
const getTaskUseCase = {
  execute: vi.fn(),
};
const createTaskUseCase = {
  execute: vi.fn(),
};

// Helper functions to create mock request and response objects
const mockRequest = (params = {}, body = {}) =>
  ({
    params,
    body,
  } as Request);

const mockResponse = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnThis();
  res.json = vi.fn().mockReturnThis();
  return res;
};

describe("TaskController", () => {
  let controller: TaskController;
  beforeEach(() => {
    controller = new TaskController(getTaskUseCase, createTaskUseCase);
  });

  it("should call next() with an AppError if task is not found", async () => {
    const error = new AppError("Task not found", 404);
    getTaskUseCase.execute.mockRejectedValue(error);

    const req = mockRequest({ taskId: "1234" });
    const res = mockResponse();
    const next = vi.fn();

    await controller.getTask(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it("should return task data if found", async () => {
    const mockTask = {
      _id: "task123",
      status: "completed",
      price: 100,
      images: [{ resolution: "1080p", path: "/image.png" }],
    };

    getTaskUseCase.execute.mockResolvedValue(mockTask);

    const req = mockRequest({ taskId: "task123" });
    const res = mockResponse();
    const next = vi.fn();

    await controller.getTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      taskId: "task123",
      status: "completed",
      price: 100,
      images: mockTask.images,
    });
  });

  it("should call next() with an AppError if originalPath is missing in createTask", async () => {
    const error = new AppError("originalPath is required", 400);
    createTaskUseCase.execute.mockRejectedValue(error);

    const req = mockRequest({}, {});
    const res = mockResponse();
    const next = vi.fn();

    await controller.createTask(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should create a task successfully", async () => {
    const mockTask = { _id: "1234", status: "pending", price: 200 };

    createTaskUseCase.execute.mockResolvedValue(mockTask);

    const req = mockRequest({}, { originalPath: "/path/to/file" });
    const res = mockResponse();
    const next = vi.fn();

    await controller.createTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      taskId: "1234",
      status: "pending",
      price: 200,
    });
  });
});
