import "module-alias/register";
import axios from "axios";
import sharp from "sharp";
import crypto from "crypto";
import { getOutputPath } from "./getOutputPath";

export async function processImage(
  originalPath: string
): Promise<{ resolution: string; path: string }[]> {
  try {
    const response = await axios.get(originalPath, {
      responseType: "arraybuffer",
    });
    const imageBuffer = Buffer.from(response.data);
    const md5 = crypto.createHash("md5").update(imageBuffer).digest("hex");

    const resolutions = [1024, 800];
    const processedImages: { resolution: string; path: string }[] = [];

    for (const resolution of resolutions) {
      console.log(`Resizing to ${resolution}px`);
      const outputPath = getOutputPath(originalPath, resolution, md5);
      await sharp(imageBuffer).resize({ width: resolution }).toFile(outputPath);
      const relativePath = outputPath.replace(/^.*\/output\//, "/output/");
      processedImages.push({
        resolution: resolution.toString(),
        path: relativePath,
      });
    }
    return processedImages;
  } catch (error) {
    throw new Error("Could not process the image");
  }
}
