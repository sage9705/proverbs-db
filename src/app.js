const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const proverbRoutes = require('./routes/proverbRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/api/proverbs', proverbRoutes);

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});