const mongoose = require('mongoose');

const ProverbSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  language: {
    type: String,
    required: true,
    enum: ['en', 'es', 'fr'],
  },
  source: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

ProverbSchema.index({ text: 'text' });

const Proverb = mongoose.model('Proverb', ProverbSchema);

module.exports = Proverb;