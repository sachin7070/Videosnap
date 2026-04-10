/**
 * Detects the platform from a given URL.
 * Returns: 'youtube' | 'instagram' | 'facebook' | 'twitter' | 'unknown'
 */
function detectPlatform(url) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase().replace('www.', '');

    if (hostname.includes('youtube.com') || hostname === 'youtu.be') {
      return 'youtube';
    }
    if (hostname.includes('instagram.com')) {
      return 'instagram';
    }
    if (hostname.includes('facebook.com') || hostname === 'fb.watch') {
      return 'facebook';
    }
    if (hostname.includes('twitter.com') || hostname.includes('x.com') || hostname.includes('t.co')) {
      return 'twitter';
    }
    if (hostname.includes('tiktok.com')) {
      return 'tiktok';
    }
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Validates that the URL is safe and not malicious.
 */
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    // Only allow http/https
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    // Block private/local IPs
    const hostname = parsed.hostname;
    const privatePatterns = [
      /^localhost$/i,
      /^127\./,
      /^10\./,
      /^192\.168\./,
      /^172\.(1[6-9]|2\d|3[01])\./,
      /^::1$/,
      /^0\.0\.0\.0$/,
    ];
    if (privatePatterns.some(p => p.test(hostname))) return false;
    return true;
  } catch {
    return false;
  }
}

module.exports = { detectPlatform, isValidUrl };
