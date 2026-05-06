import { motion } from 'motion/react';
import { LogOut, User, Globe, Bell, Zap } from 'lucide-react';

export default function Settings({ onLogout, currentLanguage, currentStyle }: { onLogout: () => void, currentLanguage: string, currentStyle: string }) {
  return (
    <div className="p-6 md:p-10 space-y-8 max-w-4xl mx-auto h-full flex flex-col">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-slate-400 mt-2">Manage your preferences and account security.</p>
      </header>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-[#141416] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <h3 className="text-lg font-semibold text-slate-200 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            Profile details
          </h3>
          <div className="space-y-4">
            <div>
               <p className="text-sm text-slate-500 mb-1">Email</p>
               <p className="text-slate-200 font-medium bg-slate-800/40 px-3 py-2 rounded-lg border border-slate-700/50 inline-block">user@example.com</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <div>
                 <p className="text-sm text-slate-500 mb-1">Active Language</p>
                 <p className="text-slate-200 font-medium bg-slate-800/40 px-3 py-2 rounded-lg border border-slate-700/50 inline-flex items-center gap-2">
                   <Globe className="w-4 h-4 text-slate-400" /> {currentLanguage}
                 </p>
              </div>
              <div>
                 <p className="text-sm text-slate-500 mb-1">Response Style</p>
                 <p className="text-slate-200 font-medium bg-slate-800/40 px-3 py-2 rounded-lg border border-slate-700/50 inline-flex items-center gap-2 capitalize">
                   <Zap className="w-4 h-4 text-amber-400" /> {currentStyle}
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-6 shadow-xl">
           <h3 className="text-lg font-semibold text-rose-400 mb-2">Danger Zone</h3>
           <p className="text-sm text-slate-500 mb-6">These actions cannot be easily undone.</p>
           
           <button
             onClick={onLogout}
             className="flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/30 rounded-xl transition-all font-medium"
           >
             <LogOut className="w-4 h-4" />
             Sign Out
           </button>
        </div>
      </div>
    </div>
  );
}
