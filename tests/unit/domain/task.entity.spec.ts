import { describe, it, expect } from "vitest";
import { Task, TaskStatus } from "../../../src/domain/entities/task.entity";

describe("Task Entity", () => {
  it("should create a new task with pending status", () => {
    const task = new Task("https://example.com/image.jpg", 25);

    expect(task.status).toBe(TaskStatus.PENDING);
    expect(task.price).toBe(25);
    expect(task.originalPath).toBe("https://example.com/image.jpg");
    expect(task.images).toHaveLength(0);
  });

  it("should complete a task and add images", () => {
    const task = new Task("https://example.com/image.jpg", 25);
    const images = [{ resolution: "1024", path: "/output/task_1024.jpg" }];

    task.completeTask(images);

    expect(task.status).toBe(TaskStatus.COMPLETED);
    expect(task.images).toEqual(images);
  });

  it("should throw an error if completing a task with no images", () => {
    const task = new Task("https://example.com/image.jpg", 25);

    expect(() => task.completeTask([])).toThrow(
      "Images are required to complete the task"
    );
  });
});
