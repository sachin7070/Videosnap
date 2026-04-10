'use client';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';

interface Props {
  state: 'idle' | 'analyzing' | 'ready' | 'downloading' | 'done';
  progress: number;
  onClick: () => void;
  disabled: boolean;
  platformColor: string;
}

export function DownloadButton({ state, progress, onClick, disabled, platformColor }: Props) {
  const isDownloading = state === 'downloading';
  const isDone = state === 'done';

  return (
    <div className="animate-slide-up">
      <button
        onClick={onClick}
        disabled={disabled || isDownloading || isDone}
        className="relative w-full py-3.5 rounded-xl font-bold font-display text-sm
                   flex items-center justify-center gap-2 overflow-hidden
                   text-white transition-all duration-200
                   disabled:opacity-60 disabled:cursor-not-allowed
                   active:scale-[0.99]"
        style={{
          background: isDone
            ? 'var(--success)'
            : `linear-gradient(135deg, ${platformColor}, ${platformColor}dd)`,
          boxShadow: disabled ? 'none' : `0 4px 20px ${isDone ? 'rgba(34,197,94,0.35)' : platformColor + '40'}`,
        }}
      >
        {/* Progress bar */}
        {isDownloading && (
          <div
            className="absolute inset-0 origin-left transition-transform duration-300"
            style={{
              background: 'rgba(255,255,255,0.15)',
              transform: `scaleX(${progress / 100})`,
            }}
          />
        )}

        {/* Content */}
        <span className="relative flex items-center gap-2">
          {isDone ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Downloaded!
            </>
          ) : isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {progress > 0 ? `Downloading... ${progress}%` : 'Preparing...'}
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download Video
            </>
          )}
        </span>
      </button>

      {isDownloading && progress > 0 && (
        <div className="mt-2 h-1 bg-[var(--bg-input)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${platformColor}, ${platformColor}aa)`,
            }}
          />
        </div>
      )}
    </div>
  );
}
