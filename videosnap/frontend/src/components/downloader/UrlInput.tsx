'use client';
import { useRef, KeyboardEvent } from 'react';
import { Link, X, Loader2, ArrowRight, Clipboard } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  placeholder: string;
  loading: boolean;
  platformColor: string;
}

export function UrlInput({ value, onChange, onSubmit, onClear, placeholder, loading, platformColor }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim() && !loading) onSubmit();
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) onChange(text.trim());
    } catch {}
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-[var(--text-muted)] mb-2 font-display uppercase tracking-wide">
        Paste video URL
      </label>
      <div
        className="flex items-center gap-2 rounded-xl border transition-all duration-200 overflow-hidden"
        style={{
          background: 'var(--bg-input)',
          borderColor: value ? `${platformColor}55` : 'var(--border)',
          boxShadow: value ? `0 0 0 3px ${platformColor}12` : 'none',
        }}
      >
        {/* Icon */}
        <div className="pl-3 flex-shrink-0 text-[var(--text-subtle)]">
          <Link className="w-4 h-4" />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          disabled={loading}
          className="flex-1 bg-transparent py-3 text-sm text-[var(--text-primary)]
                     placeholder:text-[var(--text-subtle)] outline-none min-w-0
                     disabled:opacity-50"
          autoComplete="off"
          spellCheck={false}
        />

        {/* Actions */}
        <div className="flex items-center pr-1.5 gap-0.5 flex-shrink-0">
          {!value && (
            <button
              onClick={handlePaste}
              title="Paste from clipboard"
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)]
                         hover:bg-[var(--accent-glow)] transition-colors"
            >
              <Clipboard className="w-4 h-4" />
            </button>
          )}

          {value && !loading && (
            <button
              onClick={onClear}
              title="Clear"
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)]
                         hover:bg-red-500/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Analyze button */}
      <button
        onClick={onSubmit}
        disabled={!value.trim() || loading}
        className="w-full mt-3 py-3 rounded-xl font-semibold font-display text-sm
                   flex items-center justify-center gap-2
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 text-white
                   hover:opacity-90 active:scale-[0.99]"
        style={{
          background: `linear-gradient(135deg, ${platformColor}, ${platformColor}cc)`,
          boxShadow: value.trim() ? `0 4px 16px ${platformColor}40` : 'none',
        }}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            Fetch Video
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}
