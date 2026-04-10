const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is working!' });
});

app.post('/api/analyze', (req, res) => {
  res.json({ 
    title: "Sample Video",
    formats: [
      { quality: "1080p", size: "50 MB" },
      { quality: "720p", size: "30 MB" }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
