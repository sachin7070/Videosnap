'use client';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('');

  const analyzeVideo = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    return res.json();
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const info = await analyzeVideo();
      setVideoInfo(info);
      if (info.formats?.length) setSelectedFormat(info.formats[0].id);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, formatId: selectedFormat }),
      });
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'video.mp4';
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>VideoSnap</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste video URL"
        style={{ width: '100%', padding: '0.5rem', margin: '1rem 0' }}
      />
      <button onClick={handleAnalyze} disabled={loading} style={{ width: '100%', padding: '0.5rem' }}>
        {loading ? 'Loading...' : 'Analyze'}
      </button>
      {videoInfo && (
        <div style={{ marginTop: '1rem' }}>
          <h2>{videoInfo.title}</h2>
          <select value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)}>
            {videoInfo.formats?.map((f) => (
              <option key={f.id} value={f.id}>{f.label || f.quality}</option>
            ))}
          </select>
          <button onClick={handleDownload} style={{ marginTop: '1rem', width: '100%' }}>
            Download
          </button>
        </div>
      )}
    </div>
  );
}
