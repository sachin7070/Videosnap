const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'VideoSnap Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Analyze endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Mock response for now
    res.json({
      platform: 'youtube',
      title: 'Sample Video',
      thumbnail: 'https://via.placeholder.com/480x360',
      duration: 212,
      durationString: '3:32',
      uploader: 'Sample Channel',
      viewCount: 1000000,
      formats: [
        { id: '137', label: '1080p', resolution: '1920x1080', ext: 'mp4', filesize: 50000000, type: 'video' },
        { id: '22', label: '720p', resolution: '1280x720', ext: 'mp4', filesize: 30000000, type: 'video' },
        { id: '140', label: 'Audio Only', resolution: null, ext: 'mp3', filesize: 5000000, type: 'audio' }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download endpoint
app.post('/api/download', async (req, res) => {
  try {
    const { url, formatId, filename } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    res.json({ 
      message: 'Download endpoint ready',
      downloadUrl: 'https://example.com/sample.mp4'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});
