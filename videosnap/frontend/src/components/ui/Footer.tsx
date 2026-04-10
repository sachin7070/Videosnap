import { Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-8 px-4 mt-4">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[var(--accent)] flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-sm text-[var(--text-primary)]">VideoSnap</span>
        </div>

        <p className="text-xs text-[var(--text-subtle)] text-center">
          For personal use only. Respect copyright and platform terms of service.
        </p>

        <p className="text-xs text-[var(--text-subtle)]">
          © {new Date().getFullYear()} VideoSnap
        </p>
      </div>
    </footer>
  );
}
