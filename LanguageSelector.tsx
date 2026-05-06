import { motion } from 'motion/react';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'English', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'Kannada', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'Hindi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
];

export default function LanguageSelector({ onSelect }: { onSelect: (lang: string) => void }) {
  return (
    <div className="flex min-h-screen bg-[#0A0A0B] text-slate-200 overflow-hidden font-sans relative selection:bg-indigo-500/30 w-full">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex flex-col flex-1 items-center justify-center p-6 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-10">
            <div className="bg-indigo-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.15)]">
              <Globe className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-3">Select Language</h1>
            <p className="text-slate-400">
              Choose your preferred language for the cognitive agent interface.
            </p>
          </div>

          <div className="grid gap-4">
            {languages.map((lang, idx) => (
              <motion.button
                key={lang.code}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => onSelect(lang.code)}
                className="group relative flex items-center p-5 bg-[#141416]/80 backdrop-blur-xl border border-slate-800 hover:border-indigo-500/50 rounded-2xl hover:bg-[#1A1A1D] transition-all text-left overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="text-2xl mr-4">{lang.flag}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                    {lang.name}
                  </h3>
                  <p className="text-sm text-slate-500">{lang.native}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
