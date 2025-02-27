import mongoose, { Schema, Document, Types } from "mongoose";

interface Image {
  resolution: string;
  path: string;
}

interface TaskDocument extends Document {
  status: "pending" | "completed";
  price: number;
  originalPath: string;
  images: Image[];
  completeTask(this: TaskDocument, images: Image[]): void;
}

const taskSchema = new Schema<TaskDocument>({
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
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
  this.status = "completed";
  this.images = images;
};

export const TaskModel = mongoose.model<TaskDocument>("Task", taskSchema);
