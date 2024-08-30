const app = require("./app");
const config = require("./config/config");
const connectDB = require("./config/database");
const logger = require("./utils/logger");

// Log configuration details
logger.info(`NODE_ENV: ${config.NODE_ENV}`);
logger.info(`PORT: ${config.PORT}`);
logger.info(`MONGODB_URI: ${config.MONGODB_URI ? "Set" : "Not Set"}`);

if (!config.MONGODB_URI) {
  logger.error("MONGODB_URI is not set. Please check your .env file.");
  process.exit(1);
}

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(config.PORT, () => {
      logger.info(
        `Server running in ${config.NODE_ENV} mode on port ${config.PORT}`
      );
    });

    process.on("unhandledRejection", (err) => {
      logger.error("Unhandled Rejection:", err);
      server.close(() => process.exit(1));
    });
  } catch (err) {
    logger.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
