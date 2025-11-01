# 📈 Tajawaz Insight

Aplikasi analisis pasar trading dengan AI untuk Forex, Komoditas & Cryptocurrency menggunakan Google Gemini AI.

## ✨ Fitur Utama

- 🤖 **Analisis AI Cerdas**: Menggunakan Gemini 2.5 Flash untuk analisis chart trading
- 📊 **Multi-Market**: Support Forex, Cryptocurrency, dan Komoditas
- ⏱️ **Berbagai Timeframe**: Dari scalping (5M) hingga position trading (W1)
- 📸 **Upload Chart**: Analisis berdasarkan gambar chart yang Anda upload
- 💬 **AI Chat Support**: Asisten AI (Synapse) untuk bantuan penggunaan aplikasi
- 🎯 **Entry, SL, TP**: Rekomendasi lengkap dengan risk/reward ratio

## 🚀 Teknologi

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **AI**: Google Gemini API (@google/genai)
- **Icons**: Lucide React

## 📋 Prasyarat

- Node.js 18+ atau Yarn
- Gemini API Key dari [Google AI Studio](https://aistudio.google.com/app/apikey)

## 🔧 Instalasi & Development

1. **Clone atau download repository ini**

2. **Install dependencies**:
   ```bash
   yarn install
   # atau
   npm install
   ```

3. **Setup Environment Variables**:
   
   Copy file `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` dan masukkan API Key Gemini Anda:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

4. **Jalankan Development Server**:
   ```bash
   yarn dev
   # atau
   npm run dev
   ```
   
   Aplikasi akan berjalan di `http://localhost:3000`

5. **Build untuk Production**:
   ```bash
   yarn build
   # atau
   npm run build
   ```
   
   Output akan ada di folder `dist/`

## 🌐 Deploy ke Vercel

### Metode 1: Deploy via Vercel CLI

1. **Install Vercel CLI** (jika belum):
   ```bash
   npm install -g vercel
   ```

2. **Login ke Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   
   Ikuti instruksi di terminal. Untuk production deploy:
   ```bash
   vercel --prod
   ```

4. **Set Environment Variable**:
   Setelah deploy, set environment variable di Vercel dashboard:
   - Buka project di [vercel.com/dashboard](https://vercel.com/dashboard)
   - Masuk ke **Settings** → **Environment Variables**
   - Tambahkan: `GEMINI_API_KEY` dengan value API key Anda
   - Redeploy aplikasi

### Metode 2: Deploy via Vercel Dashboard

1. **Login ke Vercel**:
   Buka [vercel.com](https://vercel.com) dan login dengan GitHub/GitLab/Bitbucket

2. **Import Project**:
   - Klik **"Add New..."** → **"Project"**
   - Import repository Git Anda, atau upload folder ini

3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Build Command**: `yarn build` (otomatis terdeteksi)
   - **Output Directory**: `dist` (otomatis terdeteksi)
   - **Install Command**: `yarn install` (otomatis terdeteksi)

4. **Environment Variables**:
   - Tambahkan environment variable:
     - **Key**: `GEMINI_API_KEY`
     - **Value**: API key Gemini Anda
     - **Environment**: Production, Preview, Development (pilih semua)

5. **Deploy**:
   - Klik **"Deploy"**
   - Tunggu proses build selesai (2-3 menit)
   - Aplikasi akan live di URL Vercel Anda

### Metode 3: Deploy dengan Upload ZIP

Jika Anda tidak menggunakan Git:

1. **Build aplikasi terlebih dahulu**:
   ```bash
   yarn build
   ```

2. **Login ke Vercel Dashboard**:
   Buka [vercel.com](https://vercel.com)

3. **Upload folder project**:
   - Klik **"Add New..."** → **"Project"**
   - Pilih **"Browse"** dan upload seluruh folder project ini (bukan folder `dist`)
   - Vercel akan otomatis detect sebagai Vite project

4. **Set Environment Variables dan Deploy**:
   - Ikuti langkah yang sama seperti Metode 2

## 🔐 Mendapatkan Gemini API Key

1. Buka [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Login dengan akun Google Anda
3. Klik **"Get API Key"** atau **"Create API Key"**
4. Copy API key yang digenerate
5. Gunakan API key tersebut untuk environment variable `GEMINI_API_KEY`

**Note**: API key Gemini memiliki free tier yang generous untuk development dan testing.

## 📁 Struktur Project

```
tajawaz-insight/
├── components/           # React components
│   └── MarketAnalyzer.tsx
├── services/            # API services
│   └── geminiService.ts
├── public/              # Static assets
├── App.tsx              # Main App component
├── index.tsx            # Entry point
├── index.html           # HTML template
├── index.css            # Global styles
├── types.ts             # TypeScript types
├── constants.ts         # App constants
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
├── vercel.json          # Vercel deployment config
├── .env.local           # Environment variables (gitignored)
├── .env.example         # Environment template
└── package.json         # Dependencies
```

## 🔍 Troubleshooting

### Build Error: "GEMINI_API_KEY is not defined"
**Solusi**: Pastikan Anda sudah set environment variable `GEMINI_API_KEY` di Vercel dashboard, lalu redeploy.

### API Error: "API key not valid"
**Solusi**: 
- Cek apakah API key yang digunakan benar
- Pastikan API key memiliki akses ke Gemini API
- Generate API key baru jika perlu

### Deploy ke Vercel Failed
**Solusi**:
- Pastikan file `vercel.json` ada di root project
- Cek build log di Vercel dashboard untuk detail error
- Pastikan semua dependencies ada di `package.json`

## 📝 Lisensi

Aplikasi ini dibuat dengan [Google AI Studio](https://aistudio.google.com).

## 🆘 Support

Jika ada pertanyaan atau masalah:
- Gunakan fitur **AI Chat Support** di dalam aplikasi (tab Support)
- Baca **FAQ** di tab Support dalam aplikasi

---

**Happy Trading! 📊🚀**

*⚠️ Disclaimer: Aplikasi ini untuk tujuan edukasi. Trading melibatkan risiko tinggi. Selalu lakukan riset sendiri dan konsultasi dengan ahli finansial.*
