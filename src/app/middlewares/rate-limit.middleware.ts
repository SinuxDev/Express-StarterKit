import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
import logger from "../../config/logger";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip} on ${req.path}`);

    const resetTime = req.rateLimit.resetTime;
    const retryAfterSeconds = resetTime
      ? Math.ceil((resetTime.getTime() - Date.now()) / 1000)
      : Math.ceil(15 * 60);

    res.status(429).json({
      success: false,
      message: "Too many requests, please try again later",
      retryAfter: retryAfterSeconds,
    });
  },
  skip: (req: Request) => {
    return req.path === "/health";
  },
});

// Strict rate limiter for auth endpoints (login, register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: "Too many authentication attempts, please try again later",
    });
  },
});

export const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: "Too many create requests, please slow down",
    });
  },
});

export const createRateLimiter = (options: {
  windowMs: number;
  max: number;
  message?: string;
}) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, res: Response) => {
      res.status(429).json({
        success: false,
        message: options.message || "Rate limit exceeded",
      });
    },
  });
};
