import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppException } from "../exceptions/AppException";
import { env } from "../../config/env";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new AppException("Authentication required", 401);
    }

    const decoded = jwt.verify(token, env.jwtSecret) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    next(new AppException("Invalid or expired token", 401));
  }
};
