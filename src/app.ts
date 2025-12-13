import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import morgan from "morgan";
import routes from "./start/routes";
import { AppException } from "./app/exceptions/AppException";
import { env } from "./config/env";
import logger from "./config/logger";
import { apiLimiter } from "./app/middlewares/rate-limit.middleware";
import {
  corsOptions,
  securityHeaders,
} from "./app/middlewares/security.middleware";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(securityHeaders);

if (env.isDevelopment) {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Body parsing with size limits
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Data sanitization
app.use(mongoSanitize());
app.use(hpp());

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Rate limiting
app.use("/api", apiLimiter);

// Routes
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
