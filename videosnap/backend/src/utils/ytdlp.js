const { spawn } = require('child_process');
const logger = require('./logger');

const YT_DLP_PATH = process.env.YT_DLP_PATH || 'yt-dlp';

/**
 * Run yt-dlp with given arguments and return parsed JSON output.
 */
function runYtDlp(args, options = {}) {
  return new Promise((resolve, reject) => {
    const timeout = options.timeout || 60000; // 60s default
    const proc = spawn(YT_DLP_PATH, args, {
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', d => { stdout += d.toString(); });
    proc.stderr.on('data', d => { stderr += d.toString(); });

    const timer = setTimeout(() => {
      proc.kill('SIGTERM');
      reject(new Error('yt-dlp process timed out'));
    }, timeout);

    proc.on('close', code => {
      clearTimeout(timer);
      if (code !== 0) {
        logger.error(`yt-dlp error (code ${code}): ${stderr}`);
        // Parse common errors
        if (stderr.includes('Private video') || stderr.includes('private')) {
          return reject(new Error('This video is private and cannot be downloaded.'));
        }
        if (stderr.includes('not available') || stderr.includes('unavailable')) {
          return reject(new Error('This video is unavailable or has been removed.'));
        }
        if (stderr.includes('age') || stderr.includes('login')) {
          return reject(new Error('This content requires login or age verification.'));
        }
        return reject(new Error(stderr.split('\n').filter(Boolean).pop() || 'Failed to process video'));
      }
      resolve(stdout);
    });

    proc.on('error', err => {
      clearTimeout(timer);
      if (err.code === 'ENOENT') {
        return reject(new Error('yt-dlp is not installed. Please install it on the server.'));
      }
      reject(err);
    });
  });
}

/**
 * Get video metadata as JSON from yt-dlp.
 */
async function getVideoInfo(url) {
  const output = await runYtDlp([
    '--dump-json',
    '--no-playlist',
    '--no-warnings',
    url,
  ], { timeout: 30000 });

  return JSON.parse(output.trim());
}

/**
 * Download a video to a specific path with given format.
 * Returns a promise that resolves when done.
 */
function downloadToFile(url, outputPath, formatId, options = {}) {
  const args = [
    '-f', formatId,
    '--no-playlist',
    '--no-warnings',
    '-o', outputPath,
  ];

  if (options.mergeFormat) {
    args.push('--merge-output-format', options.mergeFormat);
  }

  args.push(url);
  return runYtDlp(args, { timeout: 300000 }); // 5 min max
}

module.exports = { runYtDlp, getVideoInfo, downloadToFile };
