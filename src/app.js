const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const proverbRoutes = require("./routes/proverbRoutes");
const apiLimiter = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// Apply rate limiting to all routes
app.use(apiLimiter);

app.use("/api/proverbs", proverbRoutes);

// Error Handler Middleware
app.use(errorHandler);

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
