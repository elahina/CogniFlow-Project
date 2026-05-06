import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Target, Brain, ArrowUpRight, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({ sessionData, onUpdate, onNavigate }: { sessionData: any; onUpdate: () => void; onNavigate: (tab: 'chat' | 'dashboard' | 'settings') => void }) {
  const [driftHistory, setDriftHistory] = useState<any[]>([]);
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    fetch('/api/drift-detection')
      .then(r => r.json())
      .then(data => {
        setDriftHistory(data.history || []);
      })
      .catch(e => console.error(e));
  }, [sessionData]);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    try {
      await fetch('/api/goal', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: newGoal })
      });
      setNewGoal("");
      onUpdate();
    } catch(e) { console.error(e); }
  };

  const driftScore = sessionData?.driftScore || 0;
  
  // Customizing drift colors
  let driftColorClass = "text-emerald-400";
  let driftBgClass = "bg-emerald-500/10";
  let driftBorderClass = "border-emerald-500/20";
  if (driftScore > 30) {
    driftColorClass = "text-yellow-400";
    driftBgClass = "bg-yellow-500/10";
    driftBorderClass = "border-yellow-500/20";
  }
  if (driftScore > 70) {
    driftColorClass = "text-rose-400";
    driftBgClass = "bg-rose-500/10";
    driftBorderClass = "border-rose-500/20";
  }

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-6xl mx-auto h-full flex flex-col">
      <header>
        <h1 className="text-3xl font-bold flex items-center gap-3 tracking-tight">
          System Dashboard
          <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-medium tracking-normal align-middle border border-slate-700">Real-time</span>
        </h1>
        <p className="text-slate-400 mt-2">Monitor Cognitive Goal Alignment and Memory States</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Drift Score Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#141416] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-800/50 rounded-xl">
              <Activity className="w-5 h-5 text-slate-300" />
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${driftBgClass} ${driftColorClass} ${driftBorderClass}`}>
              {driftScore > 70 ? 'High Drift' : driftScore > 30 ? 'Moderate Drift' : 'Aligned'}
            </span>
          </div>
          <div>
            <h3 className="text-slate-400 font-medium text-sm">Goal Drift Index</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold font-mono tracking-tight text-white">{driftScore}</span>
              <span className="text-slate-500 text-sm">/ 100</span>
            </div>
          </div>
          {/* subtle decorative background */}
          <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${driftBgClass.replace('/10', '')}`} />
        </motion.div>

        {/* Total Goals Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#141416] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <h3 className="text-slate-400 font-medium text-sm">Active Goals</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold font-mono tracking-tight text-white">{sessionData?.goals?.length || 0}</span>
            </div>
          </div>
        </motion.div>

        {/* Memory Fragments Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#141416] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
           <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-fuchsia-500/10 rounded-xl">
              <Brain className="w-5 h-5 text-fuchsia-400" />
            </div>
          </div>
          <div>
            <h3 className="text-slate-400 font-medium text-sm">Memory Fragments</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold font-mono tracking-tight text-white">{sessionData?.memories?.length || 0}</span>
              <span className="text-slate-500 text-sm">learned</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[400px]">
        
        {/* Goals Management */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="md:col-span-1 bg-[#141416] border border-slate-800 rounded-2xl p-6 flex flex-col h-full">
          <h3 className="text-lg font-semibold mb-4 text-slate-200">Current Goals</h3>
          
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {(!sessionData?.goals || sessionData.goals.length === 0) ? (
              <p className="text-slate-500 text-sm py-8 text-center italic">No goals set yet. Add one below.</p>
            ) : (
              sessionData.goals.map((g: string, i: number) => (
                <div key={i} className="px-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-xl text-sm text-slate-300 flex items-start justify-between gap-3 group">
                  <div className="flex items-start gap-3 flex-1 pt-1">
                    <Target className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="leading-snug">{g}</span>
                  </div>
                  <button 
                    onClick={() => onNavigate('chat')} 
                    className="opacity-0 group-hover:opacity-100 shrink-0 px-2.5 py-1 text-xs rounded border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 transition-all font-medium"
                  >
                    Focus
                  </button>
                </div>
              ))
            )}
          </div>

          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!newGoal.trim()) return;
            try {
              await fetch('/api/goal', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ goal: newGoal })
              });
              setNewGoal("");
              onUpdate();
              onNavigate('chat');
            } catch(e) { console.error(e); }
          }} className="mt-auto relative">
            <input 
              type="text" 
              placeholder="Add new goal..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              className="w-full bg-[#0A0A0B] border border-slate-700 rounded-xl py-3 px-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 pr-12 transition-colors"
            />
            <button type="submit" disabled={!newGoal.trim()} className="absolute right-2 top-2 bottom-2 w-8 h-8 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:bg-slate-700 rounded-lg text-white transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>

        {/* Trend Graph */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="md:col-span-2 bg-[#141416] border border-slate-800 rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-slate-400" />
              Drift Trajectory
            </h3>
            <span className="text-xs text-slate-500 px-3 py-1 bg-slate-800 rounded-md">Last 10 steps</span>
          </div>

          <div className="flex-1 w-full min-h-[250px] relative">
            {driftHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={driftHistory}>
                  <defs>
                     <linearGradient id="colorDrift" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D2D33" vertical={false} />
                  <XAxis dataKey="step" stroke="#52525B" tick={{fill: '#71717A', fontSize: 12}} dy={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#52525B" tick={{fill: '#71717A', fontSize: 12}} dx={-10} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', borderRadius: '8px', color: '#E4E4E7' }}
                    itemStyle={{ color: '#A5B4FC' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="drift" 
                    stroke="#818cf8" 
                    strokeWidth={3}
                    dot={{r: 4, fill: '#818cf8', strokeWidth: 0}}
                    activeDot={{r: 6, fill: '#6366f1', strokeWidth: 0}}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 flex-col gap-2">
                  <Activity className="w-8 h-8 opacity-50" />
                  <p className="text-sm">Initiate chat to track drift over time</p>
                </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
