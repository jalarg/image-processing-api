import { Worker } from "bullmq";
import { connectDB } from "../database/db";
import { ProcessImageUseCase } from "../../application/use-cases/processImage.use-case";
import { TaskRepositoryMongo } from "../../infrastructure/repositories/task.repository.mongo";
import { ImageProcessingService } from "../services/ImageProcessingService";
import { redisClient } from "../redis/redis";

async function startWorker() {
  await connectDB();

  const taskRepository = new TaskRepositoryMongo();
  const imageProcessingService = new ImageProcessingService(taskRepository);
  const processImageUseCase = new ProcessImageUseCase(
    taskRepository,
    imageProcessingService
  );
  const worker = new Worker(
    "imageProcessing",
    async (job) => {
      const { taskId } = job.data;
      console.log(`Processing job: ${job.id} (taskId: ${taskId})`);
      await processImageUseCase.execute(taskId);
      console.log(`Job ${job.id} (Task ${taskId}) completed!`);
    },
    {
      connection: redisClient,
      concurrency: 15,
      limiter: { max: 15, duration: 1000 },
    }
  );
  console.log("Worker started, waiting for jobs...");
}

startWorker();
