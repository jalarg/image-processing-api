import mongoose, { Schema, Document, Types } from "mongoose";
import { TaskStatus } from "../../../domain/task.entity";

interface Image {
  resolution: string;
  path: string;
}

interface TaskDocument extends Document {
  status: TaskStatus.PENDING | TaskStatus.COMPLETED | TaskStatus.FAILED;
  price: number;
  originalPath: string;
  images: Image[];
  completeTask(this: TaskDocument, images: Image[]): void;
  markAsFailed(this: TaskDocument): void;
}

const taskSchema = new Schema<TaskDocument>({
  status: {
    type: String,
    enum: [TaskStatus.PENDING, TaskStatus.COMPLETED, TaskStatus.FAILED],
    default: TaskStatus.PENDING,
  },
  price: { type: Number, required: true },
  originalPath: { type: String, required: true },
  images: [
    {
      resolution: { type: String, required: true },
      path: { type: String, required: true },
    },
  ],
});

taskSchema.methods.completeTask = function (
  this: TaskDocument,
  images: Image[]
): void {
  this.status = TaskStatus.COMPLETED;
  this.images = images;
};

taskSchema.methods.markAsFailed = function (this: TaskDocument): void {
  this.status = TaskStatus.FAILED;
};

export const TaskModel = mongoose.model<TaskDocument>("Task", taskSchema);
