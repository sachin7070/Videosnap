const { validationResult } = require('express-validator');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const { detectPlatform } = require('../utils/platformDetector');
const { TEMP_DIR } = require('../utils/cleanup');
const logger = require('../utils/logger');

const YT_DLP_PATH = process.env.YT_DLP_PATH || 'yt-dlp';

async function downloadVideo(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { url, formatId, filename: userFilename } = req.body;
  const platform = detectPlatform(url);

  if (platform === 'unknown') {
    return res.status(400).json({ error: 'Unsupported platform.' });
  }

  const jobId = uuidv4();
  const ext = formatId?.includes('audio') || formatId === 'audio' ? 'mp3' : 'mp4';
  const safeFilename = (userFilename || `videosnap-${jobId}`).replace(/[^a-z0-9_\-]/gi, '_');
  const outputFilename = `${safeFilename}.${ext}`;
  const outputPath = path.join(TEMP_DIR, `${jobId}.%(ext)s`);

  logger.info(`Download job ${jobId}: ${url} | format: ${formatId}`);

  try {
    await fs.ensureDir(TEMP_DIR);

    // Build yt-dlp args
    const args = buildArgs(url, formatId, outputPath);

    // Run yt-dlp
    await new Promise((resolve, reject) => {
      const proc = spawn(YT_DLP_PATH, args, {
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
      });

      let stderr = '';
      proc.stderr.on('data', d => { stderr += d.toString(); });
      proc.on('close', code => {
        if (code !== 0) {
          return reject(new Error(parseError(stderr)));
        }
        resolve();
      });
      proc.on('error', err => {
        if (err.code === 'ENOENT') {
          return reject(new Error('yt-dlp is not installed on this server.'));
        }
        reject(err);
      });

      // Abort if client disconnects
      req.on('close', () => proc.kill('SIGTERM'));
    });

    // Find the output file (yt-dlp sets the actual extension)
    const files = await fs.readdir(TEMP_DIR);
    const outputFile = files.find(f => f.startsWith(jobId));

    if (!outputFile) {
      throw new Error('Download failed — output file not found.');
    }

    const fullOutputPath = path.join(TEMP_DIR, outputFile);
    const stat = await fs.stat(fullOutputPath);
    const finalExt = path.extname(outputFile).slice(1) || ext;
    const finalFilename = `${safeFilename}.${finalExt}`;

    // Stream file to client
    res.setHeader('Content-Disposition', `attachment; filename="${finalFilename}"`);
    res.setHeader('Content-Type', getMimeType(finalExt));
    res.setHeader('Content-Length', stat.size);
    res.setHeader('X-Job-Id', jobId);

    const stream = fs.createReadStream(fullOutputPath);
    stream.pipe(res);

    // Clean up after sending
    stream.on('end', () => {
      fs.remove(fullOutputPath).catch(() => {});
      logger.info(`Download job ${jobId} complete, file cleaned up`);
    });

    stream.on('error', err => {
      logger.error(`Stream error for job ${jobId}: ${err.message}`);
      if (!res.headersSent) next(err);
    });

  } catch (err) {
    logger.error(`Download error for job ${jobId}: ${err.message}`);
    // Clean up any partial files
    try {
      const files = await fs.readdir(TEMP_DIR);
      const partial = files.filter(f => f.startsWith(jobId));
      await Promise.all(partial.map(f => fs.remove(path.join(TEMP_DIR, f))));
    } catch {}

    next(err);
  }
}

function buildArgs(url, formatId, outputPath) {
  const args = ['--no-warnings', '--no-playlist', '-o', outputPath];

  if (!formatId || formatId === 'best') {
    args.push('-f', 'best[ext=mp4]/best');
  } else if (formatId === 'audio' || formatId?.startsWith('audio')) {
    args.push('-f', 'bestaudio', '-x', '--audio-format', 'mp3', '--audio-quality', '0');
  } else if (formatId.includes('+')) {
    // Merge format: video_id+audio_id
    args.push('-f', formatId, '--merge-output-format', 'mp4');
  } else {
    args.push('-f', `${formatId}+bestaudio/best[format_id=${formatId}]/${formatId}`);
    args.push('--merge-output-format', 'mp4');
  }

  args.push(url);
  return args;
}

function parseError(stderr) {
  if (stderr.includes('Private video') || stderr.includes('private')) {
    return 'This video is private.';
  }
  if (stderr.includes('unavailable') || stderr.includes('not available')) {
    return 'This video is unavailable or removed.';
  }
  if (stderr.includes('login') || stderr.includes('age')) {
    return 'This content requires login or age verification.';
  }
  const last = stderr.split('\n').filter(Boolean).pop();
  return last || 'Download failed.';
}

function getMimeType(ext) {
  const types = {
    mp4: 'video/mp4',
    webm: 'video/webm',
    mkv: 'video/x-matroska',
    mp3: 'audio/mpeg',
    m4a: 'audio/mp4',
    ogg: 'audio/ogg',
  };
  return types[ext] || 'application/octet-stream';
}

module.exports = { downloadVideo };
