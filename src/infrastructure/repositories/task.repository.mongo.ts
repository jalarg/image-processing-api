import {
  Task,
  TaskStatus,
  TaskImage,
  filteredTask,
  filteredByDateTask,
} from "../../domain/task.entity";
import { TaskRepository } from "../../domain/task.repository";
import { TaskModel } from "../database/models/task.model";
import mongoose from "mongoose";

type MongoTask = {
  _id: mongoose.Types.ObjectId;
  status: TaskStatus;
  price: number;
  originalPath: string;
  images: TaskImage[];
  updatedAt?: Date;
  createdAt?: Date;
  __v: number;
};

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

  async optimizedFindById(taskId: string): Promise<filteredTask | null> {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return null;
    }
    const task = await TaskModel.findById(taskId)
      .select("status price images")
      .lean<Pick<MongoTask, "_id" | "status" | "price" | "images">>();

    return task
      ? ({ ...task, _id: task._id.toString() } as filteredTask)
      : null;
  }

  async findTasksByDateRange(
    from: Date,
    to: Date
  ): Promise<filteredByDateTask[]> {
    const tasks = await TaskModel.find({
      createdAt: { $gte: from, $lte: to },
    })
      .select("status price images updatedAt")
      .lean<
        Pick<
          filteredByDateTask,
          "_id" | "status" | "price" | "images" | "createdAt"
        >[]
      >();

    return tasks.map((task) => ({
      _id: task._id ? task._id.toString() : "",
      status: task.status,
      price: task.price,
      images: task.images,
      createdAt: task.createdAt ?? new Date(),
    }));
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
