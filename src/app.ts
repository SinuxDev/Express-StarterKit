import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import routes from "./start/routes";
import { AppException } from "./app/exceptions/AppException";
import { env } from "./config/env";
import logger from "./config/logger";

const app = express();

if (env.isDevelopment) {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", routes);

app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.url}`);
  next(new AppException("Route not found", 404));
});

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppException) {
    if (err.statusCode >= 500) {
      logger.error(`[${req.method}] ${req.url} - ${err.message}`, {
        statusCode: err.statusCode,
        stack: err.stack,
      });
    } else if (err.statusCode >= 400) {
      logger.warn(`[${req.method}] ${req.url} - ${err.message}`, {
        statusCode: err.statusCode,
      });
    }
  } else {
    logger.error(`[${req.method}] ${req.url} - Unexpected error:`, {
      message: err.message,
      stack: err.stack,
    });
  }

  if (err instanceof AppException) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: env.isProduction ? "Internal server error" : err.message,
    ...(env.isDevelopment && { stack: err.stack }),
  });
});

export { app };
