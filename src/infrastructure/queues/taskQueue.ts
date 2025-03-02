import { Queue } from "bullmq";
import { redisClient } from "../redis/redis";

// Create a BullMQ queue named "imageProcessing"
export const taskQueue = new Queue("imageProcessing", {
  connection: redisClient,
});
