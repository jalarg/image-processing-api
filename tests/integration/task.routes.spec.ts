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
import { Worker } from "bullmq";
import Redis from "ioredis";

// Set up Express app
const app = express();
const taskRepository = new TaskRepositoryMongo();
const processImageUseCase = new ProcessImageUseCase(taskRepository);

app.use(express.json());
app.use("/tasks", taskRoutes(taskRepository, processImageUseCase));

app.use(errorMiddleware);

describe("Task Routes Integration Tests", () => {
  let mongoServer: MongoMemoryServer;
  let worker: Worker;

  beforeAll(async () => {
    console.log("Starting MongoMemoryServer...");
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    console.log("MongoMemoryServer URI:", uri);

    console.log("Connecting to Mongoose...");
    await mongoose.connect(uri);

    mongoose.connection.on("open", () => console.log("MongoDB Connected"));
    mongoose.connection.on("error", (err) =>
      console.error("MongoDB Connection Error:", err)
    );

    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database connection is not ready");
    }

    // Start the worker
    const connection = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6380"),
      db: parseInt(process.env.REDIS_DB || "0"),
      maxRetriesPerRequest: null,
    });

    worker = new Worker(
      "imageProcessing",
      async (job) => {
        const { taskId } = job.data;
        try {
          await processImageUseCase.execute(taskId);
        } catch (error) {
          console.error(`Error processing task ${taskId}:`, error);
          throw error;
        }
      },
      { connection }
    );
  });

  afterAll(async () => {
    // Disconnect and stop the in-memory MongoDB server
    await mongoose.disconnect();
    await mongoServer.stop();
    await taskQueue.close();
  });

  beforeEach(async () => {
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database connection is not ready");
    }
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  });

  // Function to wait for task completion
  const waitForTaskCompletion = async (
    taskId: string,
    maxRetries = 10,
    delayMs = 1000
  ) => {
    for (let i = 0; i < maxRetries; i++) {
      const response = await request(app).get(`/tasks/${taskId}`);
      if (response.body.status === "completed") {
        return response;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs)); // Wait before retrying
    }
    throw new Error(`Task ${taskId} did not complete in time`);
  };

  it("should create a new task and validate pending state", async () => {
    const response = await request(app).post("/tasks").send({
      originalPath:
        "https://img01.ztat.net/article/spp-media-p1/9a482a65092d35a3b3d966aac611fa35/54d38262b49c4c89a61dfe25c8a73dc1.jpg?imwidth=1800",
    });

    // Validate response
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("taskId");
    expect(response.body).toHaveProperty("status", "pending");
    expect(response.body).toHaveProperty("price");

    const taskId = response.body.taskId;

    // **Step 1: Validate Pending State Before Processing**
    const pendingResponse = await request(app).get(`/tasks/${taskId}`);
    expect(pendingResponse.status).toBe(200);
    expect(pendingResponse.body).toHaveProperty("status", "pending");
    expect(pendingResponse.body).toHaveProperty("price");

    // **Step 2: Wait for Task Completion & Validate Response**
    const completedResponse = await waitForTaskCompletion(taskId);
    expect(completedResponse.status).toBe(200);
    expect(completedResponse.body).toHaveProperty("status", "completed");
    expect(completedResponse.body).toHaveProperty("images");
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
