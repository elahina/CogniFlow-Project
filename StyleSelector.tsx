import { motion } from 'motion/react';
import { GraduationCap, Code2, Beaker, Zap } from 'lucide-react';

const styles = [
  { id: 'student', title: 'Student', description: 'Simple, easy-to-understand explanations.', icon: GraduationCap, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'developer', title: 'Developer', description: 'Technical, code-focused, and precise answers.', icon: Code2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'researcher', title: 'Researcher', description: 'Deep dives, analytical logic, and thorough research.', icon: Beaker, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10' },
  { id: 'executive', title: 'Executive', description: 'Concise, action-oriented, and high-level summaries.', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
];

export default function StyleSelector({ onSelect }: { onSelect: (style: string) => void }) {
  return (
    <div className="flex min-h-screen bg-[#0A0A0B] text-slate-200 overflow-hidden font-sans relative selection:bg-indigo-500/30 w-full">
      <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex flex-col flex-1 items-center justify-center p-6 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-3">Adapt Your System</h1>
            <p className="text-slate-400 max-w-sm mx-auto">
              How would you like the cognitive agent to communicate with you?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {styles.map((style, idx) => (
              <motion.button
                key={style.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => onSelect(style.id)}
                className="group relative flex flex-col items-start p-6 bg-[#141416]/80 backdrop-blur-xl border border-slate-800 hover:border-indigo-500/50 rounded-2xl hover:bg-[#1A1A1D] transition-all text-left overflow-hidden h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${style.bg}`}>
                  <style.icon className={`w-6 h-6 ${style.color}`} />
                </div>
                
                <h3 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors mb-2">
                  {style.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {style.description}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
