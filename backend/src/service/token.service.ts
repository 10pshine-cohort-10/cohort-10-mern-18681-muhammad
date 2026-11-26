import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { config } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { IAccessTokenPayload, IRefreshTokenPayload } from "../types/auth.types.js";
export const generateAccessToken = (payload : IAccessTokenPayload):string => {
  return jwt.sign(payload, config.JWT.ACCESS_TOKEN, {
    expiresIn: config.JWT.ACCESS_TOKEN_EXPIRES_IN ,
  });
};

export const generateRefreshToken = (payload:IRefreshTokenPayload):string => {
  return jwt.sign(payload, config.JWT.REFRESH_TOKEN, {
    expiresIn: config.JWT.REFRESH_TOKEN_EXPIRES_IN ,
  });
};

export const verifyAccessToken = (token:string):IAccessTokenPayload => {
  try {
    return jwt.verify(token, config.JWT.ACCESS_TOKEN)as IAccessTokenPayload;
  } catch (error) {
    throw new ApiError(401, "Access Token is invalid or expired");
  }
};
export const verifyRefreshToken = (token:string) :IRefreshTokenPayload=> {
  try {
    return jwt.verify(token, config.JWT.REFRESH_TOKEN)as IRefreshTokenPayload;
  } catch (error) {
    throw new ApiError(401, "Refresh Token is invalid or expired");
  }
};

export const hashToken = (token:string):string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const getTokenExpirationDate = (token: string): Date => {
  const decoded = jwt.decode(token);
  if (decoded && typeof decoded === "object" && typeof decoded.exp === "number") {
    return new Date(decoded.exp * 1000);
  }
  throw new ApiError(500, "Failed to derive token expiration");
};
