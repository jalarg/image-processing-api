import { Task } from "../../domain/task.entity";
import { TaskRepository } from "../../domain/task.repository";
import { TaskModel } from "../database/models/task.model";
import mongoose from "mongoose";

export class TaskRepositoryMongo implements TaskRepository {
  async save(task: Task): Promise<Task> {
    const newTask = new TaskModel(task);
    const savedTask = await newTask.save();
    return { ...savedTask.toObject(), _id: savedTask._id.toString() } as Task;
  }

  async findById(taskId: string): Promise<Task | null> {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return null;
    }
    const task = await TaskModel.findById(taskId);
    return task
      ? ({ ...task.toObject(), _id: task._id.toString() } as Task)
      : null;
  }

  async updateTaskStatus(taskId: string, status: string): Promise<void> {
    await TaskModel.findByIdAndUpdate(taskId, {
      status,
      updatedAt: new Date(),
    });
  }

  async completeTask(
    taskId: string,
    images: { resolution: string; path: string }[]
  ): Promise<void> {
    await TaskModel.findByIdAndUpdate(taskId, {
      status: "completed",
      images,
      updatedAt: new Date(),
    });
  }
}
