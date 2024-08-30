const redis = require("redis");
const config = require("../config/config");
const logger = require("./logger");

let client;

const connectRedis = async () => {
  if (!config.REDIS_URL) {
    logger.warn("REDIS_URL not set. Caching will be disabled.");
    return null;
  }

  client = redis.createClient({
    url: config.REDIS_URL,
    socket: {
      reconnectStrategy: (attempts) => {
        if (attempts > 10) {
          logger.error(`Redis reconnection failed after ${attempts} attempts`);
          return new Error("Redis reconnection failed");
        }
        return Math.min(attempts * 100, 3000);
      },
    },
  });

  client.on("error", (error) => {
    logger.error("Redis error:", error);
  });

  client.on("connect", () => {
    logger.info("Connected to Redis");
  });

  try {
    await client.connect();
  } catch (error) {
    logger.error("Failed to connect to Redis:", error);
    return null;
  }

  return client;
};

module.exports = {
  get: async (key) => {
    if (!client) {
      client = await connectRedis();
    }
    if (!client) return null;
    try {
      return await client.get(key);
    } catch (error) {
      logger.error("Cache get error:", error);
      return null;
    }
  },
  set: async (key, value, ttlInSeconds) => {
    if (!client) {
      client = await connectRedis();
    }
    if (!client) return;
    try {
      await client.set(key, value, { EX: ttlInSeconds });
    } catch (error) {
      logger.error("Cache set error:", error);
    }
  },
};
