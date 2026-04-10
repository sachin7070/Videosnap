'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Is VideoSnap free to use?',
    a: 'Yes, completely free. No account required, no limits, no watermarks.',
  },
  {
    q: 'Which platforms are supported?',
    a: 'YouTube (including Shorts), Instagram (Reels, Posts, Stories), Facebook videos, and X/Twitter videos. More platforms may be added.',
  },
  {
    q: 'What video qualities are available?',
    a: 'For YouTube, we offer up to 4K (2160p), 2K (1440p), 1080p, 720p, 480p, 360p, and audio-only. For other platforms, we offer the best available quality.',
  },
  {
    q: 'Why can\'t I download a video?',
    a: 'Private, age-restricted, or region-locked videos cannot be downloaded. Some content may require the creator\'s account to be accessible. Also ensure the URL is correct.',
  },
  {
    q: 'Are downloads stored on your servers?',
    a: 'Temporarily — files are auto-deleted within 30 minutes. We do not permanently store any downloaded content.',
  },
  {
    q: 'Is this legal?',
    a: 'Downloading videos for personal offline use is generally acceptable, but redistributing copyrighted content is not. Always respect the platform\'s Terms of Service and content creators\' rights.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--border)] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4
                   text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
      >
        <span className="font-medium text-sm">{q}</span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 text-[var(--text-muted)] transition-transform duration-200
                      ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm text-[var(--text-muted)] leading-relaxed animate-slide-up">
          {a}
        </p>
      )}
    </div>
  );
}

export function FAQ() {
  return (
    <section className="px-4 pb-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-6">
          Frequently Asked Questions
        </h2>
        <div className="glass rounded-2xl px-6">
          {FAQS.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
