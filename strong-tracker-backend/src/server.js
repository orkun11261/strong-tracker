const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Veritabanına bağlan
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send('Strong Tracker API Çalışıyor!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda başlatıldı.`);
});