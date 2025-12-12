import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";
import { AppException } from "../exceptions/AppException";
import { Messages } from "../../constants/messages";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

const authService = new AuthService();

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      throw new AppException(Messages.UNAUTHORIZED, 401);
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      throw new AppException(Messages.UNAUTHORIZED, 401);
    }

    const decoded = authService.verifyToken(token);
    req.userId = decoded.userId;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userRole) {
      return next(new AppException(Messages.UNAUTHORIZED, 401));
    }

    if (!roles.includes(req.userRole)) {
      return next(new AppException(Messages.FORBIDDEN, 403));
    }

    next();
  };
};
