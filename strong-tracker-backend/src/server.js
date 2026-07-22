const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


dotenv.config();


connectDB();


const app = express();


app.use(cors());
app.use(express.json());

const programRoutes = require('./routes/programRoutes');
const historyRoutes = require('./routes/historyRoutes');

app.use('/api/programs', programRoutes);
app.use('/api/history', historyRoutes);

app.get('/', (req, res) => {
  res.send('Strong Tracker API Çalışıyor!');
});


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda başlatıldı.`);
});