import { connectDB } from "./infrastructure/database/db";
import app from "./app";
import "module-alias/register";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    // Attempt to connect to MongoDB
    await connectDB();
    // If successful, start the server
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

startServer();
