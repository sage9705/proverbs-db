const app = require("./app");
const config = require("./config/config");
const connectDB = require("./config/database");
const logger = require("./utils/logger");

connectDB();

const server = app.listen(config.PORT, () => {
  logger.info(
    `Server running in ${config.NODE_ENV} mode on port ${config.PORT}`
  );
});

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});
