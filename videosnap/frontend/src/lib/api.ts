// frontend/src/lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface VideoFormat {
  id: string;
  label: string;
  resolution: string | null;
  ext: string;
  filesize: number | null;
  type: 'video' | 'audio';
}

export interface VideoInfo {
  platform: string;
  title: string;
  thumbnail: string;
  duration: number;
  durationString: string;
  uploader: string;
  viewCount: number;
  formats: VideoFormat[];
}

export async function analyzeVideo(url: string): Promise<VideoInfo> {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to analyze video');
  }

  return response.json();
}

export async function downloadVideo(
  url: string,
  formatId: string,
  filename: string,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const response = await fetch(`${API_BASE}/download`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, formatId, filename }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to download video');
  }

  const contentLength = response.headers.get('content-length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;
  const reader = response.body?.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  if (!reader) {
    throw new Error('Response body is null');
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    chunks.push(value);
    received += value.length;
    
    if (onProgress && total > 0) {
      onProgress((received / total) * 100);
    }
  }

  // Fix: Convert Uint8Array[] to Blob directly without type assertion issues
  const blob = new Blob(chunks);
  return blob;
}

export async function saveDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
