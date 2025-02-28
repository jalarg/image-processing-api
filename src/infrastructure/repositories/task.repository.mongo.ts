import { Task } from "../../domain/task.entity";
import { TaskRepository } from "../../domain/task.repository";
import { TaskModel } from "./../database/models/task.model";
import mongoose from "mongoose";

export class TaskRepositoryMongo implements TaskRepository {
  async save(task: Task): Promise<Task> {
    const newTask = new TaskModel(task);
    const savedTask = await newTask.save();
    return savedTask;
  }

  async findById(taskId: string): Promise<Task | null> {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return null;
    }
    const task = await TaskModel.findById(taskId);
    return task ? task : null;
  }
}
