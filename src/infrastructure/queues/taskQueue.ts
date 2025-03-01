import { Queue } from "bullmq";
import Redis from "ioredis";

const connection = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6380"),
  db: parseInt(process.env.REDIS_DB || "0"),
  maxRetriesPerRequest: null,
});

// Create a BullMQ queue named "imageProcessing"
export const taskQueue = new Queue("imageProcessing", { connection });
