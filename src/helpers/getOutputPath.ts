import path from "path";
import fs from "fs-extra";

export function getOutputPath(
  imageUrl: string,
  resolution: number,
  md5: string
): string {
  if (!imageUrl || typeof imageUrl !== "string") {
    throw new Error("Invalid image URL provided");
  }

  // Remove query parameters from URL
  const cleanUrl = imageUrl.split("?")[0].split("#")[0];

  // Extract the file extension (default to .jpg)
  const ext = path.extname(cleanUrl) || ".jpg";

  // Clean the filename (remove special characters)
  const filename = path.basename(cleanUrl, ext).replace(/[^a-zA-Z0-9]/g, "_");

  // Define the correct output directory
  const outputDir = path.join(
    __dirname,
    "..",
    "output",
    filename,
    resolution.toString()
  );

  // Ensure the directory exists
  fs.ensureDirSync(outputDir);

  return path.join(outputDir, `${md5}${ext}`);
}
