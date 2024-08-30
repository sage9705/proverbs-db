const Proverb = require("../models/Proverb");
const createPaginationResponse = require("../utils/pagination");
const cache = require("../utils/cache");
const logger = require("../utils/logger");
const config = require("../config/config");

exports.getProverbs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, language } = req.query;
    const query = language ? { language } : {};

    const cacheKey = `proverbs_${page}_${limit}_${language || "all"}`;
    const cachedResult = await cache.get(cacheKey);

    if (cachedResult) {
      return res.json(JSON.parse(cachedResult));
    }

    const proverbs = await Proverb.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Proverb.countDocuments(query);

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const response = createPaginationResponse(
      proverbs,
      page,
      limit,
      total,
      baseUrl
    );

    await cache.set(cacheKey, JSON.stringify(response), config.CACHE_TTL);

    res.json(response);
  } catch (error) {
    logger.error("Error in getProverbs:", error);
    next(error);
  }
};

exports.getRandomProverb = async (req, res, next) => {
  try {
    const { language } = req.query;
    const query = language ? { language } : {};

    const count = await Proverb.countDocuments(query);
    if (count === 0) {
      return res.status(404).json({ message: "No proverbs found" });
    }

    const random = Math.floor(Math.random() * count);
    const proverb = await Proverb.findOne(query).skip(random);

    res.json(proverb);
  } catch (error) {
    logger.error("Error in getRandomProverb:", error);
    next(error);
  }
};

exports.searchProverbs = async (req, res, next) => {
  try {
    const { q, language, page = 1, limit = 10 } = req.query;
    const query = {
      $text: { $search: q },
      ...(language && { language }),
    };

    const proverbs = await Proverb.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Proverb.countDocuments(query);

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}/search`;
    const response = createPaginationResponse(
      proverbs,
      page,
      limit,
      total,
      baseUrl
    );

    res.json(response);
  } catch (error) {
    logger.error("Error in searchProverbs:", error);
    next(error);
  }
};

exports.createProverb = async (req, res, next) => {
  try {
    const proverb = new Proverb(req.body);
    await proverb.save();
    res.status(201).json(proverb);
  } catch (error) {
    logger.error("Error in createProverb:", error);
    next(error);
  }
};

exports.getProverbById = async (req, res, next) => {
  try {
    const proverb = await Proverb.findById(req.params.id);
    if (!proverb) {
      return res.status(404).json({ message: "Proverb not found" });
    }
    res.json(proverb);
  } catch (error) {
    logger.error("Error in getProverbById:", error);
    next(error);
  }
};

exports.updateProverb = async (req, res, next) => {
  try {
    const proverb = await Proverb.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!proverb) {
      return res.status(404).json({ message: "Proverb not found" });
    }
    res.json(proverb);
  } catch (error) {
    logger.error("Error in updateProverb:", error);
    next(error);
  }
};

exports.deleteProverb = async (req, res, next) => {
  try {
    const proverb = await Proverb.findByIdAndDelete(req.params.id);
    if (!proverb) {
      return res.status(404).json({ message: "Proverb not found" });
    }
    res.json({ message: "Proverb deleted successfully" });
  } catch (error) {
    logger.error("Error in deleteProverb:", error);
    next(error);
  }
};
