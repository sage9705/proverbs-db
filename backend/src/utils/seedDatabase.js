const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Proverb = require('../models/Proverb');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    await Proverb.deleteMany({}); 

    const seedData = [];

    const engProverbs = JSON.parse(fs.readFileSync(path.join(__dirname, '../../eng.json_unique.json'), 'utf-8'));
    engProverbs.forEach(proverb => {
      seedData.push({ text: proverb, language: 'en', source: 'eng.json_unique.json' });
    });

    const esProverbs = JSON.parse(fs.readFileSync(path.join(__dirname, '../../es.json_unique.json'), 'utf-8'));
    esProverbs.forEach(proverb => {
      seedData.push({ text: proverb, language: 'es', source: 'es.json_unique.json' });
    });

    const frProverbs = JSON.parse(fs.readFileSync(path.join(__dirname, '../../fr.json'), 'utf-8'));
    frProverbs.forEach(proverb => {
      seedData.push({ text: proverb, language: 'fr', source: 'fr.json' });
    });

    await Proverb.insertMany(seedData);
    console.log('Database seeded successfully');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();