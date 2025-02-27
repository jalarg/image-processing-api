import { Task } from "../../domain/task.entity";
import { TaskRepository } from "../../domain/task.repository";
import { TaskModel } from "./../database/models/task.model";

export class TaskRepositoryMongo implements TaskRepository {
  async save(task: Task): Promise<Task> {
    const newTask = new TaskModel(task);
    const savedTask = await newTask.save();
    return savedTask;
  }

  async findById(taskId: string): Promise<Task | null> {
    const task = await TaskModel.findById(taskId);
    return task ? task : null;
  }
}
