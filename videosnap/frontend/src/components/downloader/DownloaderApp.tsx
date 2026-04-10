'use client';
import { useState, useCallback } from 'react';
import { PLATFORMS, detectPlatform, type Platform } from '../../lib/platforms';
import { analyzeUrl, startDownload, type VideoMetadata } from '../../lib/api';
import { useDownloadHistory } from '../../hooks/useDownloadHistory';
import { PlatformTabs } from './PlatformTabs';
import { UrlInput } from './UrlInput';
import { VideoPreview } from './VideoPreview';
import { FormatSelector } from './FormatSelector';
import { DownloadButton } from './DownloadButton';
import { ErrorBanner } from './ErrorBanner';

type AppState = 'idle' | 'analyzing' | 'ready' | 'downloading' | 'done';

export function DownloaderApp() {
  const [activePlatform, setActivePlatform] = useState<Platform>('youtube');
  const [url, setUrl] = useState('');
  const [state, setState] = useState<AppState>('idle');
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const { addToHistory } = useDownloadHistory();

  const activePlatformConfig = PLATFORMS.find(p => p.id === activePlatform)!;

  const handleUrlChange = useCallback((value: string) => {
    setUrl(value);
    setError(null);

    // Auto-detect platform from URL
    if (value.trim()) {
      const detected = detectPlatform(value.trim());
      if (detected) setActivePlatform(detected);
    }

    // Reset if URL cleared
    if (!value.trim()) {
      setMetadata(null);
      setState('idle');
      setSelectedFormat('');
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!url.trim()) return;
    setState('analyzing');
    setError(null);
    setMetadata(null);
    setSelectedFormat('');

    try {
      const data = await analyzeUrl(url.trim());
      setMetadata(data);
      // Pre-select best format
      if (data.formats.length > 0) {
        setSelectedFormat(data.formats[0].id);
      }
      setState('ready');
    } catch (err: any) {
      setError(err.message || 'Failed to analyze video. Check the URL and try again.');
      setState('idle');
    }
  }, [url]);

  const handleDownload = useCallback(async () => {
    if (!metadata || !selectedFormat) return;
    setState('downloading');
    setDownloadProgress(0);
    setError(null);

    const format = metadata.formats.find(f => f.id === selectedFormat);
    const safeTitle = metadata.title.replace(/[^a-z0-9\s\-_]/gi, '').trim().slice(0, 60) || 'video';

    try {
      await startDownload(url, selectedFormat, safeTitle, (pct) => {
        setDownloadProgress(pct);
      });

      setState('done');
      // Add to history
      addToHistory({
        url,
        title: metadata.title,
        platform: metadata.platform,
        thumbnail: metadata.thumbnail,
        formatLabel: format?.label || selectedFormat,
      });

      // Reset to ready after short delay
      setTimeout(() => setState('ready'), 2000);
    } catch (err: any) {
      setError(err.message || 'Download failed. Please try again.');
      setState('ready');
    }
  }, [metadata, selectedFormat, url, addToHistory]);

  const handleReset = () => {
    setUrl('');
    setMetadata(null);
    setState('idle');
    setError(null);
    setSelectedFormat('');
    setDownloadProgress(0);
  };

  return (
    <div className="space-y-4">
      {/* Platform Tabs */}
      <PlatformTabs
        active={activePlatform}
        onChange={(p) => {
          setActivePlatform(p);
          handleReset();
        }}
      />

      {/* Main Card */}
      <div
        className="glass rounded-2xl p-5 sm:p-6 space-y-4 transition-all duration-300"
        style={{ boxShadow: `0 0 0 1px ${activePlatformConfig.color}18, 0 8px 32px rgba(0,0,0,0.08)` }}
      >
        {/* URL Input */}
        <UrlInput
          value={url}
          onChange={handleUrlChange}
          onSubmit={handleAnalyze}
          placeholder={activePlatformConfig.placeholder}
          loading={state === 'analyzing'}
          platformColor={activePlatformConfig.color}
          onClear={handleReset}
        />

        {/* Error */}
        {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

        {/* Video Preview */}
        {state === 'analyzing' && <VideoPreviewSkeleton />}

        {metadata && state !== 'analyzing' && (
          <>
            <VideoPreview metadata={metadata} />

            <FormatSelector
              formats={metadata.formats}
              selected={selectedFormat}
              onChange={setSelectedFormat}
              platformColor={activePlatformConfig.color}
            />

            <DownloadButton
              state={state}
              progress={downloadProgress}
              onClick={handleDownload}
              disabled={!selectedFormat}
              platformColor={activePlatformConfig.color}
            />
          </>
        )}
      </div>
    </div>
  );
}

function VideoPreviewSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden animate-pulse space-y-3">
      <div className="shimmer h-44 rounded-xl" />
      <div className="space-y-2">
        <div className="shimmer h-4 rounded w-3/4" />
        <div className="shimmer h-3 rounded w-1/2" />
      </div>
    </div>
  );
}
