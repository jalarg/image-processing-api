import "module-alias/register";
import { TaskRepository } from "../domain/repositories/task.repository";
import axios from "axios";
import sharp from "sharp";
import crypto from "crypto";
import { getOutputPath } from "./getOutputPath";

export async function processImage(
  taskId: string,
  taskRepository: TaskRepository
) {
  try {
    const task = await taskRepository.findById(taskId);
    console.log(`Processing image for task: ${taskId}`);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const response = await axios.get(task.originalPath, {
      responseType: "arraybuffer",
    });
    const imageBuffer = Buffer.from(response.data);
    const md5 = crypto.createHash("md5").update(imageBuffer).digest("hex");

    const resolutions = [1024, 800];
    const processedImages: { resolution: string; path: string }[] = [];

    for (const resolution of resolutions) {
      console.log(`Resizing to ${resolution}px`);
      const outputPath = getOutputPath(task.originalPath, resolution, md5);
      await sharp(imageBuffer).resize({ width: resolution }).toFile(outputPath);
      const relativePath = outputPath.replace(/^.*\/output\//, "/output/");
      processedImages.push({
        resolution: resolution.toString(),
        path: relativePath,
      });
    }

    // Use repository method to update the task as completed
    await taskRepository.completeTask(taskId, processedImages);
    console.log(`Task ${taskId} completed!`);
  } catch (error) {
    console.error(`Error processing task ${taskId}:`, error);
    // Update task as failed using repository method
    await taskRepository.updateTaskStatus(taskId, "failed");

    throw new Error("Could not process the image");
  }
}
