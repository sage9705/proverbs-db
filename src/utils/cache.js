const redis = require("redis");
const { promisify } = require("util");
const config = require("../config/config");
const logger = require("./logger");

const client = redis.createClient(config.REDIS_URL);

client.on("error", (error) => {
  logger.error("Redis error:", error);
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

module.exports = {
  get: async (key) => {
    try {
      return await getAsync(key);
    } catch (error) {
      logger.error("Cache get error:", error);
      return null;
    }
  },
  set: async (key, value, ttlInSeconds) => {
    try {
      await setAsync(key, value, "EX", ttlInSeconds);
    } catch (error) {
      logger.error("Cache set error:", error);
    }
  },
};
