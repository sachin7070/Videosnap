import type { Metadata } from 'next';
import '../styles/globals.css';
import { ThemeProvider } from '../components/ui/ThemeProvider';

export const metadata: Metadata = {
  title: 'VideoSnap — Download Videos from YouTube, Instagram & More',
  description:
    'Free multi-platform video downloader. Download videos from YouTube, Instagram Reels, Facebook, and X/Twitter in HD quality. Fast, free, no signup required.',
  keywords: [
    'video downloader',
    'youtube downloader',
    'instagram reels downloader',
    'facebook video download',
    'twitter video download',
    'download online videos',
    'HD video downloader',
  ],
  authors: [{ name: 'VideoSnap' }],
  openGraph: {
    title: 'VideoSnap — Multi-Platform Video Downloader',
    description: 'Download videos from YouTube, Instagram, Facebook & X/Twitter instantly.',
    type: 'website',
    url: 'https://videosnap.app',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'VideoSnap' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VideoSnap — Video Downloader',
    description: 'Download videos from YouTube, Instagram, Facebook & X.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f8fc' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a14' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
