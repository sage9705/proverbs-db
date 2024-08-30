const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./utils/swagger");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const proverbRoutes = require("./routes/proverbRoutes");
const logger = require("./utils/logger");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// API routes
app.use("/api/proverbs", proverbRoutes);

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
