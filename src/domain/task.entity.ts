export enum TaskStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface TaskImage {
  resolution: string;
  path: string;
}

export class Task {
  public status: string;
  public price: number;
  public originalPath: string;
  public images: Array<TaskImage>;

  constructor(originalPath: string, price: number) {
    this.status = TaskStatus.PENDING;
    this.price = price;
    this.originalPath = originalPath;
    this.images = [];
  }

  completeTask(images: Array<{ resolution: string; path: string }>) {
    if (!images || images.length === 0) {
      throw new Error("Images are required to complete the task");
    }
    this.status = TaskStatus.COMPLETED;
    this.images = images;
  }
}
