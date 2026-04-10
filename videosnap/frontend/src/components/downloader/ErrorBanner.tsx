'use client';
import { AlertTriangle, X } from 'lucide-react';

interface Props {
  message: string;
  onDismiss: () => void;
}

export function ErrorBanner({ message, onDismiss }: Props) {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20
                    text-sm text-[var(--error)] animate-slide-up">
      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <span className="flex-1 leading-snug">{message}</span>
      <button
        onClick={onDismiss}
        className="flex-shrink-0 hover:opacity-70 transition-opacity mt-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
