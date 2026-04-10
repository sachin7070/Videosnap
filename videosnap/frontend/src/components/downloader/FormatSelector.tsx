'use client';
import { Monitor, Music, Check } from 'lucide-react';
import type { VideoFormat } from '../../lib/api';
import { formatFileSize } from '../../lib/api';

interface Props {
  formats: VideoFormat[];
  selected: string;
  onChange: (id: string) => void;
  platformColor: string;
}

export function FormatSelector({ formats, selected, onChange, platformColor }: Props) {
  if (formats.length === 0) return null;

  const videoFormats = formats.filter(f => f.type === 'video');
  const audioFormats = formats.filter(f => f.type === 'audio');

  return (
    <div className="space-y-3 animate-slide-up">
      <label className="block text-xs font-semibold text-[var(--text-muted)] font-display uppercase tracking-wide">
        Select Quality
      </label>

      {videoFormats.length > 0 && (
        <div className="space-y-1.5">
          {videoFormats.map(format => (
            <FormatOption
              key={format.id}
              format={format}
              selected={selected === format.id}
              onClick={() => onChange(format.id)}
              platformColor={platformColor}
            />
          ))}
        </div>
      )}

      {audioFormats.length > 0 && (
        <>
          <div className="flex items-center gap-2 pt-1">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-xs text-[var(--text-subtle)] font-medium">Audio</span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>
          <div className="space-y-1.5">
            {audioFormats.map(format => (
              <FormatOption
                key={format.id}
                format={format}
                selected={selected === format.id}
                onClick={() => onChange(format.id)}
                platformColor={platformColor}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FormatOption({
  format,
  selected,
  onClick,
  platformColor,
}: {
  format: VideoFormat;
  selected: boolean;
  onClick: () => void;
  platformColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left
        transition-all duration-150
        ${selected
          ? 'border-[var(--border-focus)]'
          : 'border-[var(--border)] hover:border-[var(--border-focus)]/50 bg-[var(--bg-input)] hover:bg-[var(--bg-card)]'
        }
      `}
      style={selected ? {
        background: `${platformColor}10`,
        borderColor: `${platformColor}55`,
      } : {}}
    >
      {/* Icon */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: selected ? `${platformColor}20` : 'var(--bg-input)' }}
      >
        {format.type === 'audio'
          ? <Music className="w-4 h-4" style={{ color: selected ? platformColor : 'var(--text-muted)' }} />
          : <Monitor className="w-4 h-4" style={{ color: selected ? platformColor : 'var(--text-muted)' }} />
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="font-semibold text-sm font-display"
            style={{ color: selected ? platformColor : 'var(--text-primary)' }}
          >
            {format.label}
          </span>
          {format.fps && format.fps > 30 && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: `${platformColor}20`, color: platformColor }}
            >
              {format.fps}fps
            </span>
          )}
        </div>
        <div className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-2">
          {format.resolution && <span>{format.resolution}</span>}
          {format.resolution && format.filesize && <span>·</span>}
          {format.filesize && <span>{formatFileSize(format.filesize)}</span>}
          {!format.resolution && !format.filesize && (
            <span>{format.ext.toUpperCase()}</span>
          )}
        </div>
      </div>

      {/* Check */}
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
                    transition-all duration-150
                    ${selected ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        style={{ background: platformColor }}
      >
        <Check className="w-3 h-3 text-white" strokeWidth={3} />
      </div>
    </button>
  );
}
