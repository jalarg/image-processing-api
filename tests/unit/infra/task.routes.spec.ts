import request from "supertest";
import express from "express";
import taskRoutes from "../../../src/infrastructure/routes/task.routes";
import healthRoutes from "../../../src/infrastructure/routes/health.routes";
import { describe, it, expect, vi, beforeEach } from "vitest";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use("/tasks", taskRoutes);
app.use("/health", healthRoutes);

// Mock the TaskModel
const mockObjectId = new mongoose.Types.ObjectId();

vi.mock(
  "../../../src/infrastructure/repositories/task.repository.mongo",
  () => ({
    TaskRepositoryMongo: vi.fn().mockImplementation(() => ({
      save: vi.fn().mockImplementation(async (task) => ({
        ...task,
        _id: mockObjectId,
      })),
      findById: vi.fn().mockImplementation(async (id) => {
        if (id === mockObjectId.toString()) {
          return {
            _id: mockObjectId,
            originalPath: "https://example.com/image.jpg",
            status: "pending",
            price: 25,
          };
        }
        return null;
      }),
    })),
  })
);

describe("Test Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Health check /health
  it("should return a 200 status for the health check", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "OK");
  });

  // POST /tasks
  it("should create a new task successfully", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ originalPath: "https://example.com/image.jpg" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("taskId", mockObjectId.toString());
    expect(response.body).toHaveProperty("status", "pending");
    expect(response.body).toHaveProperty("price");
    expect(typeof response.body.price).toBe("number");
    expect(response.body.price).toBeGreaterThanOrEqual(5);
    expect(response.body.price).toBeLessThanOrEqual(50);
  });

  it("should return an error if no originalPath is provided", async () => {
    const response = await request(app).post("/tasks").send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Missing originalPath in request body"
    );
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
