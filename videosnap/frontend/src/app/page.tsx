import { Header } from '../components/ui/Header';
import { DownloaderApp } from '../components/downloader/DownloaderApp';
import { RecentDownloads } from '../components/downloader/RecentDownloads';
import { Footer } from '../components/ui/Footer';
import { FAQ } from '../components/ui/FAQ';

export default function Home() {
  return (
    <main className="mesh-bg min-h-screen relative z-10">
      <Header />

      {/* Hero Section */}
      <section className="pt-16 pb-8 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6
                          bg-[var(--accent-glow)] text-[var(--accent)] border border-[var(--border-focus)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse-slow" />
            Free · No signup · No limits
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4
                         text-[var(--text-primary)] leading-[1.1]">
            Download any video,{' '}
            <span className="text-[var(--accent)]">anywhere.</span>
          </h1>

          <p className="text-[var(--text-muted)] text-lg max-w-xl mx-auto leading-relaxed">
            Paste a link from YouTube, Instagram, Facebook, or X — get your video in seconds.
            No ads, no fluff, just downloads.
          </p>
        </div>
      </section>

      {/* Main Downloader */}
      <section className="px-4 pb-12">
        <div className="max-w-3xl mx-auto">
          <DownloaderApp />
        </div>
      </section>

      {/* Recent Downloads */}
      <section className="px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <RecentDownloads />
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      <Footer />
    </main>
  );
}
