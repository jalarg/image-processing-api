import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import taskRoutes from "../../src/infrastructure/routes/task.routes";
import { errorMiddleware } from "../../src/infrastructure/middlewares/errorHandler";
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { TaskRepositoryMongo } from "../../src/infrastructure/repositories/task.repository.mongo";
import { ProcessImageUseCase } from "../../src/application/use-cases/processImage.use-case";
//import path from "path";
//const localImagePath = path.resolve(__dirname, "mocks/mockImage.jpg");

// Set up Express app
const app = express();
const taskRepository = new TaskRepositoryMongo();
const processImageUseCase = new ProcessImageUseCase(taskRepository);

app.use(express.json());
app.use("/tasks", taskRoutes(taskRepository, processImageUseCase));

app.use(errorMiddleware);

describe("Task Routes Integration Tests", () => {
  let mongoServer: MongoMemoryServer;

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
  });

  afterAll(async () => {
    // Disconnect and stop the in-memory MongoDB server
    await mongoose.disconnect();
    await mongoServer.stop();
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

  // POST /tasks

  it("should create a new task successfully", async () => {
    const response = await request(app).post("/tasks").send({
      originalPath:
        "https://img01.ztat.net/article/spp-media-p1/9a482a65092d35a3b3d966aac611fa35/54d38262b49c4c89a61dfe25c8a73dc1.jpg?imwidth=1800",
      // TODO: test with local mock image
      // originalPath: localImagePath,
    });

    expect(response.status).toBe(201);
    /*
    Check response match exact requirements from the task for GET /tasks/:taskId
    @ POST /tasks
      {
       "taskId": "65d4a54b89c5e342b2c2c5f6",
       "status": "pending",
       "price": 25.5
      }
    */

    expect(response.body).toHaveProperty("taskId");
    expect(response.body).toHaveProperty("status", "pending");
    expect(response.body).toHaveProperty("price");

    // Test GET /tasks/:taskId
    const taskId = response.body.taskId;
    console.log("taskId", taskId);
    const getResponse = await request(app).get(`/tasks/${taskId}`);
    expect(getResponse.status).toBe(200);

    /*
    Check response match exact requirements from the task for GET /tasks/:taskId
    @ GET /tasks/:taskId
        {
       "taskId": "65d4a54b89c5e342b2c2c5f6",
       "status": "completed",
       "price": 25.5,
       "images": [
         {
           "resolution": "1024",
           "path": "/output/image1/1024/f322b730b287da77e1c519c7ffef4fc2.jpg"
         },
         {
           "resolution": "800",
           "path": "/output/image1/800/202fd8b3174a774bac24428e8cb230a1.jpg"
         }
       ]
     }
    */

    expect(getResponse.body).toHaveProperty("taskId", taskId);
    expect(getResponse.body).toHaveProperty("status", "completed");
    expect(getResponse.body).toHaveProperty("price");
    expect(getResponse.body).toHaveProperty("images");
    expect(getResponse.body.images.length).toBeGreaterThan(0);
    expect(getResponse.body.images[0].resolution).toBe("1024");
    expect(getResponse.body.images[0]).toHaveProperty("path");
    expect(getResponse.body.images[0].path).toMatch(
      /\/output\/.+\/1024\/.+\.jpg/
    );
    expect(getResponse.body.images[1].resolution).toBe("800");
    expect(getResponse.body.images[1]).toHaveProperty("path");
    expect(getResponse.body.images[1].path).toMatch(
      /\/output\/.+\/800\/.+\.jpg/
    );
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
