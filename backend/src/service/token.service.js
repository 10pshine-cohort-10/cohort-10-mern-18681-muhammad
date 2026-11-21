import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { config } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
export const generateAccessToken = ({ id, email }) => {
  return jwt.sign({ id, email }, config.JWT.ACCESS_TOKEN, {
    expiresIn: config.JWT.ACCESS_TOKEN_EXPIRES_IN,
  });
};

export const generateRefreshToken = ({ id, email, sessionId }) => {
  return jwt.sign({ id, email, sessionId }, config.JWT.REFRESH_TOKEN, {
    expiresIn: config.JWT.REFRESH_TOKEN_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.JWT.ACCESS_TOKEN);
  } catch (error) {
    throw new ApiError(401, "Access Token is invalid or expired");
  }
};
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.JWT.REFRESH_TOKEN);
  } catch (error) {
    throw new ApiError(401, "Refresh Token is invalid or expired");
  }
};

export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
