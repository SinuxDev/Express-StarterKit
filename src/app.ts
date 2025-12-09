import express, { Request, Response, NextFunction } from "express";
import routes from "./start/routes";
import { AppException } from "./app/exceptions/AppException";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

// 404 handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppException("Route not found", 404));
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppException) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error("Unexpected error:", err);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

export { app };
