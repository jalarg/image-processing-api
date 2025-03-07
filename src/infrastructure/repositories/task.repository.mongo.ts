import {
  Task,
  TaskStatus,
  TaskImage,
  filteredTask,
  filteredByDateTask,
} from "../../domain/entities/task.entity";
import { TaskRepository } from "../../domain/repositories/task.repository";
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
  async seedDatabase(): Promise<void> {
    const tasksCollection = mongoose.connection.db?.collection("tasks");
    if (!tasksCollection) {
      throw new Error("Tasks collection not found");
    }
    await tasksCollection.insertMany([
      {
        status: "completed",
        price: 25.5,
        createdAt: new Date(),
        updatedAt: new Date(),
        originalPath: "/input/image1.jpg",
        images: [
          { resolution: "1024", path: "/output/image1/1024/f322b730b287.jpg" },
          { resolution: "800", path: "/output/image1/800/202fd8b3174.jpg" },
        ],
      },
      {
        status: "pending",
        price: 30.0,
        createdAt: new Date(),
        updatedAt: new Date(),
        originalPath: "/input/image2.jpg",
        images: [],
      },
    ]);
    console.log("✅ Database seeded successfully!");
  }

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
