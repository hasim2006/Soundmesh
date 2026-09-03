import React from 'react';
import { motion } from 'motion/react';
import { Radio, Mic, Volume2, Zap, WifiOff, History } from 'lucide-react';

interface LandingPageProps {
  onStartSend: () => void;
  onStartReceive: () => void;
  onViewHistory: () => void;
}

export function LandingPage({ onStartSend, onStartReceive, onViewHistory }: LandingPageProps) {
  return (
    <div className="flex flex-col flex-1 selection:bg-blue-500/30 w-full max-w-[100vw]">
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-10 py-4 sm:py-6 border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 w-full">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
             <div className="w-2 h-2 sm:w-4 sm:h-4 bg-white rounded-full animate-pulse"></div>
          </div>
          <span className="text-lg sm:text-2xl font-black tracking-tighter text-white">SOUND<span className="text-blue-400">MESH</span></span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]"></div>
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-blue-400">SM1-BETA</span>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <main className="flex-1 flex flex-col justify-center px-4 sm:px-6 pt-10 pb-20 relative z-10 max-w-4xl mx-auto w-full">
        <div className="text-center space-y-6 sm:space-y-8 mb-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-medium text-blue-400"
          >
            <Zap size={14} className="text-blue-400" />
            <span>Air-Gapped Communication</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1]"
          >
            Send data <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              through sound.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-2"
          >
            Transfer short messages between nearby devices using only speakers and microphones. No Bluetooth or Wi-Fi required.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 sm:pt-8 w-full"
          >
            <button 
              onClick={onStartSend}
              className="w-full sm:w-auto px-8 py-5 sm:py-4 rounded-3xl bg-blue-600 text-white font-bold text-[15px] sm:text-sm tracking-widest uppercase transition-transform hover:bg-blue-500 hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-3 shadow-lg shadow-blue-600/30"
            >
              <Volume2 size={22} />
              <span>Send Message</span>
            </button>
            <button 
              onClick={onStartReceive}
              className="w-full sm:w-auto px-8 py-5 sm:py-4 rounded-3xl bg-white/5 text-white font-bold text-[15px] sm:text-sm tracking-widest uppercase border border-white/10 transition-all hover:bg-white/10 hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-3 backdrop-blur-sm"
            >
              <Mic size={22} />
              <span>Receive Message</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 pt-8"
          >
            <div className="flex items-center space-x-2 text-xs sm:text-[11px] text-gray-500 uppercase tracking-widest font-semibold bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <WifiOff size={14} /> <span>No Networks</span>
            </div>
            <div className="flex items-center space-x-2 text-xs sm:text-[11px] text-gray-500 uppercase tracking-widest font-semibold bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <Radio size={14} /> <span>Acoustic Transfer</span>
            </div>
          </motion.div>
        </div>

        {/* History Section for Mobile */}
        <div className="mt-8 pt-8 border-t border-white/5 w-full">
          <h3 className="text-sm font-semibold text-gray-400 tracking-widest uppercase mb-4 sm:mb-6 flex items-center justify-center space-x-2">
            <History size={16} />
            <span>Transmission History</span>
          </h3>
          
          {(() => {
            const historyStr = localStorage.getItem('soundmesh_history');
            if (!historyStr) return <p className="text-center text-sm text-gray-600">No transmissions yet.</p>;
            try {
              const history = JSON.parse(historyStr);
              if (history.length === 0) return <p className="text-center text-sm text-gray-600">No transmissions yet.</p>;
              return (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {history.slice().reverse().slice(0, 3).map((item: any, i: number) => (
                      <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-start justify-between backdrop-blur-sm">
                        <div className="flex items-start gap-3 w-full">
                           <div className={`mt-0.5 p-2 rounded-xl ${item.type === 'sent' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                             {item.type === 'sent' ? <Volume2 size={16} /> : <Mic size={16} />}
                           </div>
                           <div className="flex-1 min-w-0">
                             <div className="flex items-center justify-between mb-1">
                               <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                 {item.type === 'sent' ? 'Sent' : 'Received'}
                               </div>
                               <div className="text-[10px] text-gray-600">
                                 {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                               </div>
                             </div>
                             <div className="text-sm sm:text-base text-gray-200 truncate">{item.message}</div>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {history.length > 3 && (
                    <button 
                      onClick={onViewHistory}
                      className="w-full py-4 rounded-2xl bg-white/5 text-gray-400 font-bold text-xs tracking-widest uppercase border border-white/5 transition-all hover:bg-white/10 hover:text-white"
                    >
                      View All History
                    </button>
                  )}
                </div>
              );
            } catch (e) {
              return null;
            }
          })()}
        </div>

      </main>
    </div>
  );
}
