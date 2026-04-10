const express = require('express');
const router = express.Router();
const { analyzeVideo } = require('./controllers/analyzeController');
const { downloadVideo } = require('./controllers/downloadController');
const { validateAnalyze, validateDownload } = require('./middleware/validators');
const { optionalApiKey } = require('./middleware/auth');

// Apply optional API key middleware
router.use(optionalApiKey);

// POST /api/analyze — Fetch video metadata & available formats
router.post('/analyze', validateAnalyze, analyzeVideo);

// POST /api/download — Stream or generate downloadable file
router.post('/download', validateDownload, downloadVideo);

module.exports = router;
