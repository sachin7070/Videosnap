const fs = require('fs-extra');
const path = require('path');
const logger = require('./logger');

const TEMP_DIR = path.join(__dirname, '../../temp');
const MAX_AGE_MINUTES = parseInt(process.env.TEMP_FILE_TTL_MINUTES || '30', 10);

async function cleanOldFiles() {
  try {
    await fs.ensureDir(TEMP_DIR);
    const files = await fs.readdir(TEMP_DIR);
    const now = Date.now();
    let cleaned = 0;

    for (const file of files) {
      const filePath = path.join(TEMP_DIR, file);
      try {
        const stat = await fs.stat(filePath);
        const ageMinutes = (now - stat.mtimeMs) / 1000 / 60;
        if (ageMinutes > MAX_AGE_MINUTES) {
          await fs.remove(filePath);
          cleaned++;
        }
      } catch (err) {
        // File already removed or inaccessible
      }
    }

    if (cleaned > 0) {
      logger.info(`Cleanup: removed ${cleaned} expired temp file(s)`);
    }
  } catch (err) {
    logger.error('Cleanup error:', err);
  }
}

function setupTempCleanup() {
  // Run cleanup every 10 minutes
  fs.ensureDir(TEMP_DIR).then(() => {
    cleanOldFiles(); // Run immediately on startup
    setInterval(cleanOldFiles, 10 * 60 * 1000);
    logger.info(`Temp cleanup scheduled every 10 min (TTL: ${MAX_AGE_MINUTES} min)`);
  });
}

module.exports = { setupTempCleanup, cleanOldFiles, TEMP_DIR };
