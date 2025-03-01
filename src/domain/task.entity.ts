export enum TaskStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface TaskImage {
  resolution: string;
  path: string;
}

export interface filteredTask {
  _id?: string;
  status: TaskStatus;
  price: number;
  images: TaskImage[];
}

export class Task {
  _id?: string;
  status: TaskStatus;
  price: number;
  originalPath: string;
  images: Array<TaskImage>;

  constructor(
    originalPath: string,
    price: number,
    status?: TaskStatus,
    images?: TaskImage[],
    _id?: string
  ) {
    this.status = status || TaskStatus.PENDING;
    this.price = price;
    this.originalPath = originalPath;
    this.images = images || [];
    this._id = _id;
  }

  completeTask(images: TaskImage[]) {
    if (!images || images.length === 0) {
      throw new Error("Images are required to complete the task");
    }
    this.status = TaskStatus.COMPLETED;
    this.images = images;
  }

  markAsFailed() {
    this.status = TaskStatus.FAILED;
  }
}
