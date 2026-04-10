'use client';
import { Moon, Sun, Zap } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function Header() {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center
                          shadow-lg shadow-[var(--accent-glow)]">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-lg text-[var(--text-primary)] tracking-tight">
            VideoSnap
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-9 h-9 rounded-xl flex items-center justify-center
                       bg-[var(--bg-card)] border border-[var(--border)]
                       text-[var(--text-muted)] hover:text-[var(--accent)]
                       hover:border-[var(--border-focus)] transition-all duration-200
                       hover:shadow-sm hover:shadow-[var(--accent-glow)]"
          >
            {theme === 'dark'
              ? <Sun className="w-4 h-4" />
              : <Moon className="w-4 h-4" />
            }
          </button>
        </div>
      </div>
    </header>
  );
}
