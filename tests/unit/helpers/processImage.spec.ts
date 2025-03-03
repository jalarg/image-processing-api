import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import sharp from "sharp";
import crypto from "crypto";
import { processImage } from "../../../src/helpers/processImage";
import { getOutputPath } from "../../../src/helpers/getOutputPath";

vi.mock("axios");
vi.mock("sharp", () => {
  const resizeMock = vi.fn().mockImplementation(() => ({
    toFile: vi.fn().mockResolvedValue(undefined),
  }));
  const sharpMock = vi.fn().mockImplementation(() => ({
    resize: resizeMock,
  }));
  return {
    __esModule: true,
    default: sharpMock,
  };
});

vi.mock("../../../src/helpers/getOutputPath", () => ({
  getOutputPath: vi.fn(
    (originalPath, resolution, md5) => `/output/${md5}/${resolution}/image.jpg`
  ),
}));

describe("processImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should process an image and return the paths of resized images", async () => {
    const originalPath = "https://example.com/image.jpg";
    const fakeImageBuffer = Buffer.from("fake-image-data");
    const fakeMd5 = crypto
      .createHash("md5")
      .update(fakeImageBuffer)
      .digest("hex");

    (axios.get as vi.Mock).mockResolvedValue({ data: fakeImageBuffer });
    (getOutputPath as vi.Mock).mockImplementation(
      (originalPath, resolution, md5) =>
        `/output/${md5}/${resolution}/image.jpg`
    );

    const result = await processImage(originalPath);

    expect(axios.get).toHaveBeenCalledWith(originalPath, {
      responseType: "arraybuffer",
    });
    expect(getOutputPath).toHaveBeenCalledWith(originalPath, 1024, fakeMd5);
    expect(getOutputPath).toHaveBeenCalledWith(originalPath, 800, fakeMd5);
    expect(sharp).toHaveBeenCalledTimes(2);
    expect(sharp().resize).toHaveBeenCalledTimes(2);
    expect(result).toEqual([
      { resolution: "1024", path: `/output/${fakeMd5}/1024/image.jpg` },
      { resolution: "800", path: `/output/${fakeMd5}/800/image.jpg` },
    ]);
  });

  it("should throw an error if the image cannot be processed", async () => {
    const originalPath = "https://example.com/image.jpg";
    (axios.get as vi.Mock).mockRejectedValue(new Error("Network error"));

    await expect(processImage(originalPath)).rejects.toThrow(
      "Could not process the image"
    );
  });
});
