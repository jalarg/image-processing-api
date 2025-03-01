import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Worker } from "bullmq";
import Redis from "ioredis";
import { connectDB } from "../../../src/infrastructure/database/db";

// Mock dependencies
vi.mock("../../../src/infrastructure/database/db", () => ({
  connectDB: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("bullmq");
vi.mock("ioredis");
vi.mock("../../src/infrastructure/database/db");
vi.mock("../../src/helpers/processImage");
vi.mock("../../src/infrastructure/repositories/task.repository.mongo");

vi.stubEnv("REDIS_HOST", "localhost");
vi.stubEnv("REDIS_PORT", "6380");
vi.stubEnv("REDIS_DB", "0");

describe("TaskWorker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("should initialize worker with correct configuration", async () => {
    await import("../../../src/infrastructure/workers/taskWorker");

    expect(Redis).toHaveBeenCalledWith({
      host: "localhost",
      port: 6380,
      db: 0,
      maxRetriesPerRequest: null,
    });

    expect(connectDB).toHaveBeenCalled();
    expect(Worker).toHaveBeenCalledWith(
      "imageProcessing",
      expect.any(Function),
      expect.any(Object)
    );
  });
});
