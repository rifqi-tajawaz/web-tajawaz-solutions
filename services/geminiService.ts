import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { AnalysisHierarchy, ChartImages, ChartTimeframe } from './types';

const schema = {
  type: Type.OBJECT,
  properties: {
    pair: { type: Type.STRING, description: 'Simbol pasangan mata uang/aset yang dianalisis, contoh: BTCUSDT' },
    direction: { type: Type.STRING, description: 'Arah sinyal: "LONG", "SHORT", atau "WAIT"' },
    entry: { type: Type.NUMBER, description: 'Harga entry spesifik' },
    stop_loss: { type: Type.NUMBER, description: 'Harga stop loss spesifik' },
    take_profit: { type: Type.NUMBER, description: 'Harga take profit spesifik' },
    risk_reward: { type: Type.STRING, description: 'Rasio Risk/Reward, contoh: "1:2.5"' },
    confidence: { type: Type.STRING, description: 'Tingkat kepercayaan sinyal: "HIGH", "MEDIUM", atau "LOW"' },
    analysis: {
      type: Type.OBJECT,
      properties: {
        "4H": { type: Type.STRING, description: 'Ringkasan analisis timeframe Trend' },
        "1H": { type: Type.STRING, description: 'Ringkasan analisis timeframe Struktur' },
        "15M": { type: Type.STRING, description: 'Ringkasan analisis timeframe Konfirmasi Entry' },
        volume: { type: Type.STRING, description: 'Analisis volume' },
        divergence: { type: Type.STRING, description: 'Analisis divergence RSI/MACD' }
      },
      required: ["4H", "1H", "15M", "volume", "divergence"]
    },
    scenario: {
      type: Type.OBJECT,
      properties: {
        tp: { type: Type.STRING, description: 'Skenario jika Take Profit tercapai' },
        sl: { type: Type.STRING, description: 'Skenario jika Stop Loss tercapai' }
      },
      required: ["tp", "sl"]
    },
    report: { type: Type.STRING, description: 'Laporan analisis lengkap dalam format Markdown "MASTER CALL" dalam Bahasa Indonesia.' }
  },
  required: ["pair", "direction", "entry", "stop_loss", "take_profit", "risk_reward", "confidence", "analysis", "scenario", "report"]
};


export const generateAnalysis = async (
  prompt: string,
  images: ChartImages,
  hierarchy: AnalysisHierarchy
): Promise<string> => { 
  // FIX: Per coding guidelines, API key must be from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash';

  const parts: any[] = [];
  
  const roles: (keyof AnalysisHierarchy)[] = ['trend', 'structure', 'entry'];

  roles.forEach(role => {
    const timeframe = hierarchy[role];
    const imageData = images[timeframe];
    if (imageData && imageData.base64) {
      const match = imageData.base64.match(/^data:(image\/.+);base64,(.+)$/);
      if (match) {
        const [, mimeType, data] = match;
        // FIX: The type of `role` is inferred as `string | number | symbol` by the compiler.
        // Explicitly cast it to a string before calling toUpperCase().
        parts.push({ text: `Berikut adalah gambar chart untuk peran **${String(role).toUpperCase()}** (Timeframe ${timeframe}):` });
        parts.push({
          inlineData: {
            mimeType,
            data,
          },
        });
      }
    }
  });

  // Add the main prompt text last
  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.5,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });
    return response.text; // this is now a JSON string
  } catch (error) {
    console.error("Error generating analysis from Gemini API:", error);
    if (error instanceof Error) {
      if (error.message.includes('API key not valid')) {
          throw new Error('API Key tidak valid. Silakan periksa kembali.');
      }
      throw new Error(`Permintaan ke Gemini API gagal: ${error.message}`);
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui saat menghubungi API Gemini.");
  }
};

export const startChatSession = (): Chat => {
  // FIX: Per coding guidelines, API key must be from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `Anda adalah Synapse, asisten support AI yang sangat cerdas dan ramah untuk aplikasi trading bernama **Tajawaz Insight**. Misi utama Anda adalah membantu pengguna memahami dan menggunakan aplikasi ini secara maksimal. Selalu berkomunikasi dalam Bahasa Indonesia.

**PENGETAHUAN INTERNAL APLIKASI TAJAWAZ INSIGHT:**

Aplikasi memiliki 3 layar utama yang diakses dari navigasi bawah:
1.  **Home:** Ini adalah layar utama untuk mengatur analisis AI.
    *   Pengguna memilih parameter di grid "AI Analysis Tools".
    *   **Gaya Trading** adalah pengaturan KUNCI. Pilihan ini (Scalping, Intraday, Swing, Position) akan secara otomatis menentukan hierarki timeframe yang dibutuhkan untuk analisis (misalnya, Scalping membutuhkan chart 1H, 15M, 5M).
    *   **Upload Chart:** Slot unggah gambar bersifat dinamis dan akan meminta chart sesuai hierarki 'Gaya Trading' yang dipilih.
    *   **"Chat with AI":** Tombol ini memulai proses analisis setelah semua parameter diatur.
2.  **Signal:** Layar ini menampilkan hasil analisis AI.
    *   **Kartu Sinyal Utama:** Menampilkan informasi paling penting: Simbol, posisi (BUY/SELL), Harga Entry, Stop Loss, dan Take Profit, serta Tingkat Kepercayaan.
    *   **Analisis Lengkap:** Pengguna bisa membuka detail untuk melihat alasan teknikal di balik sinyal.
3.  **Support:** Ini adalah layar tempat Anda (Synapse) berada. Pengguna pertama kali melihat hub dukungan, dan dapat memilih "Hubungi Dukungan" untuk berbicara dengan Anda.

**TUGAS ANDA:**

*   **Menjawab Pertanyaan Cara Penggunaan:** Ketika pengguna bertanya "bagaimana cara menggunakan aplikasi ini?" atau "cara analisis?", jelaskan alurnya menggunakan pengetahuan di atas. Contoh: "Tentu! Pertama, di layar 'Home', pilih 'Gaya Trading' yang Anda inginkan. Ini akan menentukan timeframe chart yang perlu Anda unggah. Atur parameter lainnya, lalu unggah chart sesuai label (Trend, Struktur, Entry). Terakhir, tekan 'Chat with AI'. Hasilnya akan muncul di layar 'Signal'."
*   **Menjelaskan Istilah Trading:** Jelaskan konsep seperti "Stop Loss", "Forex", "Scalping", dll., dengan cara yang sederhana.
*   **Memberikan Bantuan Umum:** Jawab pertanyaan umum terkait aplikasi **Tajawaz Insight**.
*   **Gaya Bahasa:** Jaga agar jawaban Anda tetap singkat, jelas, profesional, dan mudah dipahami.`,
    },
  });
  return chat;
};
