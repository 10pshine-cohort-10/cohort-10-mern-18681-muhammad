import pino from "pino";
import { config } from "./env.js";

export const logger = pino({
  level: config.LOG_LEVEL,
  redact: {
    paths: [
      "password",
      "user.password",
      "token",
      "refreshToken",
      "req.headers.authorization",
      "req.headers.cookie",
    ],
    censor: "[CONFIDENTIAL]",
  },
  transport:
    config.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
            ignore: "pid,hostname",
          },
        }
      : undefined,
  base: {
    env: config.NODE_ENV,
  },
});
