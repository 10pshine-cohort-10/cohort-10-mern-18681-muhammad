import { logger } from "../config/logger.js";
import { config } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export const notFoundHandler = (req, res, next) => {
  const error = new ApiError(
    404,
    `Resource not found: ${req.method} ${req.originalUrl}`,
  );
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (!statusCode) {
    statusCode = 500;
    message = "Internal Server Error";
  }

  logger.error(
    {
      err,
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      statusCode,
    },
    `[Error] ${req.method} ${req.originalUrl} - ${err.message}`,
  );

  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || message,
    errors: err.errors || [],

    ...(config.NODE_ENV === "development" && { stack: err.stack }),
  });
};
