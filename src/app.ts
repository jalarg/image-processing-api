import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { TaskRepositoryMongo } from "./infrastructure/repositories/task.repository.mongo";
import { ProcessImageUseCase } from "./application/use-cases/processImage.use-case";
import { TaskRepository } from "./domain/task.repository";
import createRouter from "./infrastructure/routes/index.routes";
import { errorMiddleware } from "./infrastructure/middlewares/errorHandler";

const taskRepository: TaskRepository = new TaskRepositoryMongo();
const processImageUseCase = new ProcessImageUseCase(taskRepository);

dotenv.config();
// Create an express application
const app = express();
// Add CORS to the app
app.use(cors());

// Add JSON parsing to the app
app.use(express.json());

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
app.use("/api", createRouter(taskRepository, processImageUseCase));

// Add error handling middleware
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send(" API is running!");
});

export default app;
