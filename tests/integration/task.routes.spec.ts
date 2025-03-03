import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import taskRoutes from "../../src/infrastructure/routes/task.routes";
import { errorMiddleware } from "../../src/infrastructure/middlewares/errorHandler";
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { TaskRepositoryMongo } from "../../src/infrastructure/repositories/task.repository.mongo";
import { ProcessImageUseCase } from "../../src/application/use-cases/processImage.use-case";
import { taskQueue } from "../../src/infrastructure/queues/taskQueue";
import { ImageProcessingService } from "../../src/domain/services/ImageProcessingService";
import { Worker } from "bullmq";
import { redisClient } from "../../src/infrastructure/redis/redis";

// Set up Express app
const app = express();
const taskRepository = new TaskRepositoryMongo();
const imageProcessingService = new ImageProcessingService(taskRepository);
const processImageUseCase = new ProcessImageUseCase(
  taskRepository,
  imageProcessingService
);

app.use(express.json());
app.use("/tasks", taskRoutes(taskRepository));
app.use(errorMiddleware);

describe("Task Routes Integration Tests", () => {
  let mongoServer: MongoMemoryServer;
  let worker: Worker;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    worker = new Worker(
      "imageProcessing",
      async (job) => {
        await processImageUseCase.execute(job.data.taskId);
      },
      {
        connection: redisClient,
        concurrency: 5,
      }
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    await taskQueue.close();
    await worker.close();
  });

  beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  });

  it("should create a new task and verify it completes", async () => {
    const response = await request(app).post("/tasks").send({
      originalPath:
        "https://img01.ztat.net/article/spp-media-p1/9a482a65092d35a3b3d966aac611fa35/54d38262b49c4c89a61dfe25c8a73dc1.jpg?imwidth=1800",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("taskId");
    const taskId = response.body.taskId;

    // Wait for the task to be processed
    let isCompleted = false;
    for (let i = 0; i < 10; i++) {
      const task = await taskRepository.findById(taskId);
      if (task && task.status === "completed") {
        isCompleted = true;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
    }

    expect(isCompleted).toBe(true);
  });

  it("should create a new task and validate pending state", async () => {
    const response = await request(app).post("/tasks").send({
      originalPath:
        "https://img01.ztat.net/article/spp-media-p1/9a482a65092d35a3b3d966aac611fa35/54d38262b49c4c89a61dfe25c8a73dc1.jpg?imwidth=1800",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("taskId");
    expect(response.body).toHaveProperty("status", "pending");
    expect(response.body).toHaveProperty("price");

    const taskId = response.body.taskId;

    const pendingResponse = await request(app).get(`/tasks/${taskId}`);
    expect(pendingResponse.status).toBe(200);
    expect(pendingResponse.body).toHaveProperty("status", "pending");
    expect(pendingResponse.body).toHaveProperty("price");
  });

  it("should return an error if no originalPath is provided", async () => {
    const response = await request(app).post("/tasks").send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "originalPath is required");
  });

  it("should return 404 for a non-existent taskId", async () => {
    const errorTaskId = "nonexistenttaskid";
    const response = await request(app).get(`/tasks/${errorTaskId}`);
    expect(response.status).toBe(404);
  });
});
