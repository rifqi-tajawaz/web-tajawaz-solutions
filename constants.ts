import type { MarketType, TradingStyle, AnalysisHierarchy } from './types';

export const translations = {
    id: {
      title: 'Analisis Pasar dengan Gemini AI',
      subtitle: 'Forex, Komoditas & Cryptocurrency',
      apiKeyLabel: 'API Key Gemini',
      apiKeyPlaceholder: 'Masukkan API Key Gemini Anda',
      apiKeyButton: 'Simpan & Uji API Key',
      apiKeyTesting: 'Menguji API Key...',
      apiKeySuccess: 'API Key valid dan siap digunakan!',
      changeApi: 'Ganti API Key',
      errorInvalidKey: 'API Key tidak valid. Pastikan Anda menggunakan API Key yang benar dari Google AI Studio.',
      uploadChart: 'Unggah Gambar Chart',
      removeImage: 'Hapus Gambar',
      marketType: 'Jenis Pasar',
      symbol: 'Simbol',
      timeframe: 'Timeframe',
      tradingStyle: 'Gaya Trading',
      riskReward: 'Rasio Risk/Reward',
      accountSize: 'Ukuran Akun (USD)',
      riskPercent: 'Risiko per Trade (%)',
      analyze: 'Analisis Sekarang',
      analyzing: 'Menganalisis...',
      settings: 'Pengaturan',
      hideSettings: 'Sembunyikan Pengaturan',
      forex: 'Forex',
      crypto: 'Cryptocurrency',
      commodity: 'Komoditas',
      scalping: 'Scalping',
      intraday: 'Intraday',
      swing: 'Swing',
      position: 'Position',
      trend: 'Analisis Tren',
      entry: 'Rekomendasi Entry',
      stopLoss: 'Stop Loss',
      takeProfit: 'Take Profit',
      sentiment: 'Sentimen Pasar',
      signals: 'Kekuatan Sinyal',
      risk: 'Manajemen Risiko',
      indicators: 'Indikator Teknikal',
      notes: 'Catatan Penting',
      errorAnalysis: 'Gagal menganalisis. Error: ',
      fullAnalysis: 'Lihat Analisis Lengkap',
      disclaimer: '⚠️ Disclaimer: Analisis ini hanya untuk tujuan edukasi. Trading melibatkan risiko tinggi.',
    },
    en: { // Note: English translations are kept for structure but the app is now ID-first.
      title: 'Market Analysis with Gemini AI',
      subtitle: 'Forex, Commodities & Cryptocurrency',
      apiKeyLabel: 'Gemini API Key',
      apiKeyPlaceholder: 'Enter your Gemini API Key',
      apiKeyButton: 'Save & Test API Key',
      apiKeyTesting: 'Testing API Key...',
      apiKeySuccess: 'API Key is valid and ready to use!',
      changeApi: 'Change API Key',
      errorInvalidKey: 'Invalid API Key. Make sure you are using the correct API Key from Google AI Studio.',
      uploadChart: 'Upload Chart Image',
      removeImage: 'Remove Image',
      marketType: 'Market Type',
      symbol: 'Symbol',
      timeframe: 'Timeframe',
      tradingStyle: 'Trading Style',
      riskReward: 'Risk/Reward Ratio',
      accountSize: 'Account Size (USD)',
      riskPercent: 'Risk per Trade (%)',
      analyze: 'Analyze Now',
      analyzing: 'Analyzing...',
      settings: 'Settings',
      hideSettings: 'Hide Settings',
      forex: 'Forex',
      crypto: 'Cryptocurrency',
      commodity: 'Commodities',
      scalping: 'Scalping',
      intraday: 'Intraday',
      swing: 'Swing',
      position: 'Position',
      trend: 'Trend Analysis',
      entry: 'Entry Recommendation',
      stopLoss: 'Stop Loss',
      takeProfit: 'Take Profit',
      sentiment: 'Market Sentiment',
      signals: 'Signal Strength',
      risk: 'Risk Management',
      indicators: 'Technical Indicators',
      notes: 'Important Notes',
      errorAnalysis: 'Analysis failed. Error: ',
      fullAnalysis: 'View Full Analysis',
      disclaimer: '⚠️ Disclaimer: This analysis is for educational purposes only. Trading involves high risk.',
    }
  };
  
  export const symbols: { [key in MarketType]: string[] } = {
    forex: ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'NZDUSD', 'USDCHF', 'EURGBP', 'EURJPY', 'GBPJPY'],
    crypto: ['BTCUSD', 'ETHUSD', 'BNBUSD', 'ADAUSD', 'SOLUSD', 'XRPUSD', 'DOTUSD', 'DOGEUSD', 'MATICUSD', 'AVAXUSD'],
    commodity: ['XAUUSD', 'XAGUSD', 'WTIUSD', 'NATGAS', 'COPPER', 'PLATINUM', 'CORN', 'WHEAT', 'SOYBEAN', 'COFFEE']
  };

  export const analysisHierarchies: { [key in TradingStyle]: AnalysisHierarchy } = {
    scalping: { trend: '1H', structure: '15M', entry: '5M' },
    intraday: { trend: '4H', structure: '1H', entry: '15M' },
    swing: { trend: 'D1', structure: '4H', entry: '1H' },
    position: { trend: 'W1', structure: 'D1', entry: '4H' }
  };
  
  export const faqData = [
    {
      q: "Bagaimana cara menggunakan aplikasi ini?",
      a: "Sangat mudah! Di layar 'Home', atur parameter analisis Anda di grid 'AI Analysis Tools' dengan mengkliknya satu per satu. Sistem akan secara cerdas menyesuaikan timeframe yang dibutuhkan berdasarkan 'Gaya Trading' Anda. Setelah semua sesuai, tekan tombol 'Chat with AI'. Hasil analisis akan muncul di layar 'Signal'."
    },
    {
      q: "Apakah ini nasihat keuangan?",
      a: "Tidak. Tajawaz Insight adalah alat untuk tujuan edukasi dan analisis. Semua informasi yang diberikan BUKAN merupakan nasihat keuangan. Trading melibatkan risiko tinggi dan Anda harus membuat keputusan sendiri atau berkonsultasi dengan penasihat keuangan profesional."
    },
    {
      q: "Apa itu 'Gaya Trading'?",
      a: "Gaya trading menentukan hierarki analisis timeframe yang digunakan AI. 'Scalping' untuk trading sangat singkat, 'Intraday' untuk trading dalam hari yang sama, 'Swing' untuk beberapa hari, dan 'Position' untuk beberapa minggu atau bulan. Pilihan Anda akan menentukan chart mana yang perlu diunggah."
    },
    {
      q: "Dari mana data analisis berasal?",
      a: "Analisis kami dihasilkan oleh model AI canggih dari Google (Gemini). AI menganalisis parameter dan gambar chart yang Anda berikan untuk menghasilkan wawasan, namun tidak dapat memprediksi masa depan dengan pasti."
    },
     {
      q: "Mengapa saya perlu API Key?",
      a: "API Key dari Google AI Studio diperlukan untuk menghubungkan aplikasi ini ke model AI Gemini. Ini memungkinkan aplikasi untuk mengirim permintaan analisis dan menerima hasilnya. Anda bisa mendapatkannya secara gratis."
    }
  ];