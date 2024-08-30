const rateLimit = require("express-rate-limit");
const config = require("../config/config");

const rateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX,
  message: "Too many requests from this IP, please try again later.",
});

module.exports = rateLimiter;
