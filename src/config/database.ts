import mongoose from "mongoose";
import { env } from "./env";
import logger from "./logger";

export class Database {
  private static instance: Database;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(): Promise<void> {
    try {
      await mongoose.connect(env.mongoUri);
      logger.info("✅ MongoDB connected successfully");
    } catch (error) {
      logger.error("❌ MongoDB connection failed:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
    logger.info("MongoDB disconnected");
  }
}
