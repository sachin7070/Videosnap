'use client';
import Image from 'next/image';
import { Clock, Trash2, X, History } from 'lucide-react';
import { useDownloadHistory } from '../../hooks/useDownloadHistory';

const PLATFORM_COLORS: Record<string, string> = {
  youtube:   '#FF0000',
  instagram: '#E1306C',
  facebook:  '#1877F2',
  twitter:   '#1DA1F2',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return 'Just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function RecentDownloads() {
  const { history, clearHistory, removeItem } = useDownloadHistory();

  if (history.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold font-display text-[var(--text-muted)]">
          <History className="w-4 h-4" />
          Recent Downloads
        </div>
        <button
          onClick={clearHistory}
          className="flex items-center gap-1 text-xs text-[var(--text-subtle)]
                     hover:text-[var(--error)] transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Clear all
        </button>
      </div>

      <div className="space-y-2">
        {history.map(item => {
          const color = PLATFORM_COLORS[item.platform] || '#6470f1';
          return (
            <div
              key={item.id}
              className="glass rounded-xl flex items-center gap-3 p-3 group
                         hover:border-[var(--border-focus)]/40 transition-all"
            >
              {/* Thumbnail */}
              <div className="w-14 h-10 rounded-lg overflow-hidden flex-shrink-0
                              bg-[var(--bg-input)] relative">
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ background: color }}
                    />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[var(--text-primary)] truncate leading-snug">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                    style={{ background: `${color}20`, color }}
                  >
                    {item.platform}
                  </span>
                  <span className="text-[10px] text-[var(--text-subtle)]">{item.formatLabel}</span>
                  <span className="text-[10px] text-[var(--text-subtle)] flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {timeAgo(item.downloadedAt)}
                  </span>
                </div>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg
                           text-[var(--text-subtle)] hover:text-[var(--error)]
                           hover:bg-red-500/10 transition-all flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
