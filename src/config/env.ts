import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  mongoUri: process.env.MONGO_URI ?? "",
  nodeEnv: process.env.NODE_ENV ?? "development",
};

if (!env.mongoUri) {
  throw new Error("MONGO_URI is required in .env");
}
