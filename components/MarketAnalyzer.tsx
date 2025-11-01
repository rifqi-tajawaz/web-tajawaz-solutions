import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { translations, symbols, analysisHierarchies, faqData } from '../constants';
import type { Language, MarketType, TradingStyle, Analysis, ChatMessage, ChartImages, ChartTimeframe, AnalysisHierarchy } from '../types';
import { generateAnalysis, startChatSession } from '../services/geminiService';
import { Chat } from "@google/genai";
import { 
    TrendingUp, AlertCircle, Settings, BarChart3, Clock, DollarSign, Target, Shield, Activity,
    Globe, Zap, LineChart, Brain, ChevronDown, CheckCircle, UploadCloud, XCircle, Shuffle,
    Users, LifeBuoy, Crosshair, AreaChart, CalendarDays, AppWindow, Home, MessageSquare, Signal,
    Search, SendHorizontal, BookOpen, HelpCircle, Video, Headphones, BrainCircuit, ArrowLeft, ShieldCheck, ShieldAlert, ShieldX
} from 'lucide-react';

const MarketAnalyzer: React.FC = () => {
  const language: Language = 'id';
  // FIX: Removed API key state management per guidelines. API key is handled by process.env.
  
  const [marketType, setMarketType] = useState<MarketType>('forex');
  const [symbol, setSymbol] = useState('EURUSD');
  const [tradingStyle, setTradingStyle] = useState<TradingStyle>('intraday');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chartImages, setChartImages] = useState<ChartImages>({});
  const [activeView, setActiveView] = useState<'home' | 'signal' | 'support'>('home');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Support State
  const [supportSubView, setSupportSubView] = useState<'hub' | 'chat' | 'faq'>('hub');
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const t = translations[language];

  const currentHierarchy = useMemo(() => analysisHierarchies[tradingStyle], [tradingStyle]);

  useEffect(() => {
    // This effect handles resetting the symbol when marketType changes.
    const availableSymbols = symbols[marketType];
    if (!availableSymbols.includes(symbol)) {
      setSymbol(availableSymbols[0]);
    }
  }, [marketType, symbol]);
  
  useEffect(() => {
      // Auto-scroll chat view
      if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
  }, [chatHistory]);

  const parseAnalysis = useCallback((jsonString: string) => {
    try {
        const data: Analysis = JSON.parse(jsonString);
        
        if (!data.pair || !data.direction || !data.entry) {
          throw new Error("Data JSON yang diterima tidak lengkap atau tidak valid.");
        }

        setAnalysis(data);
    } catch (e) {
        console.error("Gagal memproses respons JSON dari AI:", e, "\nRespons Mentah:", jsonString);
        setError("Gagal memproses respons dari AI. Format tidak diharapkan. Silakan coba lagi.");
        setActiveView('home');
    }
  }, []);

    // FIX: Removed API key testing and setting logic per guidelines.

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, tf: ChartTimeframe) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setChartImages(prev => ({
                    ...prev,
                    [tf]: {
                        base64: event.target?.result as string,
                        name: file.name
                    }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (tf: ChartTimeframe) => {
        setChartImages(prev => {
            const newState = { ...prev };
            delete newState[tf];
            return newState;
        });
    };

  const analyzeMarket = async () => {
    // FIX: Removed API key check per guidelines.
    setLoading(true);
    setError('');
    setAnalysis(null);
    setActiveView('signal');

    const imagePromptParts: string[] = [];
    (Object.keys(currentHierarchy) as Array<keyof AnalysisHierarchy>).forEach(role => {
        const tf = currentHierarchy[role];
        if (chartImages[tf]) {
            imagePromptParts.push(`${role.toUpperCase()} (${tf})`);
        }
    });

    const imagePrompt = imagePromptParts.length > 0 
        ? `Analisis ini harus secara primer didasarkan pada gambar-gambar chart yang disediakan untuk peran dan timeframe berikut: ${imagePromptParts.join(', ')}. ` 
        : "";

    const prompt = `Anda adalah Mesin Analisis Pasar AI untuk aplikasi Tajawaz Insight. Tugas Anda adalah melakukan analisis pasar multi-layer yang canggih berdasarkan hierarki yang diberikan dan MENGHASILKAN OBJEK JSON YANG VALID sesuai skema. JANGAN tambahkan markdown atau teks lain di luar objek JSON.
    
Parameter Analisis:
- Pasangan/Aset: ${symbol}
- Jenis Pasar: ${marketType}
- Gaya Trading: ${tradingStyle}

Hierarki Analisis (Peran -> Timeframe):
- Trend -> ${currentHierarchy.trend}
- Struktur -> ${currentHierarchy.structure}
- Konfirmasi Entry -> ${currentHierarchy.entry}
${imagePrompt}

Lakukan analisis berdasarkan pipeline berikut:
1.  **LAYER 1 (Trend Context):** Analisis tren menggunakan timeframe **${currentHierarchy.trend}**.
2.  **LAYER 2 (Technical Confirmation):** Analisis struktur, pullback, dan konfirmasi teknis menggunakan timeframe **${currentHierarchy.structure}**.
3.  **LAYER 3 (Trade Plan):** Cari sinyal entry, tentukan Entry, Stop Loss (SL), dan Take Profit (TP) menggunakan timeframe **${currentHierarchy.entry}**.
4.  **LAYER 4 (Risk & Confidence):** Hitung Risk/Reward dan tentukan Confidence Level (HIGH/MEDIUM/LOW) berdasarkan jumlah konfirmasi dari semua timeframe.
5.  **LAYER 5 (LLM Explanation):** Buat laporan ringkas dalam format Markdown "MASTER CALL".

PENTING: Saat mengisi objek JSON 'analysis', petakan hasil analisis Anda ke field yang ada sebagai berikut:
- Masukkan analisis **Trend (${currentHierarchy.trend})** ke dalam field \`"4H"\`.
- Masukkan analisis **Struktur (${currentHierarchy.structure})** ke dalam field \`"1H"\`.
- Masukkan analisis **Konfirmasi Entry (${currentHierarchy.entry})** ke dalam field \`"15M"\`.

Pastikan semua nilai angka dalam JSON adalah tipe NUMBER, bukan string. Seluruh teks dalam JSON harus dalam Bahasa Indonesia.
`;

    try {
      // FIX: Removed apiKey argument per guidelines.
      const jsonString = await generateAnalysis(prompt, chartImages, currentHierarchy);
      parseAnalysis(jsonString);
    } catch (err) {
      setError(t.errorAnalysis + (err instanceof Error ? err.message : String(err)));
      console.error('Analysis error:', err);
      setActiveView('home');
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = () => {
    if (!chatSession) {
        try {
            // FIX: Removed apiKey argument per guidelines.
            const session = startChatSession();
            setChatSession(session);
            setChatHistory([]); // Clear history for new session
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal memulai sesi obrolan.');
            return; // Stop if session fails
        }
    }
    setSupportSubView('chat');
  };
  
    const handleSendMessage = async () => {
        if (!chatInput.trim() || isChatLoading || !chatSession) return;

        const userMessage: ChatMessage = { role: 'user', parts: [{ text: chatInput }] };
        setChatHistory(prev => [...prev, userMessage]);
        const currentInput = chatInput;
        setChatInput('');
        setIsChatLoading(true);

        try {
            const stream = await chatSession.sendMessageStream({ message: currentInput });

            let modelResponse = '';
            setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]); 
            
            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setChatHistory(prev => {
                    const newHistory = [...prev];
                    if (newHistory.length > 0) {
                      newHistory[newHistory.length - 1].parts[0].text = modelResponse;
                    }
                    return newHistory;
                });
            }
        } catch (err) {
            console.error("Error sending chat message:", err);
            const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "Maaf, terjadi kesalahan saat memproses permintaan Anda." }] };
            setChatHistory(prev => {
                 const newHistory = [...prev];
                 if (newHistory.length > 0 && newHistory[newHistory.length - 1].parts[0].text === '') {
                     newHistory[newHistory.length - 1] = errorMessage;
                 } else {
                     newHistory.push(errorMessage);
                 }
                 return newHistory;
            });
        } finally {
            setIsChatLoading(false);
        }
    };


  const Header = () => (
    <header className="flex items-center p-4">
        <BrainCircuit className="w-8 h-8 text-brand-400" />
        <h1 className="text-xl font-bold ml-2">Tajawaz Insight</h1>
    </header>
  );

  const BottomNav = () => (
    <footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-gray-800 flex justify-around items-center p-2 z-10 max-w-md mx-auto rounded-t-2xl">
        <button className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeView === 'home' ? 'text-brand-400' : 'text-gray-500'}`} onClick={() => { setActiveView('home'); setAnalysis(null); setLoading(false); }}>
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
        </button>
        <button className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeView === 'signal' ? 'text-brand-400' : 'text-gray-500'}`} onClick={() => analysis && setActiveView('signal')}>
            <Signal className="w-6 h-6" />
            <span className="text-xs">Signal</span>
        </button>
        <button onClick={() => { setActiveView('support'); setSupportSubView('hub'); }} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeView === 'support' ? 'text-brand-400' : 'text-gray-500'}`}>
            <MessageSquare className="w-6 h-6" />
            <span className="text-xs">Support</span>
        </button>
    </footer>
  );

  const interactiveTools = useMemo(() => [
    { name: t.marketType, value: t[marketType], icon: Activity, onClick: () => setActiveModal('marketType') },
    { name: t.tradingStyle, value: t[tradingStyle], icon: Zap, onClick: () => setActiveModal('tradingStyle') },
    { name: t.symbol, value: symbol, icon: DollarSign, onClick: () => setActiveModal('symbol') },
    { name: "Pivots Points", value: "", icon: Crosshair, isStatic: true },
    { name: "SnR Area", value: "", icon: AreaChart, isStatic: true },
    { name: "Calendar Economy", value: "", icon: CalendarDays, isStatic: true },
    { name: "More Tools", value: "", icon: AppWindow, isStatic: true },
  ], [marketType, tradingStyle, symbol, t]);

  const filteredSymbols = useMemo(() => 
    symbols[marketType].filter(s => s.toLowerCase().includes(searchTerm.toLowerCase())),
    [marketType, searchTerm]
  );

  const SelectionModal = ({ title, options, onSelect, onClose, currentValue }: { title: string, options: {key: string, value: string}[], onSelect: (key: string) => void, onClose: () => void, currentValue: string }) => (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-20 flex flex-col animate-fadeInUp">
        <header className="flex items-center p-4 border-b border-gray-800">
            <h2 className="text-lg font-bold flex-1 text-center">{title}</h2>
            <button onClick={onClose} className="p-1"><XCircle className="w-6 h-6 text-gray-500"/></button>
        </header>
        <div className="flex-1 overflow-y-auto px-4 py-2 no-scrollbar">
            <ul className="space-y-2">
                {options.map(opt => (
                    <li key={opt.key}>
                        <button 
                            onClick={() => { onSelect(opt.key); onClose(); }}
                            className={`w-full text-left p-3 rounded-lg transition ${currentValue === opt.key ? 'bg-brand-500/20 text-brand-300' : 'bg-gray-900/50 hover:bg-brand-500/20'}`}
                        >
                            {opt.value}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );

  const renderSymbolModal = () => (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-20 flex flex-col animate-fadeInUp">
        <header className="flex items-center p-4 border-b border-gray-800">
            <h2 className="text-lg font-bold flex-1 text-center">Pilih Simbol</h2>
            <button onClick={() => setActiveModal(null)} className="p-1"><XCircle className="w-6 h-6 text-gray-500"/></button>
        </header>
        <div className="p-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"/>
                <input 
                    type="text"
                    placeholder="Cari simbol..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
            </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 no-scrollbar">
            <ul className="space-y-2">
                {filteredSymbols.map(s => (
                    <li key={s}>
                        <button 
                            onClick={() => { setSymbol(s); setActiveModal(null); setSearchTerm(''); }}
                            className="w-full text-left p-3 bg-gray-900/50 rounded-lg hover:bg-brand-500/20 transition"
                        >
                            {s}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );

  const ImageUploader = ({ tf, role }: { tf: ChartTimeframe, role: string }) => {
    const image = chartImages[tf];
    return (
        <div className="flex flex-col items-center gap-1">
            <div className="text-center">
                <label className="text-xs text-gray-400 font-semibold">{role}</label>
                <label className="text-xs text-brand-300 block">{tf}</label>
            </div>
            {image ? (
                <div className="relative w-full aspect-video bg-gray-800 p-1 rounded-lg border border-gray-700 mt-1">
                    <img src={image.base64} alt={`${tf} Chart preview`} className="w-full h-full rounded object-cover" />
                    <button onClick={() => handleRemoveImage(tf)} className="absolute top-1 right-1 p-0.5 bg-black/50 rounded-full text-white hover:bg-red-500 transition"><XCircle className="w-4 h-4"/></button>
                </div>
            ) : (
                <label className="w-full flex flex-col items-center justify-center aspect-video bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-brand-500 mt-1">
                    <UploadCloud className="w-5 h-5 text-gray-500 mb-1"/>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, tf)} />
                </label>
            )}
        </div>
    );
};

  const renderHomeView = () => (
    <>
        <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-400 mb-4">AI Analysis Tools</h2>
            <div className="grid grid-cols-4 gap-4 text-center">
                {interactiveTools.slice(0, 3).map(tool => ( // Only first 3 are main controls now
                    <div 
                        key={tool.name} 
                        onClick={tool.isStatic ? undefined : tool.onClick}
                        className={`flex flex-col items-center justify-between gap-1 p-2 rounded-lg bg-gray-900/50 h-24 ${!tool.isStatic ? 'cursor-pointer hover:bg-gray-800 transition' : 'opacity-50'}`}
                    >
                        <div className="flex-1 flex items-center">
                            <tool.icon className="w-6 h-6 text-brand-400" />
                        </div>
                        <div className="w-full">
                            <span className="text-xs text-gray-300 block truncate">{tool.name}</span>
                            {tool.value && <span className="text-xs font-bold text-white block truncate">{tool.value}</span>}
                        </div>
                    </div>
                ))}
                 {/* Static tools */}
                {interactiveTools.slice(3).map(tool => (
                     <div key={tool.name} className="flex flex-col items-center justify-between gap-1 p-2 rounded-lg bg-gray-900/50 h-24 opacity-50">
                        <div className="flex-1 flex items-center">
                            <tool.icon className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="w-full">
                            <span className="text-xs text-gray-500 block truncate">{tool.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
        <div className="px-4 py-2">
             <h3 className="text-sm font-semibold text-gray-400 mb-2">Upload Chart Sesuai Hierarki</h3>
             <div className="grid grid-cols-3 gap-3">
                <ImageUploader tf={currentHierarchy.trend} role="Trend" />
                <ImageUploader tf={currentHierarchy.structure} role="Struktur" />
                <ImageUploader tf={currentHierarchy.entry} role="Entry" />
             </div>
        </div>

        <div className="p-4">
            <button 
                onClick={analyzeMarket} 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold py-3 rounded-lg shadow-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? (
                    <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>{t.analyzing}</>
                ) : "Chat with AI"}
            </button>
        </div>
    </>
  );
  
  const ConfidenceIndicator = ({ level }: { level: Analysis['confidence'] }) => {
    const config = {
      HIGH: { icon: ShieldCheck, text: 'Tinggi', color: 'text-green-400' },
      MEDIUM: { icon: ShieldAlert, text: 'Sedang', color: 'text-yellow-400' },
      LOW: { icon: ShieldX, text: 'Rendah', color: 'text-red-400' },
    };
    const current = config[level] || config.LOW;
    const Icon = current.icon;
    return (
      <div className={`flex items-center gap-2 text-sm ${current.color}`}>
        <Icon className="w-5 h-5" />
        <span className="font-semibold">Kepercayaan: {current.text}</span>
      </div>
    );
  };


  const renderSignalView = () => (
    <div className="p-4 animate-fadeInUp">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Best Signals 🔥</h2>
            <div className="flex gap-2 text-sm">
                <span className="text-gray-400 p-2">Weekly</span>
                <span className="text-gray-400 p-2">Monthly</span>
            </div>
        </div>

        {loading && (
             <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-4 animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                        <div>
                            <div className="h-4 bg-gray-700 rounded w-20 mb-2"></div>
                            <div className="h-3 bg-gray-700 rounded w-16"></div>
                        </div>
                    </div>
                    <div className="h-7 bg-gray-700 rounded w-16"></div>
                </div>
                <div className="mt-4 border-t border-gray-800 pt-4 space-y-3">
                    <div className="flex justify-between items-center h-5"><div className="h-4 bg-gray-700 rounded w-24"></div><div className="h-4 bg-gray-700 rounded w-16"></div></div>
                    <div className="flex justify-between items-center h-5"><div className="h-4 bg-gray-700 rounded w-20"></div><div className="h-4 bg-gray-700 rounded w-16"></div></div>
                    <div className="flex justify-between items-center h-5"><div className="h-4 bg-gray-700 rounded w-28"></div><div className="h-4 bg-gray-700 rounded w-16"></div></div>
                    <div className="flex justify-between items-center h-5 mt-2"><div className="h-4 bg-gray-700 rounded w-32"></div><div className="h-4 bg-gray-700 rounded w-12"></div></div>
                </div>
            </div>
        )}

        {analysis && (
            <>
                <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-gray-400">{analysis.pair.substring(0,3)}</div>
                            <div>
                                <p className="font-bold text-lg">{analysis.pair}</p>
                                <p className="text-xs text-gray-400 capitalize">{tradingStyle}</p>
                            </div>
                        </div>
                        <div className={`px-4 py-1 rounded-md text-sm font-bold ${analysis.direction === 'LONG' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {analysis.direction}
                        </div>
                    </div>
                    <div className="mt-4 border-t border-gray-800 pt-4 space-y-3">
                        <div className="flex justify-between text-sm"><span className="text-gray-400">Harga Entry</span><span className="font-mono text-white">{analysis.entry}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-400">Stop Loss</span><span className="font-mono text-red-400">{analysis.stop_loss}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-400">Take Profit</span><span className="font-mono text-green-400">{analysis.take_profit}</span></div>
                        <div className="flex justify-between text-sm border-t border-gray-800 pt-3 mt-2">
                             <ConfidenceIndicator level={analysis.confidence} />
                             <span className="font-mono text-brand-300 text-sm">{analysis.risk_reward} RR</span>
                        </div>
                    </div>
                </div>

                <details className="bg-gray-900/70 border border-gray-800 rounded-2xl p-4 mt-4 group">
                    <summary className="font-semibold text-white list-none flex justify-between items-center cursor-pointer">
                        Lihat Analisis Lengkap
                        <ChevronDown className="w-5 h-5 transition-transform duration-300 transform group-open:rotate-180" />
                    </summary>
                    <div className="mt-4 text-gray-300 whitespace-pre-wrap leading-relaxed text-sm border-t border-gray-800 pt-4">
                        {analysis.report}
                    </div>
                </details>
            </>
        )}
    </div>
  );
  
  const renderChatView = () => (
    <div className="flex flex-col h-full animate-fadeInUp">
        <div className="p-3 text-center border-b border-gray-800 flex-shrink-0">
            <h2 className="text-base font-semibold text-white">Asisten AI: Synapse 🤖</h2>
            <p className="text-xs text-gray-400">Tanyakan pada Synapse</p>
        </div>
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 p-3 no-scrollbar">
            {chatHistory.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs md:max-w-sm rounded-2xl px-3 py-2 ${
                        msg.role === 'user' 
                        ? 'bg-brand-600 text-white rounded-br-none' 
                        : 'bg-gray-800 text-gray-300 rounded-bl-none'
                    }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.parts[0].text}</p>
                    </div>
                </div>
            ))}
             {isChatLoading && (
                <div className="flex justify-start">
                    <div className="max-w-xs md:max-w-sm rounded-2xl px-3 py-2 bg-gray-800 text-gray-300 rounded-bl-none">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"></div>
                        </div>
                    </div>
                </div>
             )}
        </div>
        <div className="p-2 border-t border-gray-800 bg-black flex-shrink-0">
            <div className="flex items-center gap-2">
              <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ketik pesan Anda..."
                  className="flex-1 bg-gray-800 rounded-full py-2 px-4 focus:outline-none text-white text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                  onClick={handleSendMessage}
                  disabled={isChatLoading || !chatInput.trim()}
                  className="bg-brand-600 p-2 rounded-full text-white disabled:opacity-50 transition-transform active:scale-90"
              >
                  <SendHorizontal className="w-5 h-5"/>
              </button>
            </div>
        </div>
    </div>
  );
  
  const renderFaqView = () => (
    <div className="flex flex-col h-full animate-fadeInUp">
        <header className="flex items-center p-4 border-b border-gray-800 flex-shrink-0">
            <button onClick={() => setSupportSubView('hub')} className="p-1">
                <ArrowLeft className="w-6 h-6 text-gray-400" />
            </button>
            <h2 className="text-lg font-bold flex-1 text-center mr-8">Tanya Jawab</h2>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            {faqData.map((faq, index) => (
                <details 
                  key={index} 
                  className="bg-gray-900/70 border border-gray-800 rounded-lg group"
                  open={openFaqIndex === index}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenFaqIndex(openFaqIndex === index ? null : index);
                  }}
                >
                    <summary className="p-4 flex justify-between items-center cursor-pointer list-none">
                        <span className="font-semibold text-white">{faq.q}</span>
                        <ChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-300 transform group-open:rotate-180" />
                    </summary>
                    <div className="px-4 pb-4 border-t border-gray-800">
                        <p className="text-gray-300 text-sm leading-relaxed pt-3">{faq.a}</p>
                    </div>
                </details>
            ))}
        </div>
    </div>
);


  const renderSupportHubView = () => {
    const supportOptions = [
      { icon: BookOpen, title: "Panduan Pengguna", subtitle: "Tutorial langkah-demi-langkah" },
      { icon: HelpCircle, title: "Tanya Jawab (FAQs)", subtitle: "Pertanyaan umum", action: () => setSupportSubView('faq') },
      { icon: Video, title: "Video Tutorial", subtitle: "Panduan visual" },
      { icon: Headphones, title: "Hubungi Dukungan", subtitle: "Bicara dengan tim kami", action: handleStartChat },
    ];

    return (
      <div className="flex flex-col h-full animate-fadeInUp support-bg-pattern">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-600 to-fuchsia-500 flex items-center justify-center gap-2 mb-8 shadow-lg shadow-brand-500/30 animate-robot-head-complex animate-robot-gradient">
            <div className="w-3 h-8 bg-white/80 rounded-full animate-robot-eyes-complex"></div>
            <div className="w-3 h-8 bg-white/80 rounded-full animate-robot-eyes-complex" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4">
          {supportOptions.map((opt, index) => (
            <button
              key={index}
              onClick={opt.action}
              className="bg-gray-900/70 border border-gray-800 rounded-xl p-4 text-left hover:bg-gray-800 transition-colors"
            >
              <opt.icon className="w-6 h-6 text-brand-400 mb-2" />
              <h3 className="font-semibold text-white">{opt.title}</h3>
              <p className="text-xs text-gray-400">{opt.subtitle}</p>
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  const renderSupportView = () => {
     switch (supportSubView) {
        case 'hub':
            return renderSupportHubView();
        case 'chat':
            return renderChatView();
        case 'faq':
            return renderFaqView();
        default:
            return renderSupportHubView();
    }
  }

  const renderActiveModal = () => {
    switch (activeModal) {
      case 'marketType':
        return <SelectionModal 
          title="Pilih Jenis Pasar"
          options={Object.keys(symbols).map(k => ({ key: k, value: t[k as MarketType] }))}
          onSelect={(key) => setMarketType(key as MarketType)}
          onClose={() => setActiveModal(null)}
          currentValue={marketType}
        />;
      case 'tradingStyle':
         return <SelectionModal 
          title="Pilih Gaya Trading"
          options={Object.keys(analysisHierarchies).map(k => ({ key: k, value: t[k as TradingStyle] }))}
          onSelect={(key) => setTradingStyle(key as TradingStyle)}
          onClose={() => setActiveModal(null)}
          currentValue={tradingStyle}
        />;
      case 'symbol':
        return renderSymbolModal();
      default:
        return null;
    }
  };


  return (
    <div className="max-w-md mx-auto bg-black rounded-3xl shadow-2xl shadow-brand-500/10 flex flex-col h-[calc(100dvh-2rem)] my-4 relative overflow-hidden border-2 border-gray-800">
      {activeView !== 'support' && <Header />}
      <main className="flex-grow overflow-y-auto pb-20 no-scrollbar">
        {/* FIX: Removed API key form and conditional rendering per guidelines. */}
        {activeView === 'home' ? renderHomeView() : 
            activeView === 'signal' ? renderSignalView() : 
            renderSupportView()}

        {error && !loading && (<div className="p-4"><div className="bg-red-900/50 border border-red-700 rounded-xl p-3 flex items-start gap-3"><AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" /><p className="text-red-300 text-sm">{error}</p></div></div>)}
        
      </main>
      <BottomNav />
      {renderActiveModal()}
    </div>
  );
};

export default MarketAnalyzer;
