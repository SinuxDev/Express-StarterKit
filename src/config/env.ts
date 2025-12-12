import dotenv from "dotenv";
import path from "path";

const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export const env = {
  port: Number(process.env.PORT) || 3000,
  mongoUri: process.env.MONGO_URI!,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiry: process.env.JWT_EXPIRY || "7d",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
};

const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error(`Missing required env vars: ${missingEnvVars.join(", ")}`);
  throw new Error(`Missing required env vars: ${missingEnvVars.join(", ")}`);
}

if (!env.jwtSecret || env.jwtSecret === "change-me-in-production") {
  console.warn(
    "⚠️  Using default JWT_SECRET. Set a secure secret in production!"
  );
}
