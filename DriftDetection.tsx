import { motion } from 'motion/react';
import { AlertTriangle, Activity, Target, Compass, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function DriftDetection({ sessionData, onNavigate }: { sessionData: any; onNavigate: (tab: 'chat' | 'dashboard' | 'history' | 'settings' | 'drift') => void }) {
  const driftScore = sessionData?.driftScore || 0;
  const goals = sessionData?.goals || [];
  const history = sessionData?.chatHistory || [];
  
  // Basic heuristic: if driftScore > 50, user is drifting
  const isDrifting = driftScore > 50;
  const isSeverelyDrifting = driftScore > 75;

  // Grab the last few user messages as "Observed Activity"
  const recentActivities = history.filter((m: any) => m.role === 'user').slice(-3);

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-5xl mx-auto h-full flex flex-col">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Compass className="w-8 h-8 text-rose-400" />
          Goal Drift Detection
        </h1>
        <p className="text-slate-400 mt-2">Agent actively tracking long-term user goals vs current activity.</p>
      </header>

      {goals.length === 0 ? (
        <div className="bg-[#141416]/50 border border-slate-800 rounded-2xl p-10 text-center">
          <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300">No active goals</h3>
          <p className="text-slate-500 mt-2">Set a goal in the dashboard to enable drift detection.</p>
          <button 
            onClick={() => onNavigate('dashboard')}
            className="mt-6 px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl hover:bg-indigo-500/20 transition-all font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Box */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border rounded-3xl p-8 relative overflow-hidden ${
              isSeverelyDrifting 
               ? 'bg-rose-500/10 border-rose-500/30' 
               : isDrifting 
                 ? 'bg-amber-500/10 border-amber-500/30'
                 : 'bg-emerald-500/10 border-emerald-500/30'
            }`}
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  {isDrifting ? (
                    <AlertTriangle className={`w-8 h-8 ${isSeverelyDrifting ? 'text-rose-400' : 'text-amber-400'}`} />
                  ) : (
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  )}
                  <h2 className="text-2xl font-bold text-white">
                    {isSeverelyDrifting ? 'Severe Drift Detected' : isDrifting ? 'Moderate Drift Detected' : 'Aligned with Goals'}
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-[#0A0A0B]/50 p-4 rounded-xl border border-white/5">
                    <p className="text-sm font-medium text-slate-400 mb-1 tracking-wider uppercase">Active Goal</p>
                    <p className="text-slate-200">{goals[0]}</p>
                    {goals.length > 1 && <p className="text-xs text-slate-500 mt-1">+ {goals.length - 1} other goals</p>}
                  </div>
                </div>
              </div>

              {isDrifting && (
                 <div className="mt-8 bg-[#0A0A0B]/80 backdrop-blur border border-white/10 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
                    <p className="text-white font-medium italic">
                      "You've moved away from your goal. Want to refocus?"
                    </p>
                    <button 
                      onClick={() => onNavigate('chat')} 
                      className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                        isSeverelyDrifting ? 'bg-rose-500 hover:bg-rose-400 text-white' : 'bg-amber-500 hover:bg-amber-400 text-[#0A0A0B]'
                      }`}
                    >
                      Yes, Re-align Me
                      <ArrowRight className="w-5 h-5" />
                    </button>
                 </div>
              )}
            </div>
            
            {/* Background glowing blob */}
            <div className={`absolute -bottom-20 -right-20 w-64 h-64 blur-3xl opacity-30 rounded-full ${isSeverelyDrifting ? 'bg-rose-500' : isDrifting ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          </motion.div>

          {/* Analysis View */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#141416]/80 border border-slate-800 rounded-3xl p-8 flex flex-col"
          >
            <h3 className="text-lg font-semibold text-slate-200 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              Observed Activity Analysis
            </h3>
            
            <div className="space-y-4 flex-1">
              {recentActivities.length === 0 ? (
                <p className="text-slate-500 italic text-sm">No recent interactions to analyze.</p>
              ) : (
                recentActivities.map((act: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1 tracking-wider">User Input</p>
                    <p className="text-sm text-slate-300 line-clamp-2">{act.content}</p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-400">Deviation Index</span>
                <span className={`text-sm font-bold font-mono ${isSeverelyDrifting ? 'text-rose-400' : isDrifting ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {driftScore}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${isSeverelyDrifting ? 'bg-rose-500' : isDrifting ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${driftScore}%` }} 
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
