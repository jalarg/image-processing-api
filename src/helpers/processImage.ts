import { TaskModel } from "../../src/infrastructure/database/models/task.model";
import axios from "axios";
import sharp from "sharp";
import crypto from "crypto";
import { getOutputPath } from "./getOutputPath";

export async function processImage(taskId: string) {
  try {
    const task = await TaskModel.findById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    const response = await axios.get(task.originalPath, {
      responseType: "arraybuffer",
    });
    const imageBuffer = Buffer.from(response.data);

    // Compute MD5 hash for uniqueness
    const md5 = crypto.createHash("md5").update(imageBuffer).digest("hex");

    // Process image with Sharp (resize to 1024px and 800px)
    const resolutions = [1024, 800];
    const processedImages = [];

    for (const resolution of resolutions) {
      console.log(`🛠️ Resizing to ${resolution}px`);
      const outputPath = getOutputPath(task.originalPath, resolution, md5);

      // Resize and save the image
      await sharp(imageBuffer).resize({ width: resolution }).toFile(outputPath);
      // Add processed image to the task
      processedImages.push({
        resolution: resolution.toString(),
        path: outputPath,
      });
    }
    // Complete the task and update the task document
    task.completeTask(processedImages);
    await task.save();
    return task;
  } catch (error) {
    const task = await TaskModel.findById(taskId);
    if (task) {
      task.markAsFailed();
      await task.save();
    }

    throw new Error("Could not process the image");
  }
}
