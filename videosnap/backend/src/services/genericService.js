const { getVideoInfo } = require('../utils/ytdlp');
const logger = require('../utils/logger');

/**
 * Generic analyzer for Instagram, Facebook, Twitter/X.
 * yt-dlp handles all three natively.
 */
async function analyzeGeneric(url, platform) {
  logger.info(`Analyzing ${platform}: ${url}`);
  const info = await getVideoInfo(url);

  // Build format list — prefer best available
  const formats = buildGenericFormats(info);

  return {
    platform,
    title: info.title || info.description?.slice(0, 80) || `${platform} Video`,
    description: info.description?.slice(0, 300) || null,
    thumbnail: info.thumbnail,
    duration: info.duration,
    durationString: info.duration_string || null,
    uploader: info.uploader || info.channel || null,
    uploadDate: info.upload_date || null,
    viewCount: info.view_count || null,
    likeCount: info.like_count || null,
    formats,
    originalUrl: url,
  };
}

function buildGenericFormats(info) {
  const formats = [];
  const allFormats = info.formats || [];

  // Combined video+audio formats, sorted by quality
  const combined = allFormats
    .filter(f => f.vcodec !== 'none' && f.acodec !== 'none' && f.height)
    .sort((a, b) => (b.height || 0) - (a.height || 0));

  const seen = new Set();
  for (const f of combined) {
    const key = f.height;
    if (seen.has(key)) continue;
    seen.add(key);
    formats.push({
      id: f.format_id,
      label: `${f.height}p`,
      resolution: `${f.width || '?'}x${f.height}`,
      ext: f.ext || 'mp4',
      filesize: f.filesize || f.filesize_approx || null,
      fps: f.fps || null,
      type: 'video',
    });
  }

  // If no combined, try best available
  if (formats.length === 0 && allFormats.length > 0) {
    const best = allFormats[allFormats.length - 1];
    formats.push({
      id: best.format_id,
      label: 'Best Quality',
      resolution: best.height ? `${best.width}x${best.height}` : null,
      ext: best.ext || 'mp4',
      filesize: best.filesize || best.filesize_approx || null,
      fps: best.fps || null,
      type: 'video',
    });
  }

  // Always add a "Best" option using yt-dlp's best selector
  if (!formats.find(f => f.id === 'best')) {
    formats.unshift({
      id: 'best',
      label: 'Best Available',
      resolution: null,
      ext: 'mp4',
      filesize: null,
      fps: null,
      type: 'video',
    });
  }

  return formats;
}

async function analyzeInstagram(url) {
  return analyzeGeneric(url, 'instagram');
}

async function analyzeFacebook(url) {
  return analyzeGeneric(url, 'facebook');
}

async function analyzeTwitter(url) {
  return analyzeGeneric(url, 'twitter');
}

module.exports = { analyzeInstagram, analyzeFacebook, analyzeTwitter };
