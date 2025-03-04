import mongoose from "mongoose";
import { TaskRepositoryMongo } from "../repositories/task.repository.mongo";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI || "mongodb://mongo:27017/image-processing";
const taskRepository = new TaskRepositoryMongo();

async function runSeed() {
  await mongoose.connect(uri);
  await taskRepository.seedDatabase();
  await mongoose.disconnect();
}

runSeed();
