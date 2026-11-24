import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";

dotenv.config();

export interface IConfig {
  PORT: number;
  NODE_ENV: string;
  MONGO_URI: string;
  LOG_LEVEL: string;
  CLIENT_URL: string;
  JWT: {
    ACCESS_TOKEN: string;
    REFRESH_TOKEN: string;
    ACCESS_TOKEN_EXPIRES_IN: NonNullable<SignOptions["expiresIn"]>;
    REFRESH_TOKEN_EXPIRES_IN: NonNullable<SignOptions["expiresIn"]>;
  };
}

export const config: IConfig = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI:
    process.env.MONGO_URI || "mongodb://localhost:27017/notes_app_10pearls",
  LOG_LEVEL:
    process.env.LOG_LEVEL ||
    (process.env.NODE_ENV === "production" ? "info" : "debug"),
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  JWT: {
    ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN || "",
    REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN || "",
    ACCESS_TOKEN_EXPIRES_IN:
      (process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>) || "15m",
    REFRESH_TOKEN_EXPIRES_IN:
      (process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>) || "7d",
  },
};

const requiredJwtKeys = [
  "ACCESS_TOKEN",
  "REFRESH_TOKEN",
  "ACCESS_TOKEN_EXPIRES_IN",
  "REFRESH_TOKEN_EXPIRES_IN",
] as const;

for (const key of requiredJwtKeys) {
  if (!config.JWT[key]) {
    throw new Error(`Missing required JWT configuration: JWT_${key}. Check your .env file.`);
  }
}