import { describe, it, expect, vi, beforeEach } from "vitest";
import { TaskRepositoryMongo } from "../../../src/infrastructure/repositories/task.repository.mongo";
import { TaskModel } from "../../../src/infrastructure/database/models/task.model";
import { Task } from "../../../src/domain/task.entity";

vi.mock("../../../src/infrastructure/database/models/task.model", () => {
  return {
    TaskModel: Object.assign(
      vi.fn().mockImplementation((data) => ({
        status: "pending",
        price: data.price,
        originalPath: data.originalPath,
        images: [],
        _id: "67c056c70ce108ec974dab0a",
        save: vi.fn().mockResolvedValue({
          status: "pending",
          price: data.price,
          originalPath: data.originalPath,
          images: [],
          _id: "67c056c70ce108ec974dab0a",
          _v: 0,
          toObject: function () {
            return {
              status: "pending",
              price: data.price,
              originalPath: data.originalPath,
              images: [],
              _id: "67c056c70ce108ec974dab0a",
              _v: 0,
            };
          },
        }),
      })),
      {
        findById: vi.fn().mockImplementation(async (taskId) => {
          if (taskId === "67c056c70ce108ec974dab0a") {
            return {
              status: "pending",
              price: 30,
              originalPath: "/input/image.jpg",
              images: [],
              _id: "67c056c70ce108ec974dab0a",
              toObject: function () {
                return {
                  status: "pending",
                  price: 30,
                  originalPath: "/input/image.jpg",
                  images: [],
                  _id: "67c056c70ce108ec974dab0a",
                };
              },
            };
          }
          return null;
        }),
      }
    ),
  };
});

vi.mock("../../../src/domain/task.entity", () => {
  return {
    Task: vi.fn().mockImplementation((originalPath, price) => ({
      status: "pending",
      originalPath,
      price,
      images: [],
    })),
  };
});

describe("TaskRepositoryMongo", () => {
  let repository: TaskRepositoryMongo;

  beforeEach(() => {
    repository = new TaskRepositoryMongo();
    vi.clearAllMocks();
  });

  it("should save a task in the database", async () => {
    const task = new Task("/input/image.jpg", 30);
    const savedTask = await repository.save(task);

    expect(TaskModel).toHaveBeenCalledWith(task);
    expect(savedTask).toEqual({
      status: "pending",
      price: 30,
      originalPath: "/input/image.jpg",
      images: [],
      _id: "67c056c70ce108ec974dab0a",
      _v: 0,
    });
  });

  describe("findById", () => {
    it("should return a task when it exists", async () => {
      const mockTask = {
        status: "pending",
        price: 30,
        originalPath: "/input/image.jpg",
        images: [],
        _id: "67c056c70ce108ec974dab0a",
        toObject: function () {
          return { ...this, _id: this._id.toString() };
        },
      };

      TaskModel.findById.mockResolvedValue(mockTask);

      const foundTask = await repository.findById("67c056c70ce108ec974dab0a");

      expect(TaskModel.findById).toHaveBeenCalledWith(
        "67c056c70ce108ec974dab0a"
      );
      expect(foundTask).toEqual({
        ...mockTask,
        _id: mockTask._id.toString(),
      });
    });

    it("should return null when task does not exist", async () => {
      TaskModel.findById.mockResolvedValue(null);

      const foundTask = await repository.findById("1234");
      expect(foundTask).toBeNull();
    });
  });
});
