import request from "supertest";
import express from "express";
import taskRoutes from "../../../src/infrastructure/routes/task.routes";
import healthRoutes from "../../../src/infrastructure/routes/health.routes";
import { describe, it, expect, vi, beforeEach } from "vitest";
import mongoose from "mongoose";
import { errorMiddleware } from "../../../src/infrastructure/middlewares/errorHandler";

const mockObjectId = new mongoose.Types.ObjectId();
// Mock TaskRepository
const taskRepositoryMock = {
  save: vi.fn().mockResolvedValue({
    _id: mockObjectId,
    originalPath: "https://example.com/image.jpg",
    status: "pending",
    price: 25,
    images: [],
  }),
  findById: vi.fn().mockResolvedValue({
    _id: mockObjectId,
    originalPath: "https://example.com/image.jpg",
    status: "pending",
    price: 25,
    images: [],
  }),
};

// Mock ProcessImageUseCase
const processImageUseCaseMock = {
  taskRepository: taskRepositoryMock,
  execute: vi.fn().mockResolvedValue(undefined),
};

// Create Express App with Injected Mocks for TaskRepository and ProcessImageUseCase
const app = express();
app.use(express.json());
app.use("/tasks", taskRoutes(taskRepositoryMock, processImageUseCaseMock));
app.use("/health", healthRoutes);
app.use(errorMiddleware);

describe("Test Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Health Check
  it("should return a 200 status for the health check", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "OK");
  });

  // POST /tasks (Mocked Database)
  it("should create a new task successfully", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ originalPath: "https://example.com/image.jpg" });

    expect(response.status).toBe(201);
    expect(taskRepositoryMock.save).toHaveBeenCalled();
    expect(processImageUseCaseMock.execute).toHaveBeenCalled();
  });

  // POST /tasks (Validation)
  it("should return an error if no originalPath is provided", async () => {
    const response = await request(app).post("/tasks").send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "originalPath is required");
  });

  // GET /tasks/:taskId
  it("should retrieve a task successfully", async () => {
    const response = await request(app).get(
      `/tasks/${mockObjectId.toString()}`
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("taskId", mockObjectId.toString());
    expect(response.body).toHaveProperty("status", "pending");
    expect(response.body).toHaveProperty("price", 25);
    expect(response.body).toHaveProperty("images", []);
  });
});
