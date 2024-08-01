const Proverb = require('../models/Proverb');

exports.createProverb = async (req, res) => {
  try {
    const proverb = new Proverb(req.body);
    await proverb.save();
    res.status(201).json(proverb);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProverbs = async (req, res) => {
  try {
    const proverbs = await Proverb.find();
    res.json(proverbs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProverbById = async (req, res) => {
  try {
    const proverb = await Proverb.findById(req.params.id);
    if (!proverb) {
      return res.status(404).json({ message: 'Proverb not found' });
    }
    res.json(proverb);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProverb = async (req, res) => {
  try {
    const proverb = await Proverb.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!proverb) {
      return res.status(404).json({ message: 'Proverb not found' });
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
      return res.status(404).json({ message: 'Proverb not found' });
    }
    res.json({ message: 'Proverb deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};