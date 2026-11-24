import mongoose from "mongoose";
import { config } from "../config/env.js";
import { logger } from "../config/logger.js";

export async function connectDb() :Promise<void>{
  try {
    const connect = await mongoose.connect(config.MONGO_URI);
    logger.info(
      {
        host: connect.connection.host,
        name: connect.connection.name,
      },
      "MongoDB connected successfully ",
    );
  } catch (error) {
    logger.fatal(
      { err: error },
      "MongoDB connection failed! Shutting down server",
    );
    process.exit(1);
  }
}
