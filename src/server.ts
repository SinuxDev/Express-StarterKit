import { app } from "./app";
import { env } from "./config/env";
import { Database } from "./config/database";
import logger from "./config/logger";

async function bootstrap() {
  try {
    await Database.getInstance().connect();

    app.listen(env.port, () => {
      logger.info(`🚀 Server running on http://localhost:${env.port}`);
      logger.info(`📡 Environment: ${env.nodeEnv}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
