import { describe, it, expect, beforeEach, vi } from "vitest";
import { getOutputPath } from "../../../src/helpers/getOutputPath";
import fs from "fs-extra";

// Mock fs-extra
vi.mock("fs-extra");

describe("getOutputPath", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw an error if imageUrl is not a string", () => {
    expect(() => getOutputPath(null as any, 1080, "dummyMd5")).toThrow(
      "Invalid image URL provided"
    );
  });

  it("should return a valid output path", () => {
    const imageUrl = "http://example.com/image.png?query=123";
    const resolution = 1080;
    const md5 = "dummyMd5";

    const expectedDir = `output/image/${resolution}`;
    const expectedPath = `${expectedDir}/${md5}.png`;

    const result = getOutputPath(imageUrl, resolution, md5);

    expect(fs.ensureDirSync).toHaveBeenCalledWith(
      expect.stringContaining(expectedDir)
    );
    expect(result).toContain(expectedPath);
  });

  it("should default to .jpg if no extension is present", () => {
    const imageUrl = "http://example.com/image";
    const resolution = 720;
    const md5 = "dummyMd5";

    const expectedDir = `output/image/${resolution}`;
    const expectedPath = `${expectedDir}/${md5}.jpg`;

    const result = getOutputPath(imageUrl, resolution, md5);

    expect(fs.ensureDirSync).toHaveBeenCalledWith(
      expect.stringContaining(expectedDir)
    );
    expect(result).toContain(expectedPath);
  });

  it("should clean the filename by replacing special characters with underscores", () => {
    const imageUrl = "http://example.com/image@name!.png";
    const resolution = 480;
    const md5 = "dummyMd5";

    const expectedDir = `output/image_name_/${resolution}`;
    const expectedPath = `${expectedDir}/${md5}.png`;

    const result = getOutputPath(imageUrl, resolution, md5);

    // Check that the directory creation was called with the correct relative path
    expect(fs.ensureDirSync).toHaveBeenCalledWith(
      expect.stringContaining(expectedDir)
    );

    // Check that the result contains the expected relative path
    expect(result).toContain(expectedPath);
  });
});
