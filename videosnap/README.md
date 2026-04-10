# VideoSnap 🎬

**Multi-platform video downloader** — YouTube, Instagram, Facebook, X/Twitter.  
Built with Next.js 14 + Express + yt-dlp. Production-ready, Dockerized, mobile-first.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Platforms** | YouTube, Instagram (Reels/Posts/Stories), Facebook, X/Twitter |
| **Quality selector** | 4K, 2K, 1080p, 720p, 480p, 360p, Audio-only (YouTube) |
| **Auto-detect** | Platform auto-detected from pasted URL |
| **Video preview** | Thumbnail, title, duration, views, uploader |
| **Progress bar** | Real-time download progress |
| **Dark mode** | Persistent light/dark theme toggle |
| **History** | Recent downloads saved in localStorage |
| **Rate limiting** | Per-IP API rate limits (nginx + express) |
| **Streaming** | Downloads stream directly — minimal server storage |
| **Auto-cleanup** | Temp files deleted after 30 minutes |
| **SEO ready** | Full OpenGraph + Twitter card meta tags |

---

## 🗂 Project Structure

```
videosnap/
├── backend/                   # Node.js / Express API
│   ├── src/
│   │   ├── index.js           # Entry point
│   │   ├── routes.js          # Route definitions
│   │   ├── controllers/
│   │   │   ├── analyzeController.js
│   │   │   └── downloadController.js
│   │   ├── services/
│   │   │   ├── youtubeService.js
│   │   │   └── genericService.js  # Instagram, Facebook, Twitter
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   ├── rateLimiter.js
│   │   │   └── validators.js
│   │   └── utils/
│   │       ├── cache.js
│   │       ├── cleanup.js
│   │       ├── logger.js
│   │       ├── platformDetector.js
│   │       └── ytdlp.js
│   ├── temp/                  # Auto-cleaned download staging
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── frontend/                  # Next.js 14 + Tailwind CSS
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx     # Root layout + SEO metadata
│   │   │   └── page.tsx       # Home page
│   │   ├── components/
│   │   │   ├── downloader/
│   │   │   │   ├── DownloaderApp.tsx   # Main state machine
│   │   │   │   ├── PlatformTabs.tsx
│   │   │   │   ├── UrlInput.tsx
│   │   │   │   ├── VideoPreview.tsx
│   │   │   │   ├── FormatSelector.tsx
│   │   │   │   ├── DownloadButton.tsx
│   │   │   │   ├── ErrorBanner.tsx
│   │   │   │   └── RecentDownloads.tsx
│   │   │   └── ui/
│   │   │       ├── ThemeProvider.tsx
│   │   │       ├── Header.tsx
│   │   │       ├── Footer.tsx
│   │   │       └── FAQ.tsx
│   │   ├── hooks/
│   │   │   └── useDownloadHistory.ts
│   │   ├── lib/
│   │   │   ├── api.ts          # API client + helpers
│   │   │   └── platforms.ts    # Platform config
│   │   └── styles/
│   │       └── globals.css
│   ├── Dockerfile
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── nginx/
│   ├── nginx.conf
│   └── conf.d/default.conf    # Proxy + rate limiting
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| Python | 3.8+ | [python.org](https://python.org) |
| yt-dlp | latest | `pip install yt-dlp` |
| ffmpeg | latest | `apt install ffmpeg` / `brew install ffmpeg` |

### 1. Clone & install

```bash
git clone https://github.com/yourname/videosnap.git
cd videosnap

# Backend
cd backend
cp .env.example .env
npm install

# Frontend
cd ../frontend
cp .env.example .env.local
npm install
```

### 2. Start backend

```bash
cd backend
npm run dev
# → http://localhost:5000
```

### 3. Start frontend

```bash
cd frontend
npm run dev
# → http://localhost:3000
```

---

## 🐳 Docker Deployment (Recommended)

### 1. Configure environment

```bash
# Copy and edit backend config
cp backend/.env.example backend/.env
nano backend/.env

# Set your domain in nginx config
nano nginx/conf.d/default.conf
```

### 2. Build and run

```bash
docker compose up -d --build
```

### 3. View logs

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx
```

### 4. Stop

```bash
docker compose down
```

---

## ☁️ VPS Deployment (Ubuntu)

### System dependencies

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-pip ffmpeg curl

# yt-dlp
pip3 install yt-dlp

# Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# log out and back in

# Docker Compose
sudo apt install docker-compose-plugin
```

### Clone and deploy

```bash
git clone https://github.com/yourname/videosnap.git
cd videosnap
cp backend/.env.example backend/.env
# Edit backend/.env with your settings

docker compose up -d --build
```

### HTTPS with Let's Encrypt (Certbot)

```bash
sudo apt install certbot
sudo certbot certonly --standalone -d videosnap.app -d www.videosnap.app

# Copy certs into nginx volume
sudo cp /etc/letsencrypt/live/videosnap.app/fullchain.pem ./nginx/certs/
sudo cp /etc/letsencrypt/live/videosnap.app/privkey.pem ./nginx/certs/

# Uncomment the HTTPS server block in nginx/conf.d/default.conf
# Then restart nginx
docker compose restart nginx
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | API server port |
| `NODE_ENV` | `development` | Environment |
| `FRONTEND_URL` | `http://localhost:3000` | CORS allowed origin |
| `API_KEY` | _(empty)_ | Optional API key for auth |
| `YT_DLP_PATH` | `yt-dlp` | Path to yt-dlp binary |
| `TEMP_FILE_TTL_MINUTES` | `30` | Temp file lifetime |
| `LOG_LEVEL` | `info` | Winston log level |

### Frontend (`frontend/.env.local`)

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | _(empty)_ | Backend URL (empty = use Next.js rewrites) |

---

## 🔌 API Reference

### `POST /api/analyze`

Fetches metadata and available formats for a video URL.

**Request:**
```json
{ "url": "https://youtube.com/watch?v=dQw4w9WgXcQ" }
```

**Response:**
```json
{
  "platform": "youtube",
  "title": "Video title",
  "thumbnail": "https://...",
  "duration": 212,
  "durationString": "3:32",
  "uploader": "Channel Name",
  "viewCount": 1234567,
  "formats": [
    { "id": "137+140", "label": "1080p", "resolution": "1920x1080", "ext": "mp4", "filesize": null, "fps": 30, "type": "video" },
    { "id": "22",      "label": "720p",  "resolution": "1280x720",  "ext": "mp4", "filesize": 45000000, "fps": 30, "type": "video" },
    { "id": "140",     "label": "Audio Only", "resolution": null, "ext": "mp3", "filesize": null, "fps": null, "type": "audio" }
  ]
}
```

### `POST /api/download`

Streams the video file to the client.

**Request:**
```json
{
  "url":      "https://youtube.com/watch?v=dQw4w9WgXcQ",
  "formatId": "22",
  "filename": "never-gonna-give-you-up"
}
```

**Response:** Binary stream with `Content-Disposition: attachment` header.

---

## 🛡️ Security

- **Input validation** — All URLs validated and sanitized with `express-validator`
- **Private IP blocking** — localhost/LAN IPs rejected to prevent SSRF
- **Rate limiting** — 100 req/15min (analyze), 5 req/min (download) per IP at nginx level
- **Helmet.js** — Security headers on all responses
- **Non-root Docker** — Backend container runs as `appuser` (UID 1001)
- **Temp file TTL** — Auto-delete after configurable TTL
- **CORS** — Restricted to `FRONTEND_URL`
- **Optional API key** — Set `API_KEY` env var to enable authentication

---

## 🔧 Updating yt-dlp

yt-dlp is updated frequently to keep up with platform changes:

```bash
# On host
pip3 install -U yt-dlp

# In Docker
docker compose exec backend pip install -U yt-dlp
docker compose restart backend
```

---

## 📜 Legal Notice

VideoSnap is intended for **personal, non-commercial use only**.  
Always respect platform Terms of Service and content creators' rights.  
Do not redistribute copyrighted content without permission.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit: `git commit -m 'feat: add my feature'`
4. Push: `git push origin feat/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT — see [LICENSE](LICENSE).
