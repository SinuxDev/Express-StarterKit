export const Messages = {
  // Success messages
  SUCCESS: "Operation successful",
  CREATED: "Resource created successfully",
  UPDATED: "Resource updated successfully",
  DELETED: "Resource deleted successfully",

  // Auth messages
  REGISTER_SUCCESS: "Registration successful",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
  PROFILE_UPDATED: "Profile updated successfully",
  PASSWORD_CHANGED: "Password changed successfully",

  // Error messages
  NOT_FOUND: "Resource not found",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "You do not have permission to access this resource",
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_EXISTS: "Email already registered",
  ACCOUNT_DEACTIVATED: "Account is deactivated",

  // Validation messages
  VALIDATION_ERROR: "Validation failed",
  INVALID_EMAIL: "Invalid email format",
  PASSWORD_TOO_SHORT: "Password must be at least 6 characters",
  NAME_TOO_SHORT: "Name must be at least 2 characters",
  CURRENT_PASSWORD_INCORRECT: "Current password is incorrect",

  // Server errors
  INTERNAL_ERROR: "Internal server error",
  DATABASE_ERROR: "Database operation failed",
} as const;

export type MessageKey = keyof typeof Messages;
