import { pinoHttp } from "pino-http";
import { randomUUID } from "node:crypto";
import { logger } from "../config/logger.js";
import { IncomingMessage, ServerResponse } from "node:http";

export const requestLogger = pinoHttp({
  logger,

  genReqId: (req:IncomingMessage) => req.headers["x-request-id"] as string|| randomUUID(),
  customLogLevel: (req:IncomingMessage, res:ServerResponse, err?:Error) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  serializers: {
    req(req:any) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        query: req.query,
      };
    },
    res(res:any) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
});
