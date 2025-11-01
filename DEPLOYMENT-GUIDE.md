# 🚀 Panduan Deployment Tajawaz Insight ke Vercel

Dokumen ini berisi langkah-langkah lengkap untuk deploy aplikasi Tajawaz Insight ke Vercel.

## 📦 Persiapan

### 1. File yang Diperlukan
Pastikan folder project Anda memiliki file-file berikut:
- ✅ `package.json` - Dependencies dan scripts
- ✅ `vercel.json` - Konfigurasi Vercel
- ✅ `vite.config.ts` - Konfigurasi build Vite
- ✅ `.env.example` - Template environment variables
- ✅ Semua file source code (*.tsx, *.ts, *.css, dll)

### 2. API Key Gemini
Sebelum deploy, pastikan Anda sudah punya Gemini API Key:
1. Kunjungi: https://aistudio.google.com/app/apikey
2. Login dengan akun Google
3. Klik "Get API Key" atau "Create API Key"
4. Copy API key yang digenerate
5. Simpan di tempat aman (akan digunakan di langkah deployment)

---

## 🌐 Metode 1: Deploy via Vercel Dashboard (TERMUDAH)

### Langkah 1: Akses Vercel
1. Buka browser dan kunjungi: **https://vercel.com**
2. Klik **"Sign Up"** (jika belum punya akun) atau **"Log In"**
3. Login menggunakan:
   - GitHub (Recommended)
   - GitLab
   - Bitbucket
   - Email

### Langkah 2: Upload Project

**Opsi A: Upload dari Git Repository (Recommended)**
1. Push project Anda ke GitHub/GitLab/Bitbucket terlebih dahulu
2. Di Vercel dashboard, klik **"Add New..."** → **"Project"**
3. Klik **"Import Git Repository"**
4. Pilih repository "tajawaz-insight" Anda
5. Klik **"Import"**

**Opsi B: Upload Manual (Jika tidak pakai Git)**
1. Zip folder "tajawaz-insight-deployment" ini
2. Di Vercel dashboard, klik **"Add New..."** → **"Project"**
3. Klik tab **"Import from file"** atau **"Deploy"**
4. Drag & drop file ZIP atau browse untuk upload

### Langkah 3: Configure Project
Setelah import/upload, Anda akan melihat halaman konfigurasi:

**Build & Development Settings:**
- **Framework Preset**: `Vite` (otomatis terdeteksi)
- **Root Directory**: `./` (default)
- **Build Command**: `yarn build` atau `npm run build` (otomatis)
- **Output Directory**: `dist` (otomatis)
- **Install Command**: `yarn install` atau `npm install` (otomatis)

✅ **Jika sudah benar, jangan ubah apa-apa**

### Langkah 4: Set Environment Variables (PENTING!)
Di halaman konfigurasi yang sama:

1. Scroll ke bagian **"Environment Variables"**
2. Klik **"Add"** atau isi field yang tersedia
3. Tambahkan variable berikut:

   **Variable 1:**
   - **Name/Key**: `GEMINI_API_KEY`
   - **Value**: Paste API key Gemini Anda (yang sudah dicopy sebelumnya)
   - **Environment**: ✅ Production, ✅ Preview, ✅ Development (centang semua)

4. Klik **"Add"** untuk menyimpan

### Langkah 5: Deploy!
1. Setelah semua konfigurasi benar, klik tombol **"Deploy"**
2. Tunggu proses build (biasanya 2-5 menit)
3. Vercel akan menampilkan progress:
   - ⏳ Cloning/Uploading
   - ⏳ Installing Dependencies
   - ⏳ Building
   - ✅ Deployment Complete

### Langkah 6: Akses Aplikasi
1. Setelah selesai, Vercel akan menampilkan:
   - 🎉 Congratulations!
   - 🔗 URL deployment: `https://tajawaz-insight-xxxxx.vercel.app`
2. Klik URL tersebut atau tombol **"Visit"** untuk membuka aplikasi
3. Aplikasi Anda sudah LIVE! 🚀

---

## 🔧 Metode 2: Deploy via Vercel CLI

Untuk developer yang lebih advanced.

### Langkah 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Langkah 2: Login
```bash
vercel login
```
Ikuti instruksi untuk verify email Anda.

### Langkah 3: Deploy
Dari folder project:
```bash
# Development deploy (untuk testing)
vercel

# Production deploy
vercel --prod
```

### Langkah 4: Set Environment Variable
Setelah deploy, set environment variable:
```bash
vercel env add GEMINI_API_KEY
```
Ikuti prompt untuk memasukkan API key.

Atau via dashboard:
1. Buka https://vercel.com/dashboard
2. Pilih project Anda
3. Ke **Settings** → **Environment Variables**
4. Add `GEMINI_API_KEY`

### Langkah 5: Redeploy
Setelah add environment variable:
```bash
vercel --prod
```

---

## 🔄 Update Aplikasi (Re-deploy)

### Jika Deploy dari Git:
1. Push perubahan ke Git repository Anda
2. Vercel akan otomatis detect dan rebuild
3. Tunggu 2-3 menit, aplikasi akan terupdate

### Jika Deploy Manual:
1. Build ulang project: `yarn build`
2. Upload ulang ZIP file
3. Atau gunakan Vercel CLI: `vercel --prod`

---

## ✅ Verifikasi Deployment

Setelah deploy, test aplikasi Anda:

### 1. Buka URL Deployment
Contoh: `https://tajawaz-insight-xxxxx.vercel.app`

### 2. Test Fitur Utama:
- ✅ Halaman loading dengan benar?
- ✅ Bisa pilih Market Type, Symbol, Trading Style?
- ✅ Bisa upload gambar chart?
- ✅ Tombol "Chat with AI" berfungsi?
- ✅ Analisis AI muncul di tab Signal?
- ✅ Tab Support dan chat dengan Synapse bekerja?

### 3. Jika Ada Error:
- Cek browser console (F12 → Console tab)
- Cek Vercel dashboard → Project → Logs
- Pastikan `GEMINI_API_KEY` sudah di-set dengan benar

---

## 🐛 Troubleshooting

### Error: "GEMINI_API_KEY is not defined"
**Solusi:**
1. Pastikan environment variable sudah di-add di Vercel
2. Nama harus exact: `GEMINI_API_KEY` (case-sensitive)
3. Redeploy setelah add env variable

### Error: "API key not valid"
**Solusi:**
1. Cek API key yang digunakan benar
2. Test API key di Google AI Studio
3. Generate API key baru jika perlu
4. Update di Vercel Environment Variables

### Build Failed
**Solusi:**
1. Cek build log di Vercel dashboard
2. Pastikan semua file lengkap
3. Test build di lokal: `yarn build`
4. Pastikan `package.json` dan dependencies correct

### Aplikasi Blank/White Screen
**Solusi:**
1. Cek browser console untuk error
2. Pastikan build command dan output directory benar:
   - Build: `yarn build` atau `npm run build`
   - Output: `dist`
3. Clear cache dan reload (Ctrl+Shift+R)

### Upload Gambar Tidak Berfungsi
**Solusi:**
- Ini issue browser/API, bukan deployment
- Test dengan gambar PNG/JPG yang lebih kecil (<5MB)
- Pastikan format gambar supported

---

## 📊 Custom Domain (Opsional)

Jika ingin menggunakan domain sendiri:

### 1. Beli Domain
Dari provider seperti Namecheap, GoDaddy, atau Cloudflare

### 2. Add Domain di Vercel
1. Buka project di Vercel dashboard
2. Ke tab **"Settings"** → **"Domains"**
3. Klik **"Add"**
4. Masukkan domain Anda (contoh: `tajawaz-insight.com`)
5. Klik **"Add"**

### 3. Configure DNS
Vercel akan memberikan instruksi DNS records yang harus di-add:
- **Type A Record**: pointing ke Vercel IP
- **CNAME Record**: pointing ke `cname.vercel-dns.com`

Copy DNS records dan add di domain provider Anda.

### 4. Tunggu Propagasi
DNS propagation biasanya 5 menit - 48 jam (rata-rata 1-2 jam)

---

## 💰 Biaya

### Vercel Pricing:
- **Hobby (Free)**: 
  - ✅ Unlimited projects
  - ✅ 100GB bandwidth/month
  - ✅ Serverless functions
  - ✅ Cukup untuk personal/demo app
  
- **Pro ($20/month)**:
  - Jika traffic tinggi
  - Custom team collaboration
  - Advanced analytics

### Gemini API:
- **Free Tier**: 
  - 60 requests per minute
  - Cukup untuk testing dan low traffic
  
- **Paid**: 
  - Jika butuh rate limit lebih tinggi

**Untuk aplikasi demo/personal, FREE TIER sudah lebih dari cukup! ✅**

---

## 📞 Bantuan Lebih Lanjut

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Google AI Studio**: https://aistudio.google.com
- **Aplikasi Support**: Gunakan fitur "Support" → "Chat with AI" di dalam aplikasi

---

## ✨ Tips Pro

1. **Enable Analytics**: Di Vercel dashboard → Analytics untuk track visitors
2. **Custom Error Pages**: Buat `404.html` untuk custom error page
3. **Performance**: Vercel otomatis optimize dengan CDN global
4. **SSL**: HTTPS otomatis enabled (gratis)
5. **Preview Deployments**: Setiap Git branch mendapat preview URL

---

**Selamat! Aplikasi Anda siap digunakan! 🎉**

Jika ada pertanyaan, silakan hubungi support atau gunakan fitur chat AI dalam aplikasi.
