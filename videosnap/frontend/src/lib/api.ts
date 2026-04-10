const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function analyzeVideo(url: string) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Analysis failed');
  }
  
  return res.json();
}

export async function downloadVideo(url: string, formatId: string, filename: string) {
  const res = await fetch(`${API_BASE}/download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, formatId, filename }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Download failed');
  }
  
  const blob = await res.blob();
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
