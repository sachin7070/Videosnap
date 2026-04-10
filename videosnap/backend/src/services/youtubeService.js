const { getVideoInfo } = require('../utils/ytdlp');
const logger = require('../utils/logger');

/**
 * Parse YouTube formats into a clean, sorted list.
 */
function parseFormats(info) {
  const formats = [];
  const seen = new Set();

  // Video+Audio combined formats
  const videoFormats = (info.formats || []).filter(f =>
    f.vcodec !== 'none' && f.acodec !== 'none' && f.height
  );

  // Sort by height descending
  videoFormats.sort((a, b) => (b.height || 0) - (a.height || 0));

  for (const f of videoFormats) {
    const label = getResolutionLabel(f.height);
    if (seen.has(label)) continue;
    seen.add(label);

    formats.push({
      id: f.format_id,
      label,
      resolution: `${f.width || '?'}x${f.height}`,
      ext: f.ext || 'mp4',
      filesize: f.filesize || f.filesize_approx || null,
      fps: f.fps || null,
      vcodec: f.vcodec,
      acodec: f.acodec,
      type: 'video',
    });
  }

  // Add audio-only option
  const audioFormats = (info.formats || []).filter(f =>
    f.vcodec === 'none' && f.acodec !== 'none'
  );
  audioFormats.sort((a, b) => (b.abr || 0) - (a.abr || 0));

  if (audioFormats.length > 0) {
    const best = audioFormats[0];
    formats.push({
      id: best.format_id,
      label: 'Audio Only',
      resolution: null,
      ext: 'mp3',
      filesize: best.filesize || best.filesize_approx || null,
      fps: null,
      vcodec: 'none',
      acodec: best.acodec,
      type: 'audio',
    });
  }

  // Add best adaptive formats (separate video+audio streams merged)
  const adaptiveVideo = (info.formats || []).filter(f =>
    f.vcodec !== 'none' && f.acodec === 'none' && f.height
  );
  adaptiveVideo.sort((a, b) => (b.height || 0) - (a.height || 0));

  const bestAudio = audioFormats[0];
  const addedAdaptive = new Set();

  for (const vf of adaptiveVideo) {
    const label = getResolutionLabel(vf.height) + ' (HD)';
    if (seen.has(vf.height) || addedAdaptive.has(vf.height)) continue;
    if (vf.height < 1080) continue; // Only add adaptive for 1080p+
    addedAdaptive.add(vf.height);

    formats.unshift({
      id: bestAudio ? `${vf.format_id}+${bestAudio.format_id}` : vf.format_id,
      label,
      resolution: `${vf.width || '?'}x${vf.height}`,
      ext: 'mp4',
      filesize: null,
      fps: vf.fps || null,
      vcodec: vf.vcodec,
      acodec: bestAudio?.acodec,
      type: 'video',
      needsMerge: true,
    });
  }

  return formats;
}

function getResolutionLabel(height) {
  if (!height) return 'Unknown';
  if (height >= 2160) return '4K (2160p)';
  if (height >= 1440) return '2K (1440p)';
  if (height >= 1080) return '1080p';
  if (height >= 720) return '720p';
  if (height >= 480) return '480p';
  if (height >= 360) return '360p';
  return `${height}p`;
}

/**
 * Analyze a YouTube URL and return metadata + formats.
 */
async function analyzeYouTube(url) {
  logger.info(`Analyzing YouTube: ${url}`);
  const info = await getVideoInfo(url);

  return {
    platform: 'youtube',
    title: info.title,
    description: info.description?.slice(0, 300) || null,
    thumbnail: info.thumbnail,
    duration: info.duration,
    durationString: info.duration_string,
    uploader: info.uploader,
    uploadDate: info.upload_date,
    viewCount: info.view_count,
    likeCount: info.like_count,
    formats: parseFormats(info),
    originalUrl: url,
  };
}

module.exports = { analyzeYouTube };
