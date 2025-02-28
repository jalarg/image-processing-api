import mongoose, { Schema, Document, Types, Model } from "mongoose";
import { TaskStatus } from "../../../domain/task.entity";

interface Image {
  resolution: string;
  path: string;
}

export interface TaskDocument extends Document {
  _id: Types.ObjectId;
  status: TaskStatus;
  price: number;
  originalPath: string;
  images: { resolution: string; path: string }[];

  completeTask(images: Image[]): void;
  markAsFailed(): void;
}

const taskSchema = new Schema<TaskDocument>(
  {
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
  },
  { timestamps: true }
);

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

export const TaskModel: Model<TaskDocument> = mongoose.model<TaskDocument>(
  "Task",
  taskSchema
);
