import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger.js";
import { config } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const error = new ApiError(
    404,
    `Resource not found: ${req.method} ${req.originalUrl}`,
  );
  next(error);
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = err.statusCode || 500;

  logger.error(
    {
      err,
      requestId: (req as any).id,
      method: req.method,
      url: req.originalUrl,
      statusCode,
    },
    `[Error] ${req.method} ${req.originalUrl} - ${err.message}`,
  );

  const isOperational = err.isOperational === true;

  res.status(statusCode).json({
    success: false,
    statusCode,
    message: isOperational ? err.message : "Internal Server Error",
    errors: isOperational ? err.errors || [] : [],
    ...(config.NODE_ENV === "development" && { stack: err.stack }),
  });
};