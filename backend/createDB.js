const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const url = 'mongodb://localhost:27017';
const dbName = 'proverbs_db';

const data = {
  english_proverbs: [
    {
      _id: uuidv4(),
      proverb: "Actions speak louder than words.",
    },
    {
      _id: uuidv4(),
      proverb: "A journey of a thousand miles begins with a single step.",
    },
    // Add more English proverbs as needed
  ],
  spanish_proverbs: [
    {
      _id: uuidv4(),
      proverb: "No hay mal que por bien no venga.",
    },
    {
      _id: uuidv4(),
      proverb: "En boca cerrada no entran moscas.",
    },
    // Add more Spanish proverbs as needed
  ],
  french_proverbs: [
    {
      _id: uuidv4(),
      proverb: "Après la pluie, le beau temps.",
    },
    {
      _id: uuidv4(),
      proverb: "Petit à petit, l'oiseau fait son nid.",
    },
    // Add more French proverbs as needed
  ],
};

// async/await to connect and create the database and collections
async function createDatabase() {
  const client = new MongoClient(url, { useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db(dbName);
    for (const collectionName of Object.keys(data)) {
      await db.collection(collectionName).insertMany(data[collectionName]);
    }
    console.log('Database and collections created successfully.');
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    client.close();
  }
}

createDatabase();
