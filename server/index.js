const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Create uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors({
  origin: ['http://localhost:5173', 'https://resume-analyzer-frontend-six-eta.vercel.app'],
  credentials: true
}));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/resume', require('./routes/resume'));

app.get('/', (req, res) => {
  res.send('Resume Analyzer Server Running! ✅');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected ✅');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000} ✅`);
    });
  })
  .catch((err) => console.log(err));