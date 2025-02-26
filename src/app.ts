import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

dotenv.config();
// Create an express application
const app = express();
// Add CORS to the app
app.use(cors());

// Add JSON parsing to the app
app.use(express.json());

app.get("/", (req, res) => {
  res.send(" API is running!");
});

export default app;
