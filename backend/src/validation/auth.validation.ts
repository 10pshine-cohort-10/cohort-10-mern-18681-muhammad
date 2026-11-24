import joi, { ObjectSchema } from "joi";
import { LoginBodyDto, RegisterBodyDto } from "../types/auth.types.js";

const registerValidation :ObjectSchema<RegisterBodyDto> = joi
  .object<RegisterBodyDto>({
    name: joi.string().trim().min(3).max(50).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters long",
    }),
    email: joi.string().email().trim().lowercase().required().messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
    }),
   password: joi
  .string()
  .min(8)
  .max(30)
  .custom((value: string, helpers) => {
    if (Buffer.byteLength(value, "utf8") > 72) {
      return helpers.error("string.byteLimit");
    }
    return value;
  })
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
  .required()
  .messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters long",
    "string.pattern.base":
      "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    "string.byteLimit": "Password is too long",
  }),
  })
  .required();

const loginValidation:ObjectSchema<LoginBodyDto> = joi
  .object<LoginBodyDto>({
    email: joi.string().email().trim().lowercase().required().messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
    }),
    password: joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  })
  .required();

export { registerValidation, loginValidation };
