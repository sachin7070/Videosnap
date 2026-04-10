export type Platform = 'youtube' | 'instagram' | 'facebook' | 'twitter' | 'auto';

export function detectPlatform(url: string): Platform | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace('www.', '').toLowerCase();
    if (host.includes('youtube.com') || host === 'youtu.be') return 'youtube';
    if (host.includes('instagram.com')) return 'instagram';
    if (host.includes('facebook.com') || host === 'fb.watch') return 'facebook';
    if (host.includes('twitter.com') || host.includes('x.com')) return 'twitter';
    return null;
  } catch {
    return null;
  }
}

export const PLATFORMS = [
  {
    id: 'youtube' as Platform,
    label: 'YouTube',
    color: '#FF0000',
    glow: 'rgba(255,0,0,0.15)',
    placeholder: 'https://youtube.com/watch?v=...',
    icon: 'YT',
    gradient: 'from-red-500/10 to-red-600/5',
    examples: ['youtube.com/watch?v=...', 'youtu.be/...', 'youtube.com/shorts/...'],
  },
  {
    id: 'instagram' as Platform,
    label: 'Instagram',
    color: '#E1306C',
    glow: 'rgba(225,48,108,0.15)',
    placeholder: 'https://instagram.com/reel/...',
    icon: 'IG',
    gradient: 'from-pink-500/10 to-purple-600/5',
    examples: ['instagram.com/reel/...', 'instagram.com/p/...', 'instagram.com/stories/...'],
  },
  {
    id: 'facebook' as Platform,
    label: 'Facebook',
    color: '#1877F2',
    glow: 'rgba(24,119,242,0.15)',
    placeholder: 'https://facebook.com/watch?v=...',
    icon: 'FB',
    gradient: 'from-blue-500/10 to-blue-600/5',
    examples: ['facebook.com/watch?v=...', 'fb.watch/...'],
  },
  {
    id: 'twitter' as Platform,
    label: 'X / Twitter',
    color: '#1DA1F2',
    glow: 'rgba(29,161,242,0.15)',
    placeholder: 'https://x.com/user/status/...',
    icon: 'X',
    gradient: 'from-sky-500/10 to-sky-600/5',
    examples: ['x.com/.../status/...', 'twitter.com/.../status/...'],
  },
] as const;
