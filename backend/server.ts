import app from "./src/app.js";
import { config } from "./src/config/env.js";
import { logger } from "./src/config/logger.js";
import { connectDb } from "./src/db/connect.db.js";

async function startServer(): Promise<void> {
  try {
    await connectDb();

    const server = app.listen(config.PORT, () => {
      logger.info(
        { port: config.PORT, env: config.NODE_ENV },
        `Server running in ${config.NODE_ENV} mode on port ${config.PORT}`,
      );
    });

    server.on("error", (err: Error) => {
      logger.fatal({ err }, `Server failed to start on port ${config.PORT}`);
      process.exit(1);
    });

    const handleFatalError = (err: unknown, origin: string) => {
      logger.fatal({ err, origin }, "Fatal error detected! Closing Server");
      const forceExitTimer = setTimeout(() => {
        logger.fatal("Forced exit deadline reached. Terminating process immediately.");
        process.exit(1);
      }, 10000);
      forceExitTimer.unref();
      server.close(() => {
        clearTimeout(forceExitTimer);
        process.exit(1);
      });
    };

    process.on("unhandledRejection", (reason: unknown) =>
      handleFatalError(reason, "unhandledRejection"),
    );
    process.on("uncaughtException", (error: Error) =>
      handleFatalError(error, "uncaughtException"),
    );
  } catch (error) {
    logger.fatal({ err: error }, "Failed to start server");
    process.exit(1);
  }
}

startServer();