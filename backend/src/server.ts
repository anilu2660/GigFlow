import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/db";

// Cloud Run will inject 8080, local dev will fallback to 5000
const PORT = parseInt(process.env.PORT || "5000", 10);

const startServer = async () => {
  await connectDB();

  // Highlight-start: Add '0.0.0.0' as the second argument
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
  // Highlight-end
};

startServer();
