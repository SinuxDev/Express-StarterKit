import { app } from "./app";
import { env } from "./config/env";
import { Database } from "./config/database";

async function bootstrap() {
  try {
    await Database.getInstance().connect();

    app.listen(env.port, () => {
      console.info(`🚀 Server running on http://localhost:${env.port}`);
      console.info(`📡 Environment: ${env.nodeEnv}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
