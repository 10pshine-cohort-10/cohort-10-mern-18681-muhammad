
import { ObjectSchema, ValidationError } from "joi";
import { ApiError } from "../utils/ApiError.js";
import { Request, Response, NextFunction } from "express";

const formatJoiError = (error: ValidationError, message: string): ApiError => {
  const errorMessages = error.details.map((detail) => detail.message);
  return new ApiError(400, message, errorMessages);
};

export const validate =
  <T>(schema: ObjectSchema<T>) =>
  (req: Request<{}, {}, T>, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return next(formatJoiError(error, "Validation failed"));
    }
    req.body = value;
    next();
  };

export const validateParams =
  <T>(schema: ObjectSchema<T>) =>
  (req: Request<T>, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return next(formatJoiError(error, "Invalid route parameters"));
    }
    req.params = value;
    next();
  };

export const validateQuery =
  <T>(schema: ObjectSchema<T>) =>
  (
    req: Request,
    res: Response<unknown, { validatedQuery: T }>,
    next: NextFunction,
  ): void => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return next(formatJoiError(error, "Invalid query parameters"));
    }
    res.locals.validatedQuery = value;
    next();
  };