import dotenv from "dotenv";
dotenv.config({ override: false });

import app from "./app";
import connectDB from "./config/db";


const PORT = parseInt(process.env.PORT || "5000", 10);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
  
};

startServer();
