import pinoHttp from "pino-http";
import { randomUUID } from "node:crypto";
import { logger } from "../config/logger.js";

export const requestLogger = pinoHttp({
  logger,

  genReqId: (req) => req.headers["x-request-id"] || randomUUID(),
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        query: req.query,
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
});
