import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import routes from "./infrastructure/routes/index.routes";

dotenv.config();
// Create an express application
const app = express();
// Add CORS to the app
app.use(cors());

// Add JSON parsing to the app
app.use(express.json());

// Add routes including health check
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send(" API is running!");
});

export default app;
