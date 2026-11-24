import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger.js";
import { config } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

interface ErrorWithStatus {
  name?: string;
  message?: string;
  statusCode?: number;
  status?: number;
  isOperational?: boolean;
  errors?: unknown[];
  stack?: string;
  type?: string;
}

const isObject = (val: unknown): val is Record<string, unknown> =>
  typeof val === "object" && val !== null;

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
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const isErrObj = isObject(err);
  const errType = isErrObj && typeof err.type === "string" ? err.type : undefined;
  const isParserError =
    errType === "entity.parse.failed" ||
    (err instanceof SyntaxError && isErrObj && "status" in err && err.status === 400);

  if (isParserError) {
    logger.error(
      {
        errName: isErrObj && typeof err.name === "string" ? err.name : "SyntaxError",
        errType: errType || "entity.parse.failed",
        requestId: req.id,
        method: req.method,
        url: req.originalUrl,
        statusCode: 400,
      },
      `[Parser Error] ${req.method} ${req.originalUrl} - Malformed request body`,
    );

    res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Invalid JSON payload in request body",
      errors: [],
    });
    return;
  }

  const errObj = isErrObj ? (err as ErrorWithStatus) : {};
  const statusCode = errObj.statusCode || errObj.status || 500;
  const isOperational = errObj.isOperational === true;
  const message =
    typeof errObj.message === "string" ? errObj.message : "Internal Server Error";
  const errors = Array.isArray(errObj.errors) ? errObj.errors : [];

  logger.error(
    {
      err:
        err instanceof Error
          ? { name: err.name, message: err.message, stack: err.stack }
          : err,
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      statusCode,
    },
    `[Error] ${req.method} ${req.originalUrl} - ${message}`,
  );

  res.status(statusCode).json({
    success: false,
    statusCode,
    message: isOperational ? message : "Internal Server Error",
    errors: isOperational ? errors : [],
    ...(config.NODE_ENV === "development" && errObj.stack && { stack: errObj.stack }),
  });
};