export class AppException extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;

  constructor(message: string, statusCode = 400, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date();

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundException extends AppException {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class UnauthorizedException extends AppException {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenException extends AppException {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class ValidationException extends AppException {
  constructor(message = "Validation failed") {
    super(message, 400);
  }
}

export class ConflictException extends AppException {
  constructor(message = "Resource conflict") {
    super(message, 409);
  }
}
