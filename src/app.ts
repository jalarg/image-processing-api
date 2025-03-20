import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { TaskRepositoryMongo } from "./infrastructure/repositories/task.repository.mongo";
import { TaskRepository } from "./domain/repositories/task.repository";
import createRouter from "./infrastructure/routes/index.routes";
import { errorMiddleware } from "./infrastructure/middlewares/errorHandler";
import { serverAdapter } from "./infrastructure/queues/bullBoard";

const taskRepository: TaskRepository = new TaskRepositoryMongo();

dotenv.config();
// Create an express application
const app = express();
// Add CORS to the app
app.use(cors());

// Add JSON parsing to the app
app.use(express.json());

// Add BullBoard
app.use("/admin/queues", serverAdapter.getRouter());

// setup swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Image Processing API",
      version: "1.0.0",
      description: "API for processing image tasks",
    },
  },
  apis: ["./src/infrastructure/routes/*.ts"],
};

const swagger = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));

// Add routes including health check
app.use("/api", createRouter(taskRepository));

// Add error handling middleware
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send(" API is running!");
});

export default app;
