import { Worker } from "bullmq";
import Redis from "ioredis";
import { connectDB } from "../database/db";
import { processImage } from "../../helpers/processImage";
import { TaskRepositoryMongo } from "../../infrastructure/repositories/task.repository.mongo";

const connection = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6380"),
  db: parseInt(process.env.REDIS_DB || "0"),
  maxRetriesPerRequest: null,
});

async function startWorker() {
  await connectDB();

  const taskRepository = new TaskRepositoryMongo();
  const worker = new Worker(
    "imageProcessing",
    async (job) => {
      const { taskId } = job.data;

      try {
        console.log(`Processing image for task: ${taskId}`);
        await processImage(taskId, taskRepository);
        console.log(`Task ${taskId} completed!`);
      } catch (error) {
        console.error(`Error processing task ${taskId}:`, error);
      }
    },
    { connection }
  );
  console.log("Worker started, waiting for jobs...");
}

startWorker();
