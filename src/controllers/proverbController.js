const Proverb = require("../models/Proverb");
const { validateProverb } = require("../utils/validation");
const createPaginationResponse = require("../utils/pagination");

exports.getProverbs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const language = req.query.language;

    const query = language ? { language } : {};

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

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRandomProverb = async (req, res) => {
  try {
    const language = req.query.language;
    const query = language ? { language } : {};

    const count = await Proverb.countDocuments(query);
    if (count === 0) {
      return res.status(404).json({ message: "No proverbs found" });
    }

    const random = Math.floor(Math.random() * count);
    const proverb = await Proverb.findOne(query).skip(random);

    res.json(proverb);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchProverbs = async (req, res) => {
  try {
    const { q, language } = req.query;
    const query = {
      $text: { $search: q },
      ...(language && { language }),
    };

    const proverbs = await Proverb.find(query);
    res.json(proverbs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProverb = async (req, res) => {
  try {
    const { error } = validateProverb(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const proverb = new Proverb(req.body);
    await proverb.save();
    res.status(201).json(proverb);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProverbById = async (req, res) => {
  try {
    const proverb = await Proverb.findById(req.params.id);
    if (!proverb) {
      return res.status(404).json({ message: "Proverb not found" });
    }
    res.json(proverb);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProverb = async (req, res) => {
  try {
    const { error } = validateProverb(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const proverb = await Proverb.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!proverb) {
      return res.status(404).json({ message: "Proverb not found" });
    }
    res.json(proverb);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProverb = async (req, res) => {
  try {
    const proverb = await Proverb.findByIdAndDelete(req.params.id);
    if (!proverb) {
      return res.status(404).json({ message: "Proverb not found" });
    }
    res.json({ message: "Proverb deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
