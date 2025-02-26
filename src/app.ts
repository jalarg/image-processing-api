import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import routes from "./infrastructure/routes/index.routes";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

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
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send(" API is running!");
});

export default app;
