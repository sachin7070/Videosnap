'use client';

import { useState } from 'react';
import { analyzeVideo, downloadVideo } from '@/lib/api';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [selectedFormat, setSelectedFormat] = useState('');

  const handleAnalyze = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const info = await analyzeVideo(url);
      setVideoInfo(info);
      if (info.formats?.length) {
        setSelectedFormat(info.formats[0].id);
      }
    } catch (error) {
      alert('Error analyzing video');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!url || !selectedFormat) return;
    setLoading(true);
    try {
      const filename = videoInfo?.title?.replace(/[^a-z0-9]/gi, '_') || 'video';
      await downloadVideo(url, selectedFormat, `${filename}.mp4`);
    } catch (error) {
      alert('Error downloading video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          VideoSnap
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste video URL here..."
            className="w-full p-3 border rounded-lg mb-4 dark:bg-gray-700 dark:text-white"
          />
          
          <button
            onClick={handleAnalyze}
            disabled={loading || !url}
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Analyze Video'}
          </button>
          
          {videoInfo && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2 dark:text-white">{videoInfo.title}</h2>
              {videoInfo.thumbnail && (
                <img src={videoInfo.thumbnail} alt="Thumbnail" className="w-full rounded-lg mb-4" />
              )}
              
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full p-3 border rounded-lg mb-4 dark:bg-gray-700 dark:text-white"
              >
                {videoInfo.formats?.map((format: any) => (
                  <option key={format.id} value={format.id}>
                    {format.label || format.quality || format.resolution || format.ext}
                  </option>
                ))}
              </select>
              
              <button
                onClick={handleDownload}
                disabled={loading}
                className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
              >
                Download
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
