import React, { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, TrendingDown, Minus, Search, Sparkles, Loader2, BarChart3 } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import VoiceControls from '../components/VoiceControls.tsx';
import { getGeminiChatResponse } from '../geminiService';

const LiveMarketPrices: React.FC<{ language: Language }> = ({ language }) => {
  const [search, setSearch] = useState('');
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const t = TRANSLATIONS[language];

  const prices = [
    { crop: 'Wheat', market: 'Nagpur APMC', state: 'Maharashtra', min: 2150, max: 2450, modal: 2300, trend: 'up' },
    { crop: 'Onion', market: 'Lasalgaon', state: 'Maharashtra', min: 1400, max: 1800, modal: 1600, trend: 'down' },
    { crop: 'Rice', market: 'Burdwan', state: 'West Bengal', min: 2800, max: 3200, modal: 3000, trend: 'stable' },
    { crop: 'Tomato', market: 'Kolar', state: 'Karnataka', min: 800, max: 1200, modal: 1000, trend: 'up' },
    { crop: 'Soybean', market: 'Indore', state: 'Madhya Pradesh', min: 4500, max: 4800, modal: 4650, trend: 'down' },
  ];

  const filtered = prices.filter(p => 
    p.crop.toLowerCase().includes(search.toLowerCase()) || 
    p.market.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchMarketSummary = async () => {
      setLoadingSummary(true);
      try {
        const prompt = `Based on current modal prices: Wheat (2300), Rice (3000), Onion (1600). Summarize the overall market sentiment for a farmer in 3 actionable sentences. MANDATORY: REPLY IN ${language}.`;
        const res = await getGeminiChatResponse(prompt, "Market Analyst", language);
        setSummary(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingSummary(false);
      }
    };
    fetchMarketSummary();
  }, [language]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 glass p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">{t.prices}</h1>
          <p className="text-slate-400 font-medium">Aggregated real-time mandi prices across Indian APMCs.</p>
        </div>
        <div className="relative group w-full md:w-[400px] flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search crop or mandi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-14 pr-14 py-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner font-bold"
            />
          </div>
          <VoiceControls enableMic lang={language} onMicResult={setSearch} size="md" />
        </div>
      </div>

      {summary && (
        <div className="glass p-8 rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 relative animate-in slide-in-from-top-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-xl">
                <Sparkles className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em]">Market Sentiment Analyst</span>
            </div>
            <VoiceControls enableSpeaker textToSpeak={summary} lang={language} size="md" />
          </div>
          <p className="text-slate-200 text-lg leading-relaxed italic font-medium border-l-4 border-emerald-500/30 pl-6">{summary}</p>
        </div>
      )}

      <div className="glass rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800">
                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Commodity</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Mandi / State</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Min-Max Range</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Modal Price</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Market Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.map((p, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 group-hover:border-emerald-500/30 transition-all">
                          <BarChart3 className="w-5 h-5 text-slate-600 group-hover:text-emerald-500" />
                       </div>
                       <div className="space-y-1">
                        <div className="font-black text-white text-lg tracking-tight group-hover:text-emerald-400 transition-colors">{p.crop}</div>
                        <div className="flex items-center gap-2">
                           <VoiceControls 
                            enableSpeaker 
                            textToSpeak={`${p.crop} in ${p.market}. Modal price is ${p.modal} rupees per quintal.`} 
                            lang={language} 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                           />
                        </div>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="text-slate-300 font-bold text-sm tracking-tight">{p.market}</div>
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{p.state}</div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="text-white text-base font-black tracking-tighter">₹{p.min.toLocaleString()} — ₹{p.max.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Daily Range</div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl font-black text-lg shadow-sm border border-emerald-500/20">
                      <IndianRupee className="w-4 h-4" /> {p.modal.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    {p.trend === 'up' && <span className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] bg-emerald-500/5 px-3 py-1.5 rounded-lg w-fit border border-emerald-500/20"><TrendingUp className="w-4 h-4" /> Bullish</span>}
                    {p.trend === 'down' && <span className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] bg-red-500/5 px-3 py-1.5 rounded-lg w-fit border border-red-500/20"><TrendingDown className="w-4 h-4" /> Bearish</span>}
                    {p.trend === 'stable' && <span className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] bg-slate-800/50 px-3 py-1.5 rounded-lg w-fit border border-slate-700"><Minus className="w-4 h-4" /> Neutral</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LiveMarketPrices;
