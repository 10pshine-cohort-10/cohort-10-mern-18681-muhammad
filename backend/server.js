import app from "./src/app.js";
import { config } from "./src/config/env.js";
import { logger } from "./src/config/logger.js";
import { connectDb } from "./src/db/connect.db.js";

async function startServer() {
  await connectDb();
  const server = app.listen(config.PORT, () => {
    logger.info(
      { port: config.PORT, env: config.NODE_ENV },
      `Server is running in ${config.NODE_ENV} mode on port ${config.PORT}`,
    );
  });
  const handleFatalError = (err, origin) => {
    logger.fatal(
      { err, origin },
      "Fatal unhandled exception detected! Closing Server",
    );
    server.close(() => {
      process.exit(1);
    });
  };
  process.on("unhandledRejection", (err) =>
    handleFatalError(err, "unhandledRejection"),
  );
  process.on("uncaughtException", (err) =>
    handleFatalError(err, "uncaughtException"),
  );
}

startServer();
