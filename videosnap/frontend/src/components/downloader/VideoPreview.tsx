'use client';
import Image from 'next/image';
import { Clock, Eye, ThumbsUp, User, Calendar } from 'lucide-react';
import type { VideoMetadata } from '../../lib/api';
import { formatDuration, formatNumber } from '../../lib/api';

interface Props {
  metadata: VideoMetadata;
}

export function VideoPreview({ metadata }: Props) {
  const uploadDate = metadata.uploadDate
    ? `${metadata.uploadDate.slice(0, 4)}-${metadata.uploadDate.slice(4, 6)}-${metadata.uploadDate.slice(6, 8)}`
    : null;

  return (
    <div className="rounded-xl overflow-hidden border border-[var(--border)] animate-slide-up">
      {/* Thumbnail */}
      {metadata.thumbnail && (
        <div className="relative aspect-video bg-[var(--bg-input)]">
          <Image
            src={metadata.thumbnail}
            alt={metadata.title}
            fill
            className="object-cover"
            unoptimized // Allow external URLs
          />
          {metadata.durationString && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs
                            font-mono px-1.5 py-0.5 rounded-md">
              {metadata.durationString}
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="p-4 bg-[var(--bg-card)] space-y-2">
        <h3 className="font-display font-semibold text-sm text-[var(--text-primary)] leading-snug
                       line-clamp-2">
          {metadata.title}
        </h3>

        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
          {metadata.uploader && (
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {metadata.uploader}
            </span>
          )}
          {metadata.viewCount != null && (
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatNumber(metadata.viewCount)} views
            </span>
          )}
          {metadata.likeCount != null && (
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              {formatNumber(metadata.likeCount)}
            </span>
          )}
          {metadata.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(metadata.duration)}
            </span>
          )}
          {uploadDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {uploadDate}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
