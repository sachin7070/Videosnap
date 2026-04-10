const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : '/api';

export interface VideoFormat {
  id: string;
  label: string;
  resolution: string | null;
  ext: string;
  filesize: number | null;
  fps: number | null;
  type: 'video' | 'audio';
  needsMerge?: boolean;
}

export interface VideoMetadata {
  platform: 'youtube' | 'instagram' | 'facebook' | 'twitter';
  title: string;
  description: string | null;
  thumbnail: string | null;
  duration: number | null;
  durationString: string | null;
  uploader: string | null;
  uploadDate: string | null;
  viewCount: number | null;
  likeCount: number | null;
  formats: VideoFormat[];
  originalUrl: string;
  cached?: boolean;
}

export async function analyzeUrl(url: string): Promise<VideoMetadata> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to analyze video');
  return data;
}

export function buildDownloadUrl(url: string, formatId: string, filename: string): string {
  // We POST to /api/download — use a form submit trick for streaming
  return `${API_BASE}/download`;
}

export async function startDownload(
  url: string,
  formatId: string,
  filename: string,
  onProgress?: (pct: number) => void
): Promise<void> {
  const res = await fetch(`${API_BASE}/download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, formatId, filename }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Download failed');
  }

  const contentDisposition = res.headers.get('content-disposition');
  let dlFilename = filename;
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]+)"?/);
    if (match) dlFilename = match[1];
  }

  const contentLength = res.headers.get('content-length');
  const total = contentLength ? parseInt(contentLength) : 0;
  let received = 0;

  const reader = res.body!.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    if (total && onProgress) {
      onProgress(Math.min(99, Math.round((received / total) * 100)));
    }
  }

  onProgress?.(100);

  // Trigger browser download
  const blob = new Blob(chunks);
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = dlFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
}

export function formatFileSize(bytes: number | null): string {
  if (!bytes) return 'Unknown size';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function formatDuration(seconds: number | null): string {
  if (!seconds) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatNumber(n: number | null): string {
  if (!n) return '';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
