import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Zap, GitBranch, Shield, Sparkles, Check, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function ShadowSim({ sessionData, onNavigate }: { sessionData: any; onNavigate: (tab: 'chat' | 'dashboard' | 'history' | 'drift' | 'settings' | 'shadow') => void }) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  const shadowLogs = sessionData?.shadowLogs || [];

  const strategies = [
    { id: 'analytical', name: 'Analytical Deep-Dive', score: 94, icon: GitBranch, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    { id: 'creative', name: 'Creative Association', score: 82, icon: Sparkles, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/30' },
    { id: 'defensive', name: 'Risk-Averse Guardrail', score: 76, icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-5xl mx-auto h-full flex flex-col">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Layers className="w-8 h-8 text-fuchsia-400" />
          "Shadow Sim" Engine
        </h1>
        <p className="text-slate-400 mt-2">
          Future-Self Learning: Spawning parallel shadow agents to test strategies before responding.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 bg-[#141416]/80 border border-slate-800 rounded-3xl p-8 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              Live Simulation Arena
            </h3>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">Engine Active</span>
            </div>
          </div>

          <p className="text-sm text-slate-400 mb-6">
            Instead of learning from mistakes, the main agent runs parallel universes. It spawns shadow agents to test different approaches on your latest query and selects the optimal path.
          </p>

          <div className="space-y-4">
            {strategies.map((strategy) => (
              <div 
                key={strategy.id}
                className={`relative overflow-hidden p-4 rounded-2xl border transition-all ${
                  selectedStrategy === strategy.id 
                    ? `bg-indigo-500/10 border-indigo-500/50 scale-[1.02] shadow-[0_0_20px_rgba(99,102,241,0.1)]` 
                    : `bg-slate-800/20 border-slate-700/30 hover:border-slate-600/50`
                }`}
                onMouseEnter={() => setSelectedStrategy(strategy.id)}
                onMouseLeave={() => setSelectedStrategy(null)}
              >
                <div className="flex items-center justify-between z-10 relative">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${strategy.bg} ${strategy.border}`}>
                      <strategy.icon className={`w-5 h-5 ${strategy.color}`} />
                    </div>
                    <div>
                      <h4 className="text-slate-200 font-medium">{strategy.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Simulated Path</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xl font-bold text-white font-mono">{strategy.score}%</div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500">Viability</div>
                    </div>
                    {strategy.id === 'analytical' && (
                       <div className="bg-indigo-600 rounded-full p-1 border-2 border-[#141416]">
                         <Check className="w-3 h-3 text-white" />
                       </div>
                    )}
                  </div>
                </div>
                
                {selectedStrategy === strategy.id && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]"
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#141416]/80 border border-slate-800 rounded-3xl p-8 flex flex-col"
        >
          <h3 className="text-lg font-semibold text-slate-200 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            Simulation Logs
          </h3>
          
          <div className="flex-1 space-y-4 overflow-y-auto">
            {shadowLogs.length > 0 ? shadowLogs.map((log: any, idx: number) => (
              <div key={idx} className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
                 <p className="text-xs text-slate-400 mb-1">Query evaluated:</p>
                 <p className="text-sm text-slate-200 truncate blur-[1px] hover:blur-none transition-all">{log.query}</p>
                 <div className="mt-2 flex items-center justify-between">
                   <span className="text-[10px] text-indigo-400 font-bold uppercase">Optimal: {log.winner}</span>
                   <span className="text-[10px] text-slate-500">Confidence: {log.confidence}%</span>
                 </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-50">
                <Layers className="w-8 h-8 text-slate-500" />
                <p className="text-sm text-slate-400">Waiting for next query to trigger shadow agents...</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-800/60">
             <button 
               onClick={() => onNavigate('chat')}
               className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all text-sm font-medium"
             >
               Test in Chat
             </button>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
