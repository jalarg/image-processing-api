import mongoose, { Schema, Document, Types } from "mongoose";
import { TaskStatus } from "../../../domain/task.entity";

export interface TaskDocument extends Document {
  _id: Types.ObjectId;
  originalPath: string;
  price: number;
  status: TaskStatus;
  images: { resolution: string; path: string }[];
  completeTask(images: { resolution: string; path: string }[]): void;
  markAsFailed(): void;
}

const taskSchema = new Schema<TaskDocument>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.PENDING,
    },
    price: { type: Number, required: true },
    originalPath: { type: String, required: true },
    images: [
      {
        resolution: String,
        path: String,
      },
    ],
  },
  { timestamps: true }
);

taskSchema.methods.completeTask = function (
  images: { resolution: string; path: string }[]
): void {
  this.status = TaskStatus.COMPLETED;
  this.images = images;
};

taskSchema.methods.markAsFailed = function (): void {
  this.status = TaskStatus.FAILED;
};

// Prevent model redefinition
export const TaskModel =
  mongoose.models.Task || mongoose.model<TaskDocument>("Task", taskSchema);
