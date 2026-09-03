import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Trash2, Volume2, Mic, Clock, Play, Square } from 'lucide-react';
import { motion } from 'motion/react';
import { generateWavBlob } from '../audio/ggwaveEncoder';

interface HistoryPageProps {
  onBack: () => void;
}

export function HistoryPage({ onBack }: HistoryPageProps) {
  const [history, setHistory] = useState<any[]>([]);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const historyStr = localStorage.getItem('soundmesh_history');
    if (historyStr) {
      try {
        setHistory(JSON.parse(historyStr).reverse());
      } catch (e) {
        setHistory([]);
      }
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem('soundmesh_history');
      setHistory([]);
    }
  };

  const togglePlayAudio = async (message: string, index: number) => {
    if (playingIndex === index && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingIndex(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    try {
      setPlayingIndex(index);
      const packet = `SM1|${Math.floor(Math.random()*1000)}|${message}`;
      const blob = await generateWavBlob(packet);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      
      audio.onended = () => {
        setPlayingIndex(null);
        audioRef.current = null;
      };
      
      await audio.play();
    } catch (e) {
      console.error(e);
      setPlayingIndex(null);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-[100dvh] relative overflow-hidden bg-[#020408]">
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-20 w-full">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/10">
          <ArrowLeft size={20} />
        </button>
        <div className="font-bold tracking-widest uppercase text-[11px] sm:text-sm text-gray-300">Message History</div>
        {history.length > 0 ? (
          <button onClick={clearHistory} className="p-2 -mr-2 text-red-400 hover:text-red-300 transition-colors bg-red-500/10 rounded-full hover:bg-red-500/20">
            <Trash2 size={20} />
          </button>
        ) : (
          <div className="w-9"></div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 w-full max-w-2xl mx-auto">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
            <Clock size={48} className="text-gray-700" />
            <p className="text-sm uppercase tracking-widest font-semibold">No records found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/5 border border-white/10 p-5 rounded-3xl flex flex-col gap-3 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.type === 'sent' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {item.type === 'sent' ? <Volume2 size={14} /> : <Mic size={14} />}
                    <span>{item.type === 'sent' ? 'Transmitted' : 'Received'}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-white text-base sm:text-lg leading-relaxed pl-1 flex-1 pr-4">
                    {item.message}
                  </div>
                  {item.type === 'sent' && (
                    <button 
                      onClick={() => togglePlayAudio(item.message, i)}
                      className={`p-2 sm:p-3 rounded-xl border transition-colors flex-shrink-0 group relative ${
                        playingIndex === i 
                        ? 'bg-purple-500/20 border-purple-500/50 hover:bg-purple-500/30 text-purple-400' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {playingIndex === i ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
